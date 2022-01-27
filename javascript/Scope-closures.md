---
tree_title: Scope and closures
description: Execution contexts, lexical scope, the scope chain, function scope vs. block scope, closures, etc.
last_modified: 2022-01-27T17:10:02.972Z
---

# Scope and closures (JavaScript)

## Contents

-   [Execution contexts, lexical scope and the scope chain](#execution-contexts-lexical-scope-and-the-scope-chain)
    -   [Container holding variables/functions defined in the code](#container-holding-variablesfunctions-defined-in-the-code)
    -   [Scope chain](#scope-chain)
-   [Function scope versus block scope](#function-scope-versus-block-scope)
-   [Closures](#closures)
    -   [Closures and loops](#closures-and-loops)
-   [Resources](#resources)

## Execution contexts, lexical scope and the scope chain

All JavaScript runs inside an **execution context**. Code that is not inside any function runs in the global execution context. For each call to a function, a new execution context is created for the function's code to run in.

Contents of an execution context:

-   A container holding variables/functions defined in the code (this can be considered the code's own **scope**)
-   **Scope chain**, determining what other scopes the code has access to
-   A `this` variable (see [The `this` keyword](./This-keyword.md))

### Container holding variables/functions defined in the code

-   Has an `arguments` entry, holding the arguments passed to the function (not applicable for the global execution context)
-   Has an entry for each _function declaration_ in the code of the function (or the top level code in case of the global execution context), pointing to the function
    -   Every function that is defined by a normal function declaration (`function test() { ... }`) is immediately callable, also by the code that comes before the declaration. This is called **hoisting**
-   Has an entry for each _variable declaration_ in the code of the function (or the top level code in case of the global execution context)
    -   Variable declarations are **hoisted** as well. Declarations using `var` get initialized with `undefined`, while declarations using `const` and `let` are left in an uninitialized state that prevents code from actually accessing them until their declaration is reached

Example function hosting:

```javascript
foo(); // test

function foo() {
    console.log("test");
}
```

Example variable hoisting:

```javascript
function foo() {
    console.log(a); // undefined
    var a = 1;
    console.log(a); // 1
}

foo();
```

```javascript
function foo() {
    console.log(a); // ReferenceError: Cannot access 'a' before initialization
    const a = 1;
}

foo();
```

### Scope chain

Apart from the variables and functions defined inside a function's own scope (see previous bullet point), code in a function can also have access to variables and functions defined outside of the function. The outer scopes that the code has access to form the scope chain.

JavaScript uses **lexical scoping**:

-   A function that is defined within another function has access to that function's scope
-   This can go several levels deep (hence the scope _chain_)
-   All functions have access to the global scope
-   The scopes a function has access to are determined by where that function sits in the codebase, not where it is executed from!
    -   Determined at write time, not execution time

Example:

```javascript
const a = "a";

function test1() {
    // can access a and b
    
    const b = "b";
    test2();

    function test2() {
        // can access a, b and c
        
        const c = "c";
        console.log("test2: " + a + b + c); //test2: abc

        test3();
    }
}

function test3() {
    // can access a (global scope) but not b and c, even when called from inside test2
    
    console.log("test3:" + a + b + c); // ReferenceError: b is not defined
}

test1();
```

Note that the inner function cannot only read variables defined in the outer function, but also modify them

Example: "uncallbacking" a synchronous callback

```javascript
function test(input, callback) {
    callback(input * 2);
}

function uncallbacked(input) {
    let resultFromCallback; 
    
    test(input, result => {
        resultFromCallback = result;
    });
    
    return resultFromCallback;
}

console.log(uncallbacked(5)) // 10
```

Other example: storing a Promise's `resolve` and `reject` function to call them from wherever we want

```javascript
let storedResolve;
let storedReject;

const thePromise = new Promise((resolve, reject) => {
    storedResolve = resolve;
    storedReject = reject;
});

setTimeout(() => {
    storedResolve("test");
}, 2000);

async function test() {
    console.log(await thePromise);
}

test(); // logs "test" after two seconds
```

For more use cases, also see the section on closures below.

## Function scope versus block scope

Functions are a good and common way to hide variables and functions from outside code. Consider the following code, which defines a variable `b` but doesn't want any other code to know about it.

```javascript
const a = 2;

function foo() {
    const b = 3;
    console.log(b); // 3
}

foo();

console.log(a); // 2
console.log(b); // ReferenceError: b is not defined
```

Problem with the above: while we avoid making `b` available in the global scope, we are "polluting" the global scope with the function `foo` and we need to explicitly call `foo` in order to execute the code

An interesting alternative are **IIFEs** (**I**mmediately **I**nvoked **F**unction **E**xpressions). The structure is similar, but we put parentheses around the function in order to turn it into an expression (meaning the function declaration doesn't sit in the global scope) and we add parentheses at the end to immediately invoke it

```javascript
const a = 2;

(function(){
    const b = 3;
    console.log(b); // 3
})();

console.log(a); // 2
console.log(b); // ReferenceError: b is not defined
```

Because you are still just calling a function, you can put arguments within the parentheses used to invoke the function

But functions are not the only way to hide variables and functions from outside code. JavaScript also has the concept of **block scope**, where variables defined inside a block of code (`{ ... }`) are not accessible outside of that block. In order to accomplish this, the `let` and `const` keywords can be used.

Simple example:

```javascript
if (true) {
    var a = "a";
}

if (true) {
    const b = "b";
}

console.log(a); // a
console.log(b); // ReferenceError: b is not defined
```

Block scope can also be used with loops to ensure that variables used for iteration are only accessible inside the actual loop.

Loop without block scope (using `var`):

```javascript
for (var i = 0; i < 10; i++) {
    console.log(i);
}

console.log(i); // 10
```

Loop with block scope (using `let`):

```javascript
for (let i = 0; i < 10; i++) {
    console.log(i);
}

console.log(i); // ReferenceError: i is not defined
```

Using `let` for a loop counter doesn't only prevent it from being accessible outside of the loop, it also makes sure that every iteration of the loop gets its own block-scoped counter variable. This is particularly useful if the loop creates a function that depends on the value of the counter (see below).

## Closures

A **closure** is a function combined with references to its outer scope. Whenever a function is _created_, JavaScript creates a closure for that function. We already saw closures at work in the examples above, as they are part of what makes the scope chain work.

What makes closures really interesting in JavaScript is that an inner function can access variables defined in its outer function, _even if that outer function has already returned_

Use case: function factories

```javascript
function makeGreeter(name) {
    return function() {
        console.log("Hello " + name);
    }
}

const greetBob = makeGreeter("Bob");
const greetJohn = makeGreeter("John");
greetBob(); // Hello Bob
greetJohn(); // Hello John
```

Use case: simulating private variables (this is called the Revealing Module Pattern)

```javascript
function makeCounter() {    
    let currentCount = 0; // not accessible to outside code
  
    function increase() {
        currentCount++;
    }
  
    function decrease() {
        currentCount--;
    }
  
    function getCurrent() {
        return currentCount;
    }
  
    return { increase, decrease, getCurrent };
}

const counter = makeCounter();
counter.increase();
counter.increase();
counter.decrease();
console.log(counter.getCurrent()); // 1
```

### Closures and loops

When creating functions as part of a loop, you need to be especially careful about closures:

```javascript
// logs 10, 10, 10, 10, 10, 10, 10, 10, 10, 10
for (var i = 0; i < 10; i++) {
    setTimeout(() => console.log(i), 0);
}
```

What happens here is that the function's closure allows it to access `i` , but by the time the function is executed the value of `i` is `10`.

The same can happen with purely synchronous code:

```javascript
var functions = [];

for (var i = 0; i < 10; i++) {
    functions[i] = () => i;
}

console.log(functions[0]()); // 10
console.log(functions[1]()); // 10
```

If you use ESLint, it can protect you from these kinds of confusing behavior using the [no-loop-func](https://eslint.org/docs/rules/no-loop-func) rule

Modern solution: use `let`, which makes sure that every iteration of the loop gets its own block-scoped counter variable

```javascript
// logs 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
for (let i = 0; i < 10; i++) {
    setTimeout(() => console.log(i), 0);
}
```

Alternative solution: create an intermediate function that gets the counter as an argument rather than accessing it through the scope chain

```javascript
// logs 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
for (var i = 0; i < 10; i++) {
    setTimeout(getLogger(i), 0);
}

function getLogger(i) {
    return () => console.log(i);
}
```

## Resources

-   [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
-   [The Complete JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
-   [Hoisting in Modern JavaScript — let, const, and var](https://blog.bitsrc.io/hoisting-in-modern-javascript-let-const-and-var-b290405adfda)
-   [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
