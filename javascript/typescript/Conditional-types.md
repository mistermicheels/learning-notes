---
tree_title: Conditional types
description: An explanation of TypeScript conditional types and an overview of some useful predefined ones
last_modified: 2020-05-30T15:54:15+02:00
---

# Conditional types (TypeScript)

## Contents

-   [Basic idea](#basic-idea)
-   [Predefined conditional types](#predefined-conditional-types)
-   [Resources](#resources)

## Basic idea

Conditional type: selects one of two possible types based on a condition, where the condition is something that tests for the relationship between types

General structure: `T extends U ? X : Y`

Examples (adapted from [Conditional Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types)):

```typescript
declare function f<T extends boolean>(x: T): T extends true ? string : number;

let test1 = f(Math.random() < 0.5); // type: string | number
let test2 = f(true); // type: string
let test3 = f(false); // type: number;
```

```typescript
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T0 = TypeName<string>; // "string"
type T1 = TypeName<"a">; // "string"
type T2 = TypeName<true>; // "boolean"
type T3 = TypeName<() => void>; // "function"
type T4 = TypeName<string[]>; // "object"
```

The above were examples where the conditional type is _resolved_ (the compiler can immediately decide what the resulting type is going to be)

Alternatively, the type can be _deferred_, meaning the compiler will decide when it has more info

Example (adapted from [Conditional Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types)):

```typescript
interface Test {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Test ? string : number;

// return type: T extends Test ? string : number
function test<U>(x: U) {
  return f(x); // type
}

const result1 = test("a") // type: number
const result2 = test({ propA: true, propB: false }) // type: string
```

## Predefined conditional types

Some conditional types already defined by the TypeScript language (see [Predefined conditional types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#predefined-conditional-types)):

-   `Exclude` — Exclude from `T` those types that are assignable to `U`
-   `Extract` — Extract from `T` those types that are assignable to `U`
-   `NonNullable` — Exclude `null` and `undefined` from `T`
-   `ReturnType` — Obtain the return type of a function type
-   `InstanceType` — Obtain the instance type of a constructor function type

Examples (adapted from [Predefined conditional types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#predefined-conditional-types)):

```typescript
type Test1 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "b" | "d"
type Test2 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"

type Test3 = Exclude<string | number | (() => void), Function>; // string | number
type Test4 = Extract<string | number | (() => void), Function>; // () => void

type Test5 = NonNullable<string | number | undefined>; // string | number
type Test6 = NonNullable<(string[] | null | undefined>; // string[]

type Test7 = ReturnType<() => boolean> // boolean
```

## Resources

-   [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
