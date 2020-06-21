---
tree_title: Interfaces
description: An overview of interfaces in Java
last_modified: 2020-05-30T15:54:15+02:00
---

# Interfaces (Java)

## Contents

-   [Basics](#basics)
-   [Default methods](#default-methods)
-   [Abstract classes vs. interfaces](#abstract-classes-vs-interfaces)
-   [Default methods and inheritance](#default-methods-and-inheritance)
-   [Resources](#resources)

## Basics

Main idea behind interfaces: specify the contract between supplier(s) of certain functionality and client code which uses that functionality

Most common use case: 

-   Define an interface declaring one or more abstract methods (without implementation)
-   There may be several classes actually implementing the interface (and specifying concrete implementations for the methods)
-   Client code can then require an object that conforms to a certain interface, without having to care about which implementing class the object is an instance of

An interface can contain:

-   Public static constants
-   Public abstract methods
-   Nested classes, interfaces, enums and annotations (often not considered good practice)
-   Default methods (since Java 8, see below)
-   Private methods (since Java 9)
    -   Can be used by default method implementations specified in the interface
-   Static methods (since Java 9)
    -   Can be useful as factory methods for functional interfaces (see [Lambda expressions](./Lambda-expressions.md))

## Default methods

_Default method_: method in an interface that specifies an actual implementation.

Classes implementing an interface with default methods can choose to use that implementation (this is what happens by default) or override it with custom implementation.

Use cases:

-   Backwards compatible extension of interfaces
    -   Example: the introduction of streams in Java 8
        -   Starting from Java 8, the `Collection` interface now has a `.stream()` method
        -   If that method would have been added to the `Collection` interface as an abstract method, this would have meant that all of the custom `Collection` classes that people had implemented would fail to compile until their authors added that `.stream()` method. Additionally, if such a class was supplied in a JAR file (for example, a reusable library) that was compiled with an earlier version of Java, the class would still load successfully but users would suddenly get runtime errors on calling the `.stream()` method.
-   Cleaner alternative to the older pattern of declaring an interface (with only abstract methods) and then offering an abstract companion class providing default implementations for most of the methods
    -   Example of that older pattern: `Collection` and `AbstractCollection`

## Abstract classes vs. interfaces

As interfaces have become more powerful, they have become more similar to abstract classes.

Still, some differences remain:

-   Interfaces cannot be instantiated
    -   Every object has to be an instance of an actual class
    -   Unlike abstract classes, interfaces cannot have any instance variables or constructors
        -   Interfaces are for specifying behavior, not for encapsulating state
-   Static variables on interfaces can only be `final`
-   A class can only extend at most one abstract class, but a class can implement any number of interfaces
    -   Makes sense: an interface is intended to specify a contract and a class could potentially conform to multiple contracts

## Default methods and inheritance

Problem: Since interfaces can now also contain method implementations, it is possible that the class/interfaces that a class extends/implements contain several implementations for the same method signature. What do we do in this case? This is known as the [diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem).

How Java solves this:

If two interfaces that a class implements specify a method with the same signature, you must always provide an implementation.

-   Even if only one of the interfaces provides a default implementation, the compiler forces you to be explicit about the specific implementation to be used
    -   If one of the default methods already specifies the behavior you want, your implementation can simply delegate to it
-   If none of the interfaces has a default implementation, the implementing class must provide an implementation anyway

```java
public interface InterfaceA {    
    public abstract void doSomething();
}

public interface InterfaceB {    
    public default void doSomething() {
        System.out.println("test");
    };
}

public class Class implements InterfaceA, InterfaceB {
    // compiler forces us to provide an implementation
    @Override
    public void doSomething() {
        // delegate to behavior specified in InterfaceB
        InterfaceB.super.doSomething();
    }
}
```

If a class inherits from a superclass implementing a certain method but also implements an interface that has a default method with the same signature,  the implementation from the superclass will always have priority

-   This prevents default methods from changing the behavior of code that was written before Java 8.

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
-   [Evolution of Interfaces in History of Java](https://dzone.com/articles/evolution-of-interface-in-history-of-java)
-   [Difference between Abstract Class and Interface in Java](https://www.geeksforgeeks.org/difference-between-abstract-class-and-interface-in-java/)
-   [The diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem)
