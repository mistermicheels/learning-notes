const path = require("path");
const fs = require("fs");

try {
    console.log("Checking if all notes have Contents heading");
    check();
    console.log("Confirmed that all notes have Contents heading");
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
            const contentsLines = contents.split(/\r\n|\r|\n/);

            if (!contentsLines.includes('## Contents')) {
                throw new Error(`No 'Contents' heading found in file ${entryPath}`);
            }
        }
    }
}

function shouldIgnoreDirectory(name) {
    return name.startsWith(".") || name.startsWith("_") || name === "node_modules";
}

function shouldIgnoreFile(name) {
    return !name.endsWith(".md") || name === "README.md" || name === 'CONTRIBUTING.md';
}
