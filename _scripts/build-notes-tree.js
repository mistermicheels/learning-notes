const path = require("path");
const fs = require("fs");
const endOfLine = require("os").EOL;

const baseDirectoryPath = path.join(__dirname, "..");
const indentationUnit = "    ";

// will be filled and read by functions below
const treeLines = [];

console.log("Processing files in order to build notes tree");
processFiles();
console.log("Writing notes tree to main README file");
writeTreeToMainReadme();
console.log("Finished writing notes tree to main README file");

function processFiles() {    
    processDirectory(baseDirectoryPath, 0);
}

function processDirectory(absolutePath, indentationLevel) {
    const entries = fs.readdirSync(absolutePath, { withFileTypes: true });

    const directories = entries.filter(entry => entry.isDirectory());
    const files = entries.filter(entry => !entry.isDirectory());

    for (const directory of directories) {
        const directoryPath = getFullPath(directory.name, absolutePath);

        if (shouldIncludeDirectory(directory.name)) {
            writeTreeLine(`**${directory.name}**`, directoryPath, indentationLevel)
            processDirectory(directoryPath, indentationLevel + 1);
        }
    }

    for (const file of files) {
        const filePath = getFullPath(file.name, absolutePath);

        if (shouldIncludeFile(file.name, filePath)) {
            processMarkdownFile(filePath, indentationLevel);
        }
    }
}

function getFullPath(name, parentPath) {
    return path.join(parentPath, name);
}

function shouldIncludeDirectory(name) {
    return !name.startsWith(".") && !name.startsWith("_") && name !== "node_modules";
}

function shouldIncludeFile(name, absolutePath) {
    return name.endsWith(".md") && getRelativePath(absolutePath) !== "README.md";
}

function getRelativePath(absolutePath) {
    return path.relative(baseDirectoryPath, absolutePath);
}

function processMarkdownFile(absolutePath, indentationLevel) {
    const fullContents = fs.readFileSync(absolutePath, { encoding: "utf-8" });
    const firstLine = fullContents.split(endOfLine, 1)[0];

    if (!firstLine.startsWith("# ")) {
        throw new Error(`No title found for Markdown file ${absolutePath}`);
    }

    const title = firstLine.substring(2);
    writeTreeLine(title, absolutePath, indentationLevel);
}

function writeTreeLine(name, absolutePath, indentationLevel) {
    const indentation = indentationUnit.repeat(indentationLevel);
    const relativePath = getRelativePath(absolutePath);
    const relativePathForwardSlashes = relativePath.replace(/\\/g, "/");
    const newTreeLine = `${indentation}- [${name}](${relativePathForwardSlashes})`;
    treeLines.push(newTreeLine);
}

function writeTreeToMainReadme() {
    const mainReadmePath = path.join(baseDirectoryPath, "README.md");
    const currentReadmeContents = fs.readFileSync(mainReadmePath, { encoding: "utf-8" });
    const notesTreeMarker = "<!-- auto-generated notes tree starts here -->";
    const indexMarker = currentReadmeContents.indexOf(notesTreeMarker);

    if (indexMarker < 0) {
        throw new Error("No notes tree marker found in README.md");
    }

    const contentsBeforeMarker = currentReadmeContents.substring(0, indexMarker);

    const treeText = treeLines.join(endOfLine);
    const newContents = contentsBeforeMarker + notesTreeMarker + endOfLine.repeat(2) + treeText;
    fs.writeFileSync(mainReadmePath, newContents);
}


