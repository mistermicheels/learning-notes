---
tree_title: Spread syntax, rest parameters and destructuring
description: An overview of JavaScript spread syntax, rest parameters and destructuring
last_modified: 2020-05-30T15:54:15+02:00
---

# Spread syntax, rest parameters and destructuring (JavaScript)

## Contents

-   [Spread syntax](#spread-syntax)
-   [Rest parameters](#rest-parameters)
-   [Destructuring](#destructuring)
    -   [Array destructuring](#array-destructuring)
    -   [Object destructuring](#object-destructuring)
-   [Resources](#resources)

## Spread syntax

-   Syntax: `...`
-   Allows expanding an array or string into individual elements/characters
-   Allows expanding an object into key-value pairs of properties

Use case: expanding array into function arguments (before spread syntax, you would need to use `apply` for this)

```javascript
const test = [1, 7, 3];
const max = Math.max(...test); // 7
```

Use case: stitching together arrays

```javascript
const a = [1, 7, 3];
const b = [5, ...a]; // [5, 1, 7, 3]
```

```javascript
const c = [1];
const d = [2, 3];
const e = [...c, ...d]; // [1, 2, 3]
```

Use case: shallow copy of array

```javascript
const original = [1, 2, 3];
const shallowCopy = [...original]
```

Use case: transforming a `Set` (or other iterable) into an array (easy way of filtering array by distinct values)

```javascript
const original = ["a", "b", "c", "a"];
const distinct = [...new Set(original)]; // ["a", "b", "c"];
```

Use case: combining objects (alternative to `Object.assign`)

Note: in case of conflicts, newest overwrites oldest

```javascript
const a = { prop1: "a", prop2: true };
const b = { prop3: 3, ...a }; // { prop3: 3, prop1: "a", prop2: true }
```

```javascript
const a = { prop1: "a", prop2: true };
const b = { prop2: false, prop3: 3 };
const c = { ...a, ...b }; // { prop1: "a", prop2: false, prop3: 3 }
```

```javascript
const a = { prop2: true };
const b = { prop2: undefined };
const c = { ...a, ...b }; // {} (undefined overwrites true)
```

## Rest parameters

-   Syntax: `...`
-   Allows to represent any number of arguments as an array

Example:

```javascript
function test(...input) {
    return input;
}

test(1, 2, 3); // [1, 2, 3];
```

## Destructuring

Allows unpacking array elements or object properties into separate variables

### Array destructuring

Use case: unpacking array elements

```javascript
const x = [1, 2, 3, 4, 5];
const [a, b] = x; // a = 1, b = 1
const [c, ...rest] = x; // c = 1, rest = [2, 3, 4, 5]
const [, d] = x; // d = 2
```

Use case: swapping values of variables

```javascript
[a, b] = [b, a];
```

Working with default values:

```javascript
const [a = 1, b = 2] = [3]; // a = 3, b = 2
```

### Object destructuring

Use case: unpacking object properties

```javascript
const a = { prop1: "a", prop2: false, prop3: 3 };
const { prop1 } = a; // prop1 = "a"
const { prop2, ...b } = a; // prop2 = false, b = { prop1: "a", prop3: 3 }
```

```javascript
const a = { prop1: "a" };
const { prop1: newName } = a; // newName = "a"
```

Working with default values

```javascript
const a = { prop1: "a" };
const { prop1 = "b", prop2 = false } = a; // prop1 = "a", prop2 = false
```

Combining everything, plus default parameters

```javascript
function test({ name: firstName = "John", lastName = "Doe" } = {}) {
    console.log(firstName + " " + lastName);
}

test(); // John Doe
test({}); // John Doe
test({ lastName: "Bovi" }); // John Bovi
test({ name: "Cookie" }); // Cookie Doe
test({ lastName: undefined }); // John Doe
test({ lastName: null }); // John null
```

## Resources

-   [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
-   [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
-   [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
