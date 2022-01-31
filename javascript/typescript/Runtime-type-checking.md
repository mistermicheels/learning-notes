---
description: An overview of ways to add runtime type checking to TypeScript applications
last_modified: 2022-01-31T14:29:20.468Z
---

# Runtime type checking in TypeScript

## Contents

-   [Why additional type checking?](#why-additional-type-checking)
-   [What about type guards?](#what-about-type-guards)
-   [Strictness of runtime checking](#strictness-of-runtime-checking)
-   [Runtime type checking strategies](#runtime-type-checking-strategies)
    -   [Manual checks in custom code](#manual-checks-in-custom-code)
    -   [Manual checks using a validation library](#manual-checks-using-a-validation-library)
    -   [Manually creating JSON Schemas](#manually-creating-json-schemas)
    -   [Automatically generating JSON Schemas](#automatically-generating-json-schemas)
        -   [Generating JSON Schemas from TypeScript code](#generating-json-schemas-from-typescript-code)
        -   [Generating JSON Schemas from runtime types](#generating-json-schemas-from-runtime-types)
    -   [Transpilation](#transpilation)
    -   [Deriving static types from runtime types](#deriving-static-types-from-runtime-types)
    -   [Decorator-based class validation](#decorator-based-class-validation)
    -   [Frameworks integrating runtime type checking](#frameworks-integrating-runtime-type-checking)

## Why additional type checking?

TypeScript only performs static type checking at compile time! The generated JavaScript, which is what actually runs when you run your code, does not know anything about the types. 

-   Works fine for type checking within your codebase
-   Doesn’t provide any kind of protection against malformed external input
-   Isn't designed to express typical input validation constraints (minimum array length, string matching a certain pattern) that are about more than simple type safety
    -   Several of the methods below provide an easy way to specify these kinds of constraints together with the actual TypeScript types

## What about type guards?

Type guards are a way to provide information to the TypeScript compiler by having the code check values at runtime.

-   Some degree of runtime type checking
-   Often, type guards combine information available at runtime with information from type declarations specified in the code. The compiler will make incorrect assumptions if the actual input doesn't match those type declarations.

See also [Type guards](./Type-guards.md)

## Strictness of runtime checking

-   Needs to be at least as strict as compile-time checking (otherwise, we lose the guarantees that the compile-time checking provides)
-   Can be more strict if desired (require age to be >= 0, require string to match a regex)
    -   Note that the TypeScript compiler will not be able to rely on such information

## Runtime type checking strategies

### Manual checks in custom code

-   Flexible
-   Can be tedious and error-prone
-   Can easily get out of sync with actual code

### Manual checks using a validation library

Example validation library: [joi](https://joi.dev/)

```typescript
import Joi from "joi"

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().integer().min(0).required(),
});
```

-   Flexible
-   Easy to write
-   Can easily get out of sync with actual code

Note: there are some very similar libraries than can derive TypeScript types from the runtime type definitions ([see below](#deriving-static-types-from-runtime-types))

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

-   Standard format, lots of libraries available for validation ...
    -   Example library for validation: [ajv](https://www.npmjs.com/package/ajv)
-   JSON: easy to store and share
-   Can become very verbose and can be tedious to create by hand
-   Can easily get out of sync with actual code

### Automatically generating JSON Schemas

#### Generating JSON Schemas from TypeScript code

Most robust library at the moment: [ts-json-schema-generator](https://www.npmjs.com/package/ts-json-schema-generator) (for some alternatives, see [this discussion](https://github.com/vega/ts-json-schema-generator/issues/101))

Example input, including specific constraints that are stricter than TS type checking:

```typescript
interface Person {
    /** @pattern ^[A-Z][a-z]+$  */
    firstName: string;

    lastName: string;

    /**
     * @asType integer
     * @minimum 0
     */
    age: number;
}
```

Example output (with default options):

```json
{
  "$ref": "#/definitions/Person",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "Person": {
      "additionalProperties": false,
      "properties": {
        "age": {
          "minimum": 0,
          "type": "integer"
        },
        "firstName": {
          "pattern": "^[A-Z][a-z]+$",
          "type": "string"
        },
        "lastName": {
          "type": "string"
        }
      },
      "required": [
        "firstName",
        "lastName",
        "age"
      ],
      "type": "object"
    }
  }
}
```

Benefits compared to manually creating JSON Schemas:

-   Single source of truth
-   You can use scripts to make sure generated schemas and code stay in sync

#### Generating JSON Schemas from runtime types

For some of the runtime type checking libraries mentioned in this note, it's possible to automatically generate JSON Schemas based on the defined runtime types. Some examples:

-   The [joi](https://joi.dev/) library (see [Manual checks using a validation library](#manual-checks-using-a-validation-library))
    -   Can use [joi-to-json](https://www.npmjs.com/package/joi-to-json)
-   The [zod](https://www.npmjs.com/package/zod) library (see [Deriving static types from runtime types](#deriving-static-types-from-runtime-types))
    -   Can use [zod-to-json-schema](https://www.npmjs.com/package/zod-to-json-schema)
    -   Bonus points because it allows deriving static types from runtime types
-   The [@sinclair/typebox](https://www.npmjs.com/package/@sinclair/typebox) library (see [Deriving static types from runtime types](#deriving-static-types-from-runtime-types))
    -   JSON Schema is immediately generated in the background
    -   Runtime type checking is implemented through generated JSON Schema
    -   Bonus points because it allows deriving static types from runtime types
-   The [class-validator](https://www.npmjs.com/package/class-validator) library (see [Decorator-based class validation](#decorator-based-class-validation))
    -   Can use [class-validator-jsonschema](https://www.npmjs.com/package/class-validator-jsonschema)
    -   Bonus points because it integrates static and runtime type checking

### Transpilation

Example library: [ts-runtime](https://www.npmjs.com/package/ts-runtime)

-   Processes code
-   Transpiles code into equivalent code with built-in runtime type checking

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

Example library: [yup](https://www.npmjs.com/package/yup)

-   You define runtime types
-   TypeScript infers the corresponding static types from these

Example runtime type:

```typescript
import { object, string, number, InferType } from "yup";

const personSchema = object({
    firstName: string().required(),
    lastName: string().required(),
    age: number().integer().positive().required(),
});
```

Extracting the corresponding static TypeScript type:

```typescript
type Person = InferType<typeof personSchema>;
```

Equivalent to:

```typescript
type Person = {
    firstName: string;
    lastName: string;
    age: number;
}
```

Benefits/drawbacks:

-   No possibility for types to get out of sync
-   You need to define your types as `yup` runtime types, not ideal if you want to validate input against a class definition
    -   One way to handle this: define a `yup` type matching the class, create an interface based on the type alias obtained from `yup` and then make the class implement the interface. This way, TypeScript helps you to keep the `yup` type in sync with the class, although not all cases are covered (for example, you still need to remember to update the `yup` type when adding properties to the class).
    -   Probably, decorator-based class validation is a better approach in this case ([see below](#decorator-based-class-validation))
-   Harder to share static types (e.g. between backend and frontend) because they are inferred from `yup` types

Some alternative libraries ([compare their popularity](https://www.npmtrends.com/@sinclair/typebox-vs-io-ts-vs-ow-vs-runtypes-vs-yup-vs-zod)):

-   The [ow](https://www.npmjs.com/package/ow) library
-   The [io-ts](https://www.npmjs.com/package/io-ts) library
    -   Built on [fp-ts](https://www.npmjs.com/package/fp-ts), a library for typed functional programming in TypeScript
    -   Can be confusing if you're not familiar with functional programming concepts
    -   Provides more strict static type checking than standard TypeScript
        -   For example, if you define a property `age` that must be an integer, the inferred TypeScript type will not have `age: number` but instead it will have `age: t.Branded<number, t.IntBrand>`. Using a value of that type is straightforward, since you can use it anywhere you can use a `number`. In order to obtain a value of the type, you must either pass through the runtime type checking (recommended) or bypass TypeScript type checking altogether with something like `const age: t.Branded<number, t.IntBrand> = 1 as any`  (might make sense for test data and hardcoded values).
        -   The extra type safety may or may not be worth the extra boilerplate and complexity for your use case
-   The [zod](https://www.npmjs.com/package/zod) library
-   The [runtypes](https://www.npmjs.com/package/runtypes) library
-   The [@sinclair/typebox](https://www.npmjs.com/package/@sinclair/typebox) library
    -   Generates in-memory JSON Schemas in the background
    -   You need another library (like [ajv](https://www.npmjs.com/package/ajv)) for the actual validation

### Decorator-based class validation

Example library: [class-validator](https://www.npmjs.com/package/class-validator)

-   Uses decorators on class properties
-   Very similar to Java’s JSR-380 Bean Validation 2.0 (implemented by, for example, Hibernate Validator)
    -   Part of a family of Java EE-like libraries that also includes [typeorm](https://www.npmjs.com/package/typeorm) (ORM, similar to Java’s JPA) and [routing-controllers](https://www.npmjs.com/package/routing-controllers) (similar to Java’s JAX-RS for defining APIs)

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

Benefits/drawbacks:

-   No possibility for types to get out of sync
-   Good for validating against a class definition
-   Not ideal if you want to validate input against an interface
    -   One way to handle this: define a class implementing the interface and add the decorators there. This way, TypeScript helps you to keep the class in sync with the interface, although not all cases are covered (for example, you still need to remember to update the class type when removing properties from the interface)

Note: class-validator needs actual class instances to work on

-   Here, we used its sister library [class-transformer](https://www.npmjs.com/package/class-transformer) to transform our plain input into an actual `Person` instance
    -   The transformation in itself does not perform any kind of type checking!

### Frameworks integrating runtime type checking

Some example frameworks:

-   The [NestJS](https://nestjs.com/) framework
    -   Integrates with [class-validator](https://www.npmjs.com/package/class-validator) for runtime type checking ([doc](https://docs.nestjs.com/techniques/validation))
-   The [tsoa](https://tsoa-community.github.io/docs/) framework
    -   Automatically generates OpenAPI specs from your code
    -   Uses JSON Schema under the hood to provide runtime type checking
-   The [type-graphql](https://typegraphql.com) framework
    -   Automatically generates GraphQL SDL from your code
    -   Integrates with [class-validator](https://www.npmjs.com/package/class-validator) for runtime type checking ([doc](https://typegraphql.com/docs/validation.html))
-   The [routing-controllers](https://www.npmjs.com/package/routing-controllers) framework
    -   Integrates with [class-validator](https://www.npmjs.com/package/class-validator) for runtime type checking
