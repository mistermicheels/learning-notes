const path = require("path");
const fs = require("fs");
const endOfLine = require("os").EOL;

const baseDirectoryPath = path.join(__dirname, "..");
const indentationUnit = "    ";

// will be filled and read by functions below
const treeLines = [];

fillTreeLines();
writeTreeToMainReadme();

function fillTreeLines() {
    processDirectory(baseDirectoryPath, 0);
}

function processDirectory(absolutePath, indentationLevel) {    
    const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
    
    for (const entry of entries) {
        const entryPath = path.join(absolutePath, entry.name);
        
        if (entry.isDirectory() && shouldIncludeDirectory(entry.name)) {
            writeTreeLine(`**${entry.name}**`, entryPath, indentationLevel)
            processDirectory(entryPath, indentationLevel + 1);
        } else if (shouldIncludeFile(entry.name, entryPath)) {
            processMarkdownFile(entryPath, indentationLevel);
        }
    }
}

function shouldIncludeDirectory(name) {
    return !name.startsWith(".") && !name.startsWith("_");
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
    const newTreeLine = `${indentation}- [${name}](${relativePath})`;
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


