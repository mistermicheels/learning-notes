// this needs to run after pre-commit scripts, that way we can make more assumptions about file contents

const path = require("path");
const fsExtra = require("fs-extra");
const frontMatter = require("front-matter");
const remark = require("remark");
const visit = require('unist-util-visit');

const websiteDocsPath = getAbsolutePath("_website", "docs");
const websiteStaticDocsPath = getAbsolutePath("_website", "docs-static");
const websiteImagesFromNotesPath = getAbsolutePath("_website", "static", "img", "from-notes");
const websiteSidebarsFilePath = getAbsolutePath("_website", "sidebars.js");

try {
    console.log("Removing old website data");
    removeOldData();
    console.log("Writing new website data");
    writeData();
    console.log("Finished writing website data");
} catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
}

function getAbsolutePath(...relativePath) {
    return path.join(process.cwd(), ...relativePath);  
}

function removeOldData() {
    fsExtra.removeSync(websiteDocsPath);
    fsExtra.removeSync(websiteImagesFromNotesPath);
}

function writeData() {
    fsExtra.copySync(websiteStaticDocsPath, websiteDocsPath);
    const sidebarItemsForNotes = writeDataForDirectoryAndReturnSidebarItems("");

    const sidebars = { 
        docs: [
            {
                type: "category",
                label: "About",
                items: ["about/about", "about/contributing"]
            },
            ...sidebarItemsForNotes
        ]
    };

    const sidebarsFileContents = "module.exports = " + JSON.stringify(sidebars, undefined, 4);
    fsExtra.outputFileSync(websiteSidebarsFilePath, sidebarsFileContents, { encoding: "utf-8" });
}

/**
 * writes notes to docs, writes images to static images from notes, returns sidebar fragments.
 * this combines writing data and returning data, not ideal but probably better than traversing everything twice.
 */
function writeDataForDirectoryAndReturnSidebarItems(relativePath) {
    const entries = getSortedFileAndDirectoryEntries(relativePath);
    const sidebarItems = [];

    for (const entry of entries) {
        const name = entry.name;
        const isDirectory = entry.isDirectory();
        const relativeEntryPath = path.join(relativePath, name);

        if (isDirectory) {
            if (isImagesDirectory(name)) {
                writeDataForImagesDirectory(relativeEntryPath);
            } else if (isNotesDirectory(name)) {
                const title = getTitleForDirectory(relativeEntryPath);
                const directorySidebarItems = writeDataForDirectoryAndReturnSidebarItems(relativeEntryPath);
                sidebarItems.push({ type: "category", label: title, items: directorySidebarItems });
            }
        } else if (isNoteFile(name)) {
            writeDataForNote(relativeEntryPath);
            const docId = normalizeUrl(removeMarkdownExtension(relativeEntryPath));
            sidebarItems.push(docId);
        }
    }

    return sidebarItems;
}

function getSortedFileAndDirectoryEntries(relativePath) {
    const absolutePath = getAbsolutePath(relativePath);  
    const entries = fsExtra.readdirSync(absolutePath, { withFileTypes: true });
    const directories = entries.filter(entry => entry.isDirectory());
    const files = entries.filter(entry => !entry.isDirectory());    
    return [...files, ...directories];
}

function isImagesDirectory(name) {
    return name === "_img";
}

function writeDataForImagesDirectory(relativePath) {
    const absolutePath = getAbsolutePath(relativePath);    
    const subdirectoryNames = fsExtra.readdirSync(absolutePath);

    for (const subdirectoryName of subdirectoryNames) {
        const relativeSourcePath = path.join(relativePath, subdirectoryName);
        const absoluteSourcePath = getAbsolutePath(relativeSourcePath);

        const relativePathWithoutImg = path.join(relativePath, "..", subdirectoryName);
        let absoluteTargetPath = path.join(websiteImagesFromNotesPath, relativePathWithoutImg);
        absoluteTargetPath = absoluteTargetPath.toLowerCase();

        fsExtra.copySync(absoluteSourcePath, absoluteTargetPath);
    }
}

function isNotesDirectory(name) {
    return !name.startsWith(".") && !name.startsWith("_") && name !== "node_modules";
}

function getTitleForDirectory(relativePath) {
    const relativeReadmePath = path.join(relativePath, "README.md");
    const absoluteReadmePath = getAbsolutePath(relativeReadmePath); 
    const contents = fsExtra.readFileSync(absoluteReadmePath, { encoding: "utf-8" }); 

    // because this runs after pre-commit scripts, we know the first line that looks like a title will be the actual title

    for (const line of contents.split(getEndOfLineRegex())) {
        if (line.startsWith("# ")) {
            return line.substring(2);
        }
    }

    throw new Error(`No title found for file ${relativePath}`);
}

function getEndOfLineRegex() {
    // return new instance every time because it is stateful (see exec())
    return /\r\n|\r|\n/;
}

function isNoteFile(name) {
    return name.endsWith(".md") && name !== "README.md" && name !== 'CONTRIBUTING.md';
}

function writeDataForNote(relativePath) {
    const absoluteEntryPath = getAbsolutePath(relativePath);
    const contents = fsExtra.readFileSync(absoluteEntryPath, { encoding: "utf-8" });
    const newContents = transformNoteContents(contents, relativePath);
    const absoluteTargetPath = path.join(websiteDocsPath, relativePath.toLowerCase());
    fsExtra.outputFileSync(absoluteTargetPath, newContents, { encoding: "utf-8" });
}

