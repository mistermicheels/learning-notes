---
tree_title: Compiler API
description: An overview of how you can use the TypeScript Compiler API to process TypeScript code programmatically
last_modified: 2020-10-18T09:56:36.951Z
---

# Compiler API (TypeScript)

## Contents

-   [Basic idea](#basic-idea)
-   [SourceFiles and the abstract syntax tree (AST)](#sourcefiles-and-the-abstract-syntax-tree-ast)
    -   [Getting SourceFile for code](#getting-sourcefile-for-code)
    -   [Printing AST for SourceFile](#printing-ast-for-sourcefile)
-   [Turning code into a Program](#turning-code-into-a-program)
-   [Transpiling code](#transpiling-code)
-   [Getting diagnostics](#getting-diagnostics)
-   [Getting type information](#getting-type-information)
-   [Creating a custom linter](#creating-a-custom-linter)
-   [Extracting type documentation](#extracting-type-documentation)
-   [Altering or creating code programmatically](#altering-or-creating-code-programmatically)
    -   [Parsing and string processing](#parsing-and-string-processing)
    -   [Programmatically creating AST nodes](#programmatically-creating-ast-nodes)
    -   [Walking the AST and replacing nodes using a transformer](#walking-the-ast-and-replacing-nodes-using-a-transformer)

## Basic idea

When writing an application using TypeScript, you typically use the “typescript” module as a build tool to transpile your TypeScript code into JavaScript. This is usually all you need. However, if you import the “typescript” module in your application code, you get access to the compiler API. This compiler API provides some very powerful tools for interacting with TypeScript code. Some of its features are documented on the TypeScript wiki: [Using the Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API).

## SourceFiles and the abstract syntax tree (AST)

SourceFile contains a representation of the source code itself, from which you can extract the _abstract syntax tree (AST)_ for the code ([Abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree))

AST:

-   Represents the syntactical structure of the program as a tree, starting from the SourceFile itself and drilling down into the statements and their building blocks
-   In general, ASTs are used by compilers or interpreters as an initial step in the processing of the source code

Interactively exploring TypeScript AST: [TypeScript AST Viewer](https://ts-ast-viewer.com/)

### Getting SourceFile for code

```typescript
import * as ts from "typescript";

const filename = "test.ts";
const code = `const test: number = 1 + 2;`;

const sourceFile = ts.createSourceFile(
    filename, code, ts.ScriptTarget.Latest
);
```

### Printing AST for SourceFile

Code:

```typescript
function printRecursiveFrom(
    node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile
) {
    const indentation = "-".repeat(indentLevel);
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    console.log(`${indentation}${syntaxKind}: ${nodeText}`);

    node.forEachChild(child =>
        printRecursiveFrom(child, indentLevel + 1, sourceFile)
    );
}

printRecursiveFrom(sourceFile, 0, sourceFile);
```

Output:

    SourceFile: const test: number = 1 + 2;
    -VariableStatement: const test: number = 1 + 2;
    --VariableDeclarationList: const test: number = 1 + 2
    ---VariableDeclaration: test: number = 1 + 2
    ----Identifier: test
    ----NumberKeyword: number
    ----BinaryExpression: 1 + 2
    -----FirstLiteralToken: 1
    -----PlusToken: +
    -----FirstLiteralToken: 2
    -EndOfFileToken:

Note: Starting from TypeScript 4, the output will specify `FirstStatement` instead of `VariableStatement`. This is just an alias for `VariableStatement`. See also [What is the difference between ts.SyntaxKind.VariableStatement and ts.SyntaxKind.FirstStatement](https://stackoverflow.com/questions/59463751/what-is-the-difference-between-ts-syntaxkind-variablestatement-and-ts-syntaxk).

Here, we used `ts.Node.forEachChild()` to get the children for a node in the AST. There is an alternative to this, `ts.Node.getChildren(sourceFile).forEach()`, which creates a more detailed AST:

    SourceFile: const test: number = 1 + 2;
    -SyntaxList: const test: number = 1 + 2;
    --VariableStatement: const test: number = 1 + 2;
    ---VariableDeclarationList: const test: number = 1 + 2
    ----ConstKeyword: const
    ----SyntaxList: test: number = 1 + 2
    -----VariableDeclaration: test: number = 1 + 2
    ------Identifier: test
    ------ColonToken: :
    ------NumberKeyword: number
    ------FirstAssignment: =
    ------BinaryExpression: 1 + 2
    -------FirstLiteralToken: 1
    -------PlusToken: +
    -------FirstLiteralToken: 2
    ---SemicolonToken: ;
    -EndOfFileToken:

## Turning code into a Program

SourceFiles are very limited. Programs allow you to do more interesting things like getting diagnostics or using the type checker.

Note: obtaining a Program is much more resource-heavy than obtaining a simple SourceFile!

Getting a Program from a file:

```typescript
const program = ts.createProgram(["src/test.ts"], {});
```

Getting a Program from a string of code (needs custom CompilerHost):

```typescript
import * as ts from "typescript";

const filename = "test.ts";
const code = `const test: number = 1 + 2;`;

const sourceFile = ts.createSourceFile(
    filename, code, ts.ScriptTarget.Latest
);

const defaultCompilerHost = ts.createCompilerHost({});

const customCompilerHost: ts.CompilerHost = {
    getSourceFile: (name, languageVersion) => {
        console.log(`getSourceFile ${name}`);

        if (name === filename) {
            return sourceFile;
        } else {
            return defaultCompilerHost.getSourceFile(
                name, languageVersion
            );
        }
    },
    writeFile: (filename, data) => {},
    getDefaultLibFileName: () => "lib.d.ts",
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: filename => filename,
    getCurrentDirectory: () => "",
    getNewLine: () => "\n",
    getDirectories: () => [],
    fileExists: () => true,
    readFile: () => ""
};

const program = ts.createProgram(
    ["test.ts"], {}, customCompilerHost
);

// getSourceFile test.ts
// getSourceFile lib.d.ts
```

Note:`getSourceFile` method of the CompilerHost is called twice:

-   once for getting the actual code we want to compile
-   once for getting `lib.d.ts`, the default library specifying the JavaScript/TypeScript features that are available to the code

## Transpiling code

Directly from code:

```typescript
import * as ts from "typescript";

const code = `const test: number = 1 + 2;`;
const transpiledCode = ts.transpileModule(code, {}).outputText;
console.log(transpiledCode); // var test = 1 + 2;
```

It is also possible to transpile files from disk using the compiler API. Note: if the file you transpile imports other TypeScript files, those will also be transpiled if the compiler can find them.

Code (file test.ts):

```typescript
import * as ts from "typescript";

const program = ts.createProgram(["src/test.ts"], {});
program.emit();
```

The test.js file created by the above code:

```typescript
"use strict";
exports.__esModule = true;
var ts = require("typescript");
var program = ts.createProgram(["src/test.ts"], {});
program.emit();
```

## Getting diagnostics

If you have a Program, you can use that Program to obtain diagnostics for the code. In order to get the compiler errors or warnings, use the `getPreEmitDiagnostics()`method. As an example, take a look at the following code which prints its own diagnostics.

```typescript
import * as ts from "typescript";

let test: number = "test"; // compiler error

const program = ts.createProgram(["src/test.ts"], {});
const diagnostics = ts.getPreEmitDiagnostics(program);

for (const diagnostic of diagnostics) {
    const message = diagnostic.messageText;
    const file = diagnostic.file;
    const filename = file.fileName;

    const lineAndChar = file.getLineAndCharacterOfPosition(
        diagnostic.start
    );

    const line = lineAndChar.line + 1;
    const character = lineAndChar.character + 1;

    console.log(message);
    console.log(`(${filename}:${line}:${character})`);
}

// Type '"test"' is not assignable to type 'number'.
// (src/test.ts:3:5)
```

## Getting type information

Another thing that a Program allows you to do is to obtain a TypeChecker for extracting type information from nodes in the AST. The following code obtains a TypeChecker for itself and uses the checker to emit the types of all variable declarations in the code.

```typescript
import * as ts from "typescript";

const filename = "src/test.ts";
const program = ts.createProgram([filename], {});
const sourceFile = program.getSourceFile(filename);
const typeChecker = program.getTypeChecker();

function recursivelyPrintVariableDeclarations(
    node: ts.Node, sourceFile: ts.SourceFile
) {
    if (node.kind === ts.SyntaxKind.VariableDeclaration)  {
        const nodeText = node.getText(sourceFile);
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);

        console.log(nodeText);
        console.log(`(${typeName})`);
    }

    node.forEachChild(child =>
        recursivelyPrintVariableDeclarations(child, sourceFile)
    );
}

recursivelyPrintVariableDeclarations(sourceFile, sourceFile);

// filename = "src/test.ts"
// ("src/test.ts")
// program = ts.createProgram([filename], {})
// (ts.Program)
// sourceFile = program.getSourceFile(filename)
// (ts.SourceFile)
// typeChecker = program.getTypeChecker()
// (ts.TypeChecker)
// nodeText = node.getText(sourceFile)
// (string)
// type = typeChecker.getTypeAtLocation(node)
// (ts.Type)
// typeName = typeChecker.typeToString(type, node)
// (string)
```

## Creating a custom linter

The TypeScript compiler API makes it pretty straightforward to create your own custom linter that generates errors or warnings if it finds certain things in the code. For an example, see this part of the compiler API documentation: [Traversing the AST with a little linter](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#traversing-the-ast-with-a-little-linter). Note that the code uses the SyntaxKind of the node (`node.kind`) to determine the kind of node and then casts the node to its specific type, allowing for convenient access to certain child nodes.

The example above doesn’t create a Program, because there is no need to create one. If the information in the AST suffices for your linter, it is easier and more efficient to just create a SourceFile directly. More advanced linters may need type checking, which means you will need to generate a Program for the code to be linted in order to obtain a TypeChecker.

## Extracting type documentation

The documentation for the compiler API includes an example that uses a TypeChecker to extract and emit type documentation for the code: [Using the Type Checker](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker)

## Altering or creating code programmatically

Note: the code examples below include different code depending on TS version. For more details regarding what changed in 4.0, see [this PR](https://github.com/microsoft/TypeScript/pull/35282).

### Parsing and string processing

-   Traverse the AST and generate a list of changes you want to perform on the code (e.g., remove 2 characters starting from position 11 and insert the string “test” instead). 
-   Then, take the source code as a string and apply the changes in reverse order (starting from the end of the source code, so your changes don’t affect the positions where the other changes need to happen).

### Programmatically creating AST nodes

```typescript
import * as ts from "typescript";

// before TS 4.0
const statement = ts.createVariableStatement(
    [],
    ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
            ts.createIdentifier("testVar"),
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.createStringLiteral("test")
        )],
        ts.NodeFlags.Const
    )
);

// starting from TS 4.0
const statement = ts.factory.createVariableStatement(
    [],
    ts.factory.createVariableDeclarationList(
        [ts.factory.createVariableDeclaration(
            ts.factory.createIdentifier("testVar"),
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.factory.createStringLiteral("test")
        )],
        ts.NodeFlags.Const
    )
);

const printer = ts.createPrinter();

const result = printer.printNode(
    ts.EmitHint.Unspecified,
    statement,
    undefined
);

console.log(result); // const testVar: string = "test";
```

### Walking the AST and replacing nodes using a transformer

The following code finds all identifiers in the `SourceFile` and adds a suffix `suffix` to them.

```typescript
import * as ts from "typescript";

const filename = "test.ts";
const code = `const test: number = 1 + 2;`;

const sourceFile = ts.createSourceFile(
    filename, code, ts.ScriptTarget.Latest
);

const transformerFactory: ts.TransformerFactory<ts.Node> = (
    context: ts.TransformationContext
) => {
    return (rootNode) => {
        function visit(node: ts.Node): ts.Node {
            node = ts.visitEachChild(node, visit, context);

            if (ts.isIdentifier(node)) {
                // before TS 4.0
                return ts.createIdentifier(node.text + "suffix");

                // starting from TS 4.0
                return context.factory.createIdentifier(node.text + "suffix");
            } else {
                return node;
            }
        }

        return ts.visitNode(rootNode, visit);
    };
};

const transformationResult = ts.transform(
    sourceFile, [transformerFactory]
);

const transformedSourceFile = transformationResult.transformed[0];
const printer = ts.createPrinter();

const result = printer.printNode(
    ts.EmitHint.Unspecified,
    transformedSourceFile,
    undefined
);

console.log(result); // const testsuffix: number = 1 + 2;
```
