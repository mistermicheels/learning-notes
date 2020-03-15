# Index types

See:

- [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)

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

### Special case: dictionaries with enum keys

Example enum:

```typescript
enum TestEnum {
    First = "First",
    Second = "Second",
    Third = "Third"
}
```

Index signature forcing all enum keys to be present:

```typescript
// error: property 'Third' is missing
const testAllRequired: { [key in TestEnum]: number; } = {
    First: 1,
    Second: 2
}
```

Index signature that doesn't force all enum keys to be present (mind the `?`):

```typescript
// ok
const testNotAllRequired: { [key in TestEnum]?: number; } = {
    First: 1,
    Second: 2
}
```