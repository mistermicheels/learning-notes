---
tree_title: Nullable types and optional parameters/properties
description: An overview of how TypeScript deals with null, undefined and optional parameters/properties
last_modified: 2022-01-31T10:44:35.294Z
---

# Nullable types and optional parameters/properties (TypeScript)

## Contents

-   [Nullable types](#nullable-types)
-   [Optional chaining](#optional-chaining)
-   [Non-null assertion operator](#non-null-assertion-operator)
-   [Optional parameters](#optional-parameters)
-   [Optional properties](#optional-properties)
-   [Resources](#resources)

## Nullable types

Two special types: `null` and `undefined`

-   Treated as different from each other, because that's what JavaScript does as well
-   By default, assignable to anything, but this can be changed by enabling the `--strictNullChecks` flag
    -   Recommended to enable this, allow type checking to prevent a lot of potential runtime errors

Example without `--strictNullChecks`:

```typescript
// everything ok according to compiler
const test1: string = undefined;
const test2: string = null;
const test3: string | undefined = undefined;
const test4: string | undefined = null;
const test5: string | null = undefined;
const test6: string | null = null;
const test7: string | null | undefined = undefined;
const test8: string | null | undefined = null;
```

Example with `--strictNullChecks`:

```typescript
const test1: string = undefined; // error
const test2: string = null; // error
const test3: string | undefined = undefined;
const test4: string | undefined = null; // error
const test5: string | null = undefined; // error
const test6: string | null = null;
const test7: string | null | undefined = undefined;
const test8: string | null | undefined = null;
```

## Optional chaining

(introduced in TypeScript 3.7)

Operator `?` that allows to stop evaluation when something is `null` or `undefined`

Motivation: accessing `instance.prop.otherProp.nextProp` where at each level the property may be `null` or `undefined` (leading to runtime errors if we fail to check for it)

Example:

```typescript
let x = instance.prop?.otherProp;
// is equivalent to
let x = instance.prop === null || instance.prop === undefined ? undefined : instance.prop.otherProp;
```

Note that, if evaluation stops because something is `null`, the result is still `undefined`

## Non-null assertion operator

Operator `!` that allows to let TypeScript know you are sure that a certain value is not `null` or `undefined` (useful in situations where the code is too complex for TypeScript to figure this out by itself)

Example (with `--strictNullChecks`):

```typescript
function test(str: string | null | undefined) {
    const ensureStringDefined = function () {
        if (str === null || str === undefined) {
            str = "test";
        }
    }

    ensureStringDefined();
    console.log(str.toUpperCase()); // error
    console.log(str!.toUpperCase()); // ok
}
```

## Optional parameters

If `--strictNullChecks` is enabled, making a parameter optional automatically adds ` | undefined` to its type

Example without `--strictNullChecks`:

```typescript
function test(a: string, b?: string) {
    return a;
}

// everything ok according to compiler
test("a");
test("a", undefined);
test("a", null);
```

Example with `--strictNullChecks`:

```typescript
function test(a: string, b?: string) {
    return a;
}

test("a");
test("a", undefined);
test("a", null); // error
```

Note: an optional parameter is not completely the same as a parameter that needs to be provided but can be undefined!

```typescript
function test2(a: string, b: string | undefined) {
    return a;
}

test2("b"); // error because of missing argument, even without --strictNullChecks
test2("b", undefined); // ok
```

You can use this to force the code using your function to be very explicit about passing in `undefined`

## Optional properties

Example without `--strictNullChecks`:

```typescript
class Test {
  a: number = 1;
  b?: number;
}

// everything ok according to compiler
let test = new Test();
test.a = 12;
test.a = undefined;
test.a = null;
test.b = 12;
test.b = undefined;
test.b = null;
```

Example with `--strictNullChecks`:

```typescript
class Test {
  a: number = 1;
  b?: number;
}

let test = new Test();
test.a = 12;
test.a = undefined; // error
test.a = null; // error
test.b = 12;
test.b = undefined; 
test.b = null; // error
```

## Resources

-   [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
