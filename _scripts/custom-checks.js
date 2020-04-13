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

function checkContentsHeadingPresent(contents, filePath) {
    const contentsLines = contents.split(/\r\n|\r|\n/);

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
