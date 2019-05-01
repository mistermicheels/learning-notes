# Runtime type checking in TypeScript

## Why additional type checking?

TypeScript only performs static type checking at compile time! The generated JavaScript, which is what actually runs when you run your code, does not know anything about the types. 

- Works fine for type checking within your codebase
- Doesn’t provide any kind of protection against malformed input (for example, when receiving input from API)

## Strictness of runtime checking

- Needs to be at least as strict as compile-time checking (otherwise, we lose the guarantees that the compile-time checking provides)
- Can be more strict if desired (e.g., require age to be >= 0)

## Runtime type checking strategies

### Manual checks in custom code

- Flexible
- Can be tedious and error-prone
- Can easily get out of sync with actual code

### Manually creating JSON Schemas

Example JSON Schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "firstName",
    "lastName",
    "age"
  ],
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    }
  }
}
```

- Standard format, lots of libraries available for validation ...
- JSON: easy to store and share
- Can become very verbose and they can be tedious to generate by hand
- Need to make sure Schemas and code stay in sync!

### Automatically generating JSON Schemas

- Generating JSON Schemas from TypeScript code
  - Example library:  [typescript-json-schema](https://github.com/YousefED/typescript-json-schema) (can be used both from CLI and from code)
  - Need to make sure Schemas and code stay in sync!
- Generating JSON Schemas from example JSON input
  - Doesn’t use the type information you have already defined in your TypeScript code
  - Can lead to errors if there is a mismatch between the input JSON you provide
  - Again, need to make sure Schemas and code stay in sync!

### Transpilation

Example library: [ts-runtime](https://github.com/fabiandev/ts-runtime)

- Processes code
- Transpiles code into equivalent code with built-in runtime type checking

Example code:

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
}

const test: Person = {
    firstName: "Foo",
    lastName: "Bar",
    age: 55
}
```

Example transpiled code

```typescript
import t from "ts-runtime/lib";

const Person = t.type(
    "Person",
    t.object(
        t.property("firstName", t.string()),
        t.property("lastName", t.string()),
        t.property("age", t.number())
    )
);

const test = t.ref(Person).assert({
    firstName: "Foo",
    lastName: "Bar",
    age: 55
});
```

Problem: no control over where type checking happens (we only need runtime type checks at the boundaries!)

Note: Library is still in an experimental stage and not recommended for production use!

### Deriving static types from runtime types

Example library: [io-ts](https://github.com/gcanti/io-ts)

- You define runtime types
- TypeScript infers the corresponding static types from these

Example runtime type:

```typescript
import t from "io-ts";

const PersonType = t.type({
  firstName: t.string,
  lastName: t.string,
  age: t.refinement(t.number, n => n >= 0, 'Positive')
})
```

Extracting the corresponding static type:

```typescript
interface Person extends t.TypeOf<typeof PersonType> {}
```

Equivalent to:

```typescript
interface Person {
    firstName: string;
    lastName: string;
    age: number;
}
```

- No possibility for types to get out of sync
- [io-ts](https://github.com/gcanti/io-ts) is pretty powerful, supports recursive types etc.
- Requires you to define your types as io-ts runtime types, which does not work when you are defining classes

  -  One way to handle this could be to define an interface using io-ts and then make the class implement the interface. However, this means you need to make sure to update the io-ts type whenever you are adding properties to your class.
- Harder to share interfaces (e.g. between backend and frontend) because they are io-ts types rather than plain TypeScript interfaces

### Decorator-based class validation

Example library: [class-validator](https://github.com/typestack/class-validator)

- Uses decorators on class properties
- Very similar to Java’s JSR-380 Bean Validation 2.0 (implemented by, for example, Hibernate Validator)
  - Part of a family of Java EE-like libraries that also includes [typeorm](https://github.com/typeorm/typeorm) (ORM, similar to Java’s JPA) and [routing-controllers](https://github.com/typestack/routing-controllers) (similar to Java’s JAX-RS for defining APIs)

Example code:

```typescript
import { plainToClass } from "class-transformer";

import { 
    validate, IsString, IsInt, Min 
} from "class-validator";

class Person {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsInt()
    @Min(0)
    age: number;
}

const input: any = {
    firstName: "Foo",
    age: -1
};

const inputAsClassInstance = plainToClass(
    Person, input as Person
);

validate(inputAsClassInstance).then(errors => {
    // handle errors if needed
});
```

- No possibility for types to get out of sync
- Good for checking classes
- Can be useful for checking interfaces by defining a class implementing the interface



Note: class-validator needs actual class instances to work on

- Here, we used its sister library class-transformer to transform our plain input into an actual `Person` instance. 
  - Note: The transformation in itself does not perform any kind of type checking!



