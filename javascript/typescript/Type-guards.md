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

