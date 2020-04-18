// this needs to run after markdown-notes-tree, that way we can make more assumptions about file contents

const path = require("path");
const fs = require("fs");

try {
    console.log("Performing custom checks");
    check();
    console.log("Finished custom checks");
} catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
}

function check() {
    checkInFolder(process.cwd());
}

function checkInFolder(absolutePath) {
    const entries = fs.readdirSync(absolutePath, { withFileTypes: true });

    for (const entry of entries) {
        const name = entry.name;
        const isDirectory = entry.isDirectory();
        const entryPath = path.join(absolutePath, name);

        if (isDirectory && !shouldIgnoreDirectory(name)) {
            const readmePath = path.join(entryPath, "README.md");
            const readmeContents = fs.readFileSync(readmePath, { encoding: "utf-8" });
            checkCustomDirectoryReadmeTitle(readmeContents, name, readmePath)
            checkInFolder(entryPath);
        } else if (!isDirectory && !shouldIgnoreFile(name)) {
            const contents = fs.readFileSync(entryPath, { encoding: "utf-8" });
            checkContentsHeadingPresent(contents, entryPath);
            checkNoLooseLists(contents, entryPath);
        }
    }
}

function shouldIgnoreDirectory(name) {
    return name.startsWith(".") || name.startsWith("_") || name === "node_modules";
}

function shouldIgnoreFile(name) {
    return !name.endsWith(".md") || name === "README.md" || name === 'CONTRIBUTING.md';
}

function checkCustomDirectoryReadmeTitle(contents, name, filePath) {
    const contentsLines = getLines(contents);
    
    // runs after markdown-notes-tree, so we know the position of the title
    const titleLine = contentsLines[2];

    if (!titleLine.startsWith("# ")) {
        throw new Error(`No title found in file ${filePath}`);
    }

    const title = titleLine.substring(2);
    
    if (title === name) {
        throw new Error(`No custom title set in file ${filePath}`);
    }
}

function getLines(input) {
    return input.split(/\r\n|\r|\n/);
}

function checkContentsHeadingPresent(contents, filePath) {
    const contentsLines = getLines(contents);

    if (!contentsLines.includes('## Contents')) {
        throw new Error(`No 'Contents' heading found in file ${filePath}`);
    }
}

function checkNoLooseLists(contents, filePath) {
    const looseListRegex = /- +[^\r\n]+(\r\n\r\n|\r\r|\n\n)\s*-/;

    if (looseListRegex.test(contents)) {
        const firstMatch = looseListRegex.exec(contents)[0];
        throw new Error(`Loose list found in file ${filePath}\nMatch: ${JSON.stringify(firstMatch)}`);
    }
}
