---
tree_title: Optional type
description: How and when to use the Java Optional type
last_modified: 2020-05-30T15:54:15+02:00
---

# Optional type (Java)

## Contents

-   [Basic idea](#basic-idea)
-   [How to use Optional values](#how-to-use-optional-values)
-   [How not to use Optional values](#how-not-to-use-optional-values)
-   [Creating Optional values](#creating-optional-values)
-   [Turning an Optional into a Stream](#turning-an-optional-into-a-stream)
-   [Resources](#resources)

## Basic idea

`Optional<T>`: a wrapper for either an object of type `T` or no object

Goal: provide safer alternative to returning either an object of type `T` or `null`

Main use case: return type for methods that do not necessarily produce a value

Note: Method parameters of type `Optional` are not recommended because this makes it awkward to call the method. For implementing methods with optional parameters, method overloading is generally considered a better option. See also [Why should Java 8's Optional not be used in arguments](https://stackoverflow.com/a/39005452)

## How to use Optional values

Basically, two sensible options:

-   use a method that produces an alternative value if the Optional is empty
-   use a method that only consumes the value if the Optional is not empty

Examples first option:

```java
String result = optionalString.orElse("");
String result = optionalString.orElseGet(functionReturningString);
String result = optionalString.orElseThrow(IllegalStateException::new);
```

Examples second option:

```java
optionalString.ifPresent(processString); // returns nothing

optionalString.ifPresentOrElse(
        System.out::println, 
        () -> System.out.println("Empty!")); // returns nothing

// Optional containing the length of the value (if it was present) and empty otherwise
optionalString.map(String::length)
    
optionalString.flatMap(functionReturningOptionalInteger) // Optional<Integer>
```

## How not to use Optional values

When used in the wrong way, using `Optional` is not safer or easier than using null

Examples:

```java
nullableString.length() // length throws NullPointerException
optionalString.get().length() // get throws NoSuchElementException

if (nullableString != null) {
    length = nullableString.length()
}

if (optionalString.isPresent()) {
    length = optionalString.get().length()
}
```

## Creating Optional values

```java
Optional<String> optionalString = Optional.of("test"); // throws if argument null
Optional<String> optionalString = Optional.ofNullable(nullableString);
Optional<String> optionalString = Optional.empty();
```

## Turning an Optional into a Stream

Conceptually, you can compare an Optional to a stream with either zero or one elements. The `.stream()` method follows that principle, yielding a stream with zero elements if the Optional is empty and a stream with one element if the optional has a value

Example use case:

```java
idsStream
        .map(Users::lookup) // Users.lookUp returns an Optional<User>
        .flatMap(Optional::stream)
```

Note: if you call a method that returns either a value or null, you can apply the samle principle using `Stream.ofNullable`:

```java
idsStream
        .map(Users::lookup) // Users.lookUp returns a User object or null
        .flatMap(Stream::ofNullable)
```

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
-   [Why should Java 8's Optional not be used in arguments](https://stackoverflow.com/a/39005452)
