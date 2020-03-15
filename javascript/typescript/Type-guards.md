# Type guards

See:

- [Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)

## Basic idea

- Test, at runtime, whether a certain value is of a certain type
- TypeScript compiler knows that, if the test passes, the value is indeed of that type

## Built-in type guards

### `typeof` type guards

```typescript
function test(input: string | string[]) {
    input.split(""); // compiler error
    input.filter(() => true); // compiler error

    if (typeof input === "string") {
        // input has type string here
        return input.split("");
    } else {
        // input has type string[] here
        return input.filter(() => true);
    }
}
```

### `instanceof` type guards

```typescript
class ClassA {
    methodA() {
        return true;
    }
}

class ClassB {
    methodB() {
        return true;
    }
}

function test(instance: ClassA | ClassB) {
    instance.methodA(); // compiler error
    instance.methodB(); // compiler error

    if (instance instanceof ClassA) {
        // instance has type ClassA here
        instance.methodA();
    } else {
        // instance has type ClassB here
        instance.methodB();
    }
}
```

### Type guards based on common property

Can be used to implement *discriminated unions* (see [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions)):

- Types with common property indicating type
- A type alias that is the union of these types
- Type guards on the common property

Example (from [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions)):

```typescript
interface Square {
    kind: "square";
    size: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

interface Circle {
    kind: "circle";
    radius: number;
}

type Shape = Square | Rectangle | Circle;

function area(shape: Shape) {
    switch (shape.kind) {
        case "square":
            // shape has type Square here
            return shape.size * shape.size;
        case "rectangle":
            // shape has type Rectangle here
            return shape.height * shape.width;
        case "circle":
            // shape has type Circle here
            return Math.PI * shape.radius ** 2;
    }
}
```

TypeScript recognizes that the common property `kind` determines the type here

This also works with regular if-statements:

```typescript
function test(shape: Shape) {
    if (shape.kind === "rectangle") {
        // shape has type Rectangle here
        console.log(shape.height);
    }
}
```

## User-defined type guards

You can also define your own type guards that perform the type check at runtime by looking at certain properties of the object you receive

```typescript
interface Message {
    messageType: string;
}

interface UserMessage extends Message {
    messageType: "user";
    userId: number;
}

interface OrderMessage extends Message {
    messageType: "order";
    orderId: number;
}

function isMessage(arg: any): arg is Message {
    return typeof arg.messageType === "string";
}

function isUserMessage(arg: Message): arg is UserMessage {
    return arg.messageType === "user";
}

function isOrderMessage(arg: Message): arg is OrderMessage {
    return arg.messageType === "order";
}

function test(input: object) {
    console.log(input.messageType); // compiler error

    if (isMessage(input)) {
        // input has type Message here

        console.log(input.messageType);
        console.log(input.userId); // compiler error
        console.log(input.orderId); // compiler error

        if (isUserMessage(input)) {
            // input has type UserMessage here
            console.log(input.userId);
        } else if (isOrderMessage(input)) {            
            // input has type OrderMessage here
            console.log(input.orderId);
        }
    }
}
```

