---
description: Some general best practices regarding exception handling
last_modified: 2020-11-15T22:06:37.294Z
---

# Exception handling

## Contents

-   [Throw early, catch late](#throw-early-catch-late)
-   [Providing context with exceptions](#providing-context-with-exceptions)
-   [Client-first design for exception classes](#client-first-design-for-exception-classes)
-   [Resources](#resources)

## Throw early, catch late

General best practice regarding exceptions: “Throw early, catch late”. In other words: “Don’t catch an exception unless you are in the best position to do something useful with it”.

For example, if an exception occurs because there is no file at a specific path, it often makes sense to propagate the exception up to the level where the path to use is determined.

In general, you should only catch exceptions if:

-   You can perform a useful action on the exception (possibly just logging) and then rethrow it.
-   You can wrap the exception into a new exception that makes more sense to your caller and throw that new exception.
-   You can make a final decision regarding what must happen to fully handle the exception.

## Providing context with exceptions

Although exceptions contain a stack trace that shows the call chain at the time the exception occurred, it is often advisable to pass additional context. Typically, you should at least provide a meaningful message explaining the intent of the operation that failed and the reason for failure. When defining custom exception classes, you can also foresee additional data being stored with the exception.

If your application has logging, your exception (including stack trace) should contain enough information for creating a meaningful log message.

## Client-first design for exception classes

When designing which and how many exception classes you need, try to consider the point of view of the caller.

-   If caller needs to handle different kinds of errors in a different way, foresee different exception classes
-   If caller has only one reasonable way of handling any kind of of error, only foresee a single exception class that potentially includes more details regarding the specific error that happened (in Java, exception chaining could be useful here)
    -   If you are using a class with methods that can throw lots of different exception types, consider wrapping it in a class that delegates actual functionality to the wrapped class but catches a set of specific errors and wraps these into a single, more general error class.  This is one of the techniques you can use to transform a library’s interface into an interface that makes more sense to your application, decoupling your application from the interface that the library provides.

```java
public void open() {
    try {
        this.wrapped.open();
    } catch (Type1 | Type2 | Type3 ex) {
        throw new WrappedException(ex);
    }
}
```

## Resources

-   Clean Code (book by Robert C. Martin)
-   [Exceptions: Why throw early? Why catch late?](https://softwareengineering.stackexchange.com/questions/231057/exceptions-why-throw-early-why-catch-late)
