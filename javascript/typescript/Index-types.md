---
tree_title: Index types
description: Some examples of TypeScript index types and how to use them
last_modified: 2020-11-21T18:14:37.196Z
---

# Index types (TypeScript)

## Contents

-   [Index operators](#index-operators)
-   [Index signatures](#index-signatures)
    -   [Use case: mapped types](#use-case-mapped-types)
        -   [`Readonly` and `Partial`](#readonly-and-partial)
        -   [`Pick`](#pick)
    -   [Use case: dictionaries with enum or type union keys](#use-case-dictionaries-with-enum-or-type-union-keys)
-   [Resources](#resources)

## Index operators

**Index type query operator:** `keyof`

```typescript
interface Test {
    propA: number;
    propB: string;
}

type TestKey = keyof Test; 
// type TestKey = "propA" | "propB"
```

**Indexed access operator:** `T[K]`

Can be used in generic context to indicate property types

Example (adapted from [Index types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types)):

```typescript
interface Test {
    propA: number;
    propB: string;
}

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
}

const test: Test = { propA: 1, propB: "b" };

getProperty(test, "propA"); // type number
getProperty(test, "propB"); // type string
```

## Index signatures

Can be used to specify structure of object with arbitrary property names

```typescript
interface IndexSignature {
    [key: string]: boolean | number;
    a: boolean;
    b: number;
}

function test(input: IndexSignature) {
    input.a // type boolean
    input.b // type number
    input.c // type boolean | number;
}
```

Can also be used with generics:

```typescript
interface GenericIndexSignature<T> {
    [key: string]: T;
}

function test(input: GenericIndexSignature<number>) {
    input.c // type number;
    input.d // type number;
}
```

### Use case: mapped types

Mapped types = new types based on other types

#### `Readonly` and `Partial`

Implementations (already provided by TypeScript language):

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

Example:

```typescript
interface Person {
    name: string;
    age: number;
}

type ReadonlyPerson = Readonly<Person>;
// type ReadonlyPerson = { readonly name: string; readonly age: number; }

type PartialPerson = Partial<Person>;
// type PartialPerson = { name?: string | undefined; age? : number | undefined; }
```

#### `Pick`

Implementation (already provided by TypeScript language):

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

Example:

```typescript
interface Test {
    propA: string;
    propB: number;
    propC: boolean;
}

type Picked = Pick<Test, "propA" | "propC">;
// type Picked = { propA: string; propC: boolean; }
```

### Use case: dictionaries with enum or type union keys

Example with enum keys:

```typescript
enum TestEnum {
  First = "First",
  Second = "Second",
  Third = "Third"
}

type DictionaryWithAllKeys = { [key in TestEnum]: number; };
type DictionaryWithSomeKeys = { [key in TestEnum]?: number; };

// error: property 'Third' is missing
const testAllKeys: DictionaryWithAllKeys = {
  First: 1,
  Second: 2
}

const testSomeKeys: DictionaryWithSomeKeys = {
  First: 1,
  Second: 2
}
```

Example with type union keys:

```typescript
type TestUnion = "First" | "Second" | "Third";

type DictionaryWithAllKeys = { [key in TestUnion]: number; };
type DictionaryWithSomeKeys = { [key in TestUnion]?: number; };

// error: property 'Third' is missing
const testAllKeys: DictionaryWithAllKeys = {
  First: 1,
  Second: 2
}

const testSomeKeys: DictionaryWithSomeKeys = {
  First: 1,
  Second: 2
}
```

## Resources

-   [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
