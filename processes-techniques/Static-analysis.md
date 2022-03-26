---
description: Checking your code without running it
last_modified: 2022-03-26T14:43:03.368Z
---

# Static analysis

## Contents

-   [Basic idea](#basic-idea)
-   [Formatting and coding style](#formatting-and-coding-style)
-   [Common bugs and code smells](#common-bugs-and-code-smells)
-   [Technical debt and duplication](#technical-debt-and-duplication)
-   [Third-party dependencies](#third-party-dependencies)
-   [Internal dependencies](#internal-dependencies)
-   [Type checking](#type-checking)
-   [Resources](#resources)

## Basic idea

Static analysis = checking codebase by looking at the source code without running it

Great addition to automated testing and code reviews

## Formatting and coding style

-   Automated checking of formatting rules
    -   Example (multi-language): [Prettier](https://prettier.io/)
    -   Example (Java): [CheckStyle](https://checkstyle.sourceforge.io/)
-   Automated formatting
    -   Example (multi-language): [Prettier](https://prettier.io/)
    -   Example (Java): Eclipse Code Formatter
-   Automated coding style checks
    -   Example (JavaScript): [ESLint](https://eslint.org/)
    -   Example (Java): [CheckStyle](https://checkstyle.sourceforge.io/)
    -   Example (Java): [SpotBugs](https://spotbugs.github.io/)

## Common bugs and code smells

-   Example (JavaScript): [ESLint](https://eslint.org/)
-   Example (Java): [CheckStyle](https://checkstyle.sourceforge.io/)
-   Example (Java): [SpotBugs](https://spotbugs.github.io/)
-   Example (multi-language): [SonarQube](https://www.sonarqube.org/)
    -   ESLint plugin with some relevant rules: [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)
-   Example (multi-language): [Semgrep](https://semgrep.dev/)
    -   Very straightforward way to add own rules on top of community rules

## Technical debt and duplication

-   Example (multi-language): [SonarQube](https://www.sonarqube.org/)

Note: stay practical about this!

-   The technical debt reported by tools like this is just an indication. Set your own priorities and see where the cost of paying off the debt is worth the benefits.
-   Not all duplication is bad duplication. See also [Duplication](../architecture-design/Duplication.md).

## Third-party dependencies

-   Check if third-party dependencies used by the code are properly defined
    -   Example (JavaScript): [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser) (check for dependencies missing in `package.json`, production code relying on `devDependencies` or `optionalDependencies`, ...)
-   Check for known vulnerabilities in third-party dependencies
    -   Example (JavaScript): `npm audit`
    -   Example (multi-language): GitHub dependency vulnerability checks (see [About supply chain security](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-supply-chain-security))
-   Check licenses for third-party dependencies
    -   Example (JavaScript): [NPM License Checker](https://www.npmjs.com/package/license-checker)

## Internal dependencies

-   Check for circular dependencies, unused code, ...
    -   Example (JavaScript): [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser)
    -   Example (JavaScript): [ESLint](https://eslint.org/) ([import/no-cycle](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-cycle.md))
    -   Example (Java): [JDepend](https://github.com/clarkware/jdepend) (see example code below)
    -   Example (TypeScript): [ts-unused-exports](https://www.npmjs.com/package/ts-unused-exports)
-   Enforce monorepo boundaries
    -   Example (JavaScript): [eslint-plugin-monorepo-cop](https://www.npmjs.com/package/eslint-plugin-monorepo-cop)
-   Enforce custom boundaries
    -   Example (JavaScript): [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser) (see example code below)
    -   Example (Java): [JDepend](https://github.com/clarkware/jdepend) (see example code below)
-   Visualize dependencies
    -   See [Visual dependency analysis tools](../architecture-design/visualizing-architecture/Dependency-analysis-tools.md)

Example dependency-cruiser rule for enforcing custom boundary:

```javascript
{
  name: 'component-a',
  severity: 'error',
  comment: 'Do not reach into component A',
  from: {
    pathNot: '^src/componentA/'
   },
  to: {
    path: '^src/componentA/',
    pathNot: '^src/componentA/index',
  }
}
```

Example automated test code for circular dependency checking with JDepend:

```java
Collection packages = jdepend.analyze();
assertEquals("Cycles found", false, jdepend.containsCycles());
```

Example automated test code for checking direction of imports using JDepend:

```java
DependencyConstraint constraint = new DependencyConstraint();
JavaPackage ejb = constraint.addPackage("com.xyz.ejb");
JavaPackage web = constraint.addPackage("com.xyz.web");
JavaPackage util = constraint.addPackage("com.xyz.util");

ejb.dependsUpon(util);
web.dependsUpon(util);

jdepend.analyze();
assertEquals("Dependency mismatch", true, jdepend.dependencyMatch(constraint));
```

## Type checking

-   A programming language's type system can be seen as a form of static analysis
-   It's possible to add type checking to a language that doesn't have it built in
    -   Example: using TypeScript to add type checking to a JavaScript codebase

## Resources

-   [How to use static code analysis to write quality JavaScript/TypeScript](https://blog.logrocket.com/how-to-use-static-code-analysis-to-write-quality-javascript-typescript/)