function normalizeUrl(url) {
    return url.replace(/\\/g, "/").toLowerCase();
}

function removeMarkdownExtension(url) {
    return url.replace(".md", "");
}

function transformNoteContents(contents, relativePath) {
    const parsedFrontMatter = frontMatter(contents);
    const treeTitle = parsedFrontMatter.attributes.tree_title;
    contents = parsedFrontMatter.body.trimLeft();

    contents = stripTableOfContents(contents);
    contents = adjustImagesAndLinks(contents, relativePath);
    contents = replaceTitleByYamlFrontmatter(contents, treeTitle, relativePath);
    return contents;
}

function stripTableOfContents(input) {
    // because this runs after pre-commit scripts, we know that each note has a Contents header with specific structure below it

    const contentsHeaderIndex = input.indexOf("## Contents");
    const nextHeaderIndex = input.indexOf("## ", contentsHeaderIndex + 1);
    return input.substring(0, contentsHeaderIndex) + input.substring(nextHeaderIndex);
}

function adjustImagesAndLinks(input, relativePath) {
    let result;

    remark()
        .use(remarkAdjustImagesAndLinks, { relativePath })
        .process(input, (error, file) => {
            if (error) {
                throw error;
            }

            result = String(file);
        });

    return result;
}

// adapted from https://github.com/remarkjs/remark-inline-links/blob/master/index.js
function remarkAdjustImagesAndLinks({ relativePath }) {
    return transformer;

    function transformer(tree) {  
        visit(tree, onVisit);

        function onVisit(node, index, parent) {
            let replacement;

            if (node.type === "image") {
                replacement = getImageNodeReplacement(node, relativePath);
            } else if (node.type === "link") {
                const isInternalLink = !node.url.startsWith("http");
                
                if (isInternalLink) {
                    replacement = getInternalLinkNodeReplacement(node);
                } else {
                    replacement = getExternalLinkNodeReplacement(node, relativePath);
                }
            }

            if (replacement) {
                parent.children[index] = replacement;
                return [visit.CONTINUE, index + 1];
            }
        }
    }
}

function getImageNodeReplacement(node, relativeFilePath) {
    const originalUrl = node.url;
    const imageFilename = path.basename(originalUrl);
    const relativeFolder = removeMarkdownExtension(relativeFilePath);

    const joinedPath = path.join("/img/from-notes", relativeFolder, imageFilename);
    const newUrl = normalizeUrl(joinedPath)

    return { 
        ...node, 
        url: newUrl
    };
}

function getInternalLinkNodeReplacement(node) {
    let newUrl = normalizeUrl(removeMarkdownExtension(node.url));

    if (!node.url.startsWith(".")) {
        newUrl = "./" + newUrl;
    }

    return { 
        ...node, 
        url: newUrl
    };
}

/**
 * makes link open in new window using an HTML link with target _blank and proper rel attribute
 */
function getExternalLinkNodeReplacement(node, relativeFilePath) {
    if (node.children.length !== 1 || node.children[0].type !== "text") {
        const childTypes = node.children.map(child => child.type);

        throw new Error(
            `Problem with ${relativeFilePath}: only links with single 'text' child are supported.` +
            "\n" +
            `Now found types [${childTypes.toString()}] for link with URL ${node.url}.`
        );
    }

    const linkText = node.children[0].value;

    return {
        type: "html",
        value: `<a href="${ node.url }" target="_blank" rel="nofollow noopener noreferrer">${linkText}</a>`
    };
}

function replaceTitleByYamlFrontmatter(input, treeTitle, relativePath) {
    // because this runs after pre-commit scripts, we know the first line of each note will be the title
    const titleLine = input.split(getEndOfLineRegex(), 1)[0];
    const title = titleLine.substring(2);

    if (title.includes("`")) {
        throw new Error(`Problem with file ${relativePath}: code in note title is not supported`);
    }

    const contentsAfterTitleLine = input.substring(titleLine.length);
    const description = generateDescription(input);    

    let frontMatterContents =
        `title: ${title}` + 
        "\n" +
        `description: >-` + // https://yaml-multiline.info/
        "\n" +
        `    ${description}`;

    if (treeTitle) {
        frontMatterContents = 
            frontMatterContents +
            "\n" +
            `sidebar_label: ${treeTitle}`;
    }

    const frontMatter = "---" + "\n" + frontMatterContents + "\n" + "---";
    return frontMatter + contentsAfterTitleLine;
}

function generateDescription(input) {    
    // we know that the TOC has been stripped by now

    const firstRealHeaderIndex = input.indexOf("## ");
    const contentsFromFirstRealHeader = input.substring(firstRealHeaderIndex);
    const lines = contentsFromFirstRealHeader.split(getEndOfLineRegex());
    const firstRealHeaderLine = lines[0];
    const firstRealHeader = firstRealHeaderLine.substring(3);
    
    const linesAfterFirstRealHeader = lines.slice(1);
    const firstTenTextLines = linesAfterFirstRealHeader.filter(line => !!line).slice(0, 10);
    const startOfText = firstTenTextLines.map(line => line.trim().replace(/ +/g, " ")).join(" ");

    const description = firstRealHeader + " | " + startOfText;
    return description.substring(0, 250) + " (truncated)";
}
