---
tree_title: Lambda expressions
description: The idea behind lambda expressions, how to use them, lambda expression scope, etc.
last_modified: 2022-01-31T10:44:35.268Z
---

# Lambda expressions (Java)

## Contents

-   [Lambda expressions in general](#lambda-expressions-in-general)
-   [Lambda expressions in Java](#lambda-expressions-in-java)
-   [Functional interfaces](#functional-interfaces)
-   [Lambda expression scope](#lambda-expression-scope)
-   [Java as a (somewhat) functional language](#java-as-a-somewhat-functional-language)
-   [Alternatives: local and anonymous classes](#alternatives-local-and-anonymous-classes)
-   [Functional interfaces and instantiation](#functional-interfaces-and-instantiation)
-   [Resources](#resources)

## Lambda expressions in general

_Lambda expression_:

-   General concept in programming that is a synonym for _anonymous function_
-   Is a function (a piece of code that accepts input, does something with it and potentially returns a result) that is not explicitly named.
-   These anonymous functions are very useful for passing them around to be used as input for other functions that operate on functions.

Why the name lambda? Anonymous functions were first described in a paper by Alonzo Church, written in 1936, before electronic computers even existed. In that paper, the parameters for the anonymous functions were marked using the letter λ (lambda). He picked this letter because the classic work _Principia Mathematica_, a very important work in the field of mathematics released about 20 years earlier, used the ^ accent to mark function parameters, which kind of looked like an uppercase lambda (Λ).

## Lambda expressions in Java

Lambda expression in Java:

-   Some code to execute (the body of the expression), together with the input parameters.
-   You don’t need to specify the return type of the body: Java automatically infers it. 
-   If the body doesn’t fit on one line, simply create a block for it.
-   If you specify the interface that the lambda expression conforms to, Java can infer the types of the parameters and you don’t need to specify them explicitly anymore
    -   If there is only a single argument with an inferred type, we can even omit the parentheses around that argument.

```java
public static int compareStrings(Comparator<String> comp) {
    return comp.compare("string1", "string2");
}

public static int test() {
    return compareStrings((first, second) ->
        first.length() - second.length());
}
```

## Functional interfaces

_Functional interface_:

-   Interface is that it has a single abstract method
-   Example: `Comparator<String>`
-   Whenever a piece of code requires an object conforming to a functional interface, you can instead pass a lambda expression implementing the single abstract method of that interface
-   Often have `@FunctionalInterface` annotation
    -   Not required, but recommended
    -   Clear indication that the interface is a functional interface
    -   Compile-time checking that the interface indeed has a single abstract method

With the introduction of lambda expressions, Java also supplied a collection of new predefined functional interfaces in the [java.util.function](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html) package. These are some general interfaces specifically intended to describe common signatures for lambda expressions. 

Example functional interface included in java.util.function: `Predicate<T>`

-   Represents a predicate (boolean-valued function) taking one argument
-   Has a single abstract method `test(T t)` returning a boolean value
-   Has static factory method `isEqual`, returning a `Predicate` implementation that checks for equality to a certain object
-   Has default methods `and`,`or` and `negate` to combine or invert existing predicates

Also several other functional interfaces available by default, like `java.util.Comparator` (seen above) or `java.lang.Runnable`

Creating own functional interfaces:

-   Avoid this where possible (prefer using predefined functional interfaces)
-   Mostly useful if you need a functional interface with uncommon signature
    -   Example: an expression taking two `int` values and returning an instance of a custom `Color` class
        -   Could in principle use the `BiFunction<Integer, Integer, Color>` interface, but you can avoid automatic boxing ad unboxing between `int` and `Integer` by specifying your own function interface
    -   Example: expression taking a String and potentially throwing a checked exception, which should then be declared on the abstract method of the functional interface
-   Don’t forget to mark with `@FunctionalInterface` annotation

## Lambda expression scope

Lambda expressions have the same scope as a `nested block`:

-   Cannot declare a variable with the same name as a variable in the enclosing scope
-   If you use the `this` keyword inside a lambda expression, it denotes the `this` reference of the method creating the lambda
    -   Consequence: lambda expressions cannot call default methods of the interface they implement
-   Other example of nested block scope: the block of an if-statement

Important feature of lambda expressions: can access variables from the enclosing scope

-   This means lambda expression can access variables from the method creating the lambda expression, even if that method has already completed and its local variables are thus gone!
-   When storing a lambda expression in a variable, the object representing the lambda expression also includes the values of these _free variables_ (variables that are not parameters and are not defined inside the lambda expression’s code)
-   Such a combination of a block of code together with the values of free variables is called a _closure_
-   Important restriction: you can only capture variables that are _effectively final_
    -   Effectively final: the variables don’t change; either they are declared `final` or they could have been declared `final`
    -   This also means that it is not possible to reassign captured variables from the lambda expression
    -   This is a lot more restrictive than what you can do in for example JavaScript
    -   Note: while you cannot change the values of captured variables, you can still call methods on them if they are objects. 
    -   Note: the variable of an enhanced `for` loop is effectively final because its scope is limited to a singe iteration of the loop.

Example block scope and accessing free variable:

```java
public class Test {    
    private int instanceVariable = 1;
    
    public Predicate<String> getPredicate() {
        int localVariable = 10;
        
        return string -> {
            int localVariable = 5; // compiler error
            System.out.println(localVariable); // 10
            System.out.println(this.instanceVariable); // 1
            return string.length() > localVariable;
        };
    }
}
```

Example effectively final:

```java
int localVariable = 10;

for (int i = 0; i < 10; i++) {
    predicates.add(string -> {
        localVariable++; // compiler error
        return string.length() > i; // compiler error
        return string.length() > localVariable; // ok
    });
}
```

Example effectively final enhanced for loop:

```java
List<Integer> integers;
List<Integer> processedIntegers;

for (Integer integer: integers) {
    predicates.add(string -> {
        processedIntegers.add(integer);
        return string.length() > integer;
    });
}
```

## Java as a (somewhat) functional language

With the introduction of lambda expressions, Java added some features typical for functional languages:

-   Lambda expressions and functional interfaces can be seen as a way to treat functions as first-class objects, allowing to store functions in variables or pass them around to functions
-   This way, Java supports the creation of _higher-order functions_, which are methods/functions that process or return other functions (although, in reality, those functions are just objects of classes implementing a functional interface)
-   Example: a static method that accepts a boolean indicating a direction and returns a `Comparator` based on the input
-   Example: a method that takes a `Comparator`and returns a new `Comparator` reversing the order of the initial `Comparator` (the `Comparator` interface actually has a default method `reversed()` which reverses the current `Comparator`)

Java now also has a powerful mechanism to pass regular methods around as objects, which is essentially a shorthand for writing lambda expressions invoking the same methods. This is the mechanism of _method references_. There are three variations here:

-   _Class::staticMethod_: a reference to a static method of a class
-   _Class::instanceMethod_: a reference to an instance method of a class. The first argument specifies the object on which the instance method is invoked.
-   _object::instanceMethod_: a reference to an instance method of a class which will be invoked an a specific object

```java
public class Test {    
    public static void staticMethod(String input) {
        System.out.println("static:" + input);
    }
    
    public void instanceMethod(String input) {
        System.out.println("instance:" + input);
    }
}
```

```java
// method reference
Test::staticMethod
// equivalent lambda expression
input -> Test.staticMethod(input)

// method reference
Test::instanceMethod
// equivalent lambda expression (2 parameters!)
(instance, input) -> instance.instanceMethod(input)

Test testInstance = new Test();
// method reference
testInstance::instanceMethod
// equivalent lambda expression
input -> testInstance.instanceMethod(input)
```

Some more realistic examples:

```java
List<String> list = new ArrayList<String>();
        
// Class::staticMethod
list.removeIf(Objects::isNull);
// Class::instanceMethod
list.sort(String::compareToIgnoreCase);
// object::instanceMethod
list.forEach(System.out::println);
```

As another practical example, consider the `Comparator.comparing` method. This method takes a method reference that extracts the values to compare. This allows for easy construction of custom `Comparator` instances.

```java
personList.sort(Comparator
    .comparing(Person::getLastName)
    .thenComparing(Person::getFirstName))
```

There is also a similar mechanism, _constructor references_, for passing around constructors. This uses the syntax _Class::new_. If there are multiple constructors, the compiler will infer which constructor to use from the context.

```java
public class Dog {    
    private final String name;
    
    public Dog() {
        this.name = "Max";
    }

    public Dog(String name) {
        this.name = name;
    }
}
```

```java
// no-argument constructor
Supplier<Dog> dogSupplier = Dog::new;

// String argument constructor
Function<String, Dog> nameToDog = Dog::new;
```

You can also use constructor references to construct arrays. In that case, the array size is determined by the single parameter passed to the constructor reference.

## Alternatives: local and anonymous classes

Before the introduction of lambda expressions, Java already had a concise way to define a class implementing an interface. The way to do this was to use local or anonymous classes.

A _local class_ is a class defined inside a method. A typical use case is if you want to provide an object conforming to an interface and it doesn’t really matter what the implementing class is.

```java
int localVariable = 10;
        
class LengthPredicate implements Predicate<String> {
    @Override
    public boolean test(String string) {
        return string.length() > localVariable;
    }
}

Predicate<String> predicate = new LengthPredicate();
```

If you use your local class only once, it makes more sense to remove the name and to define it as an _anonymous class_.

```java
int localVariable = 10;        

Predicate<String> predicate = new Predicate<String>() {
    @Override
    public boolean test(String string) {
        return string.length() > localVariable;
    }
};
```

Just like with lambda expressions, the code in local and anonymous classes can access local variables defined in their enclosing scope. Also just like with lambda expressions, this is only allowed if those local variables are effectively final.

Some important differences:

-   You can use local/anonymous classes to implement interfaces with more than one abstract method. You are not restricted to functional interfaces.
-   Local/anonymous classes allow you to define local variables with the same name as local variables in the enclosing scope. This hides the variable in the enclosing scope from the code in the local/anonymous class (this is called _shadowing_). Lambda expressions forbid this.
-   Local/anonymous classes are actual classes
    -   Unlike lambda expressions, they can define and access their own instance variables. 
    -   This also means that, if you use the `this` keyword in a method of a local/anonymous class, it refers to the instance of the class itself and not to the `this` reference of the method creating the local/anonymous class. 
        -   Can use this to call default methods on the interface that they are implementing!
        -   Still possible to access `this` reference of the method creating the local/anonymous class if needed

Example more than one abstract method:

```java
public interface TwoMethodInterface {
    public void methodA();
    public void methodB();
}
```

```java
TwoMethodInterface twoMethodInterface = new TwoMethodInterface() {
    @Override
    public void methodA() {
        System.out.println("methodA");
    }

    @Override
    public void methodB() {
        System.out.println("methodB");
    }
};
```

Example shadowing:

```java
int localVariable = 10;        

Predicate<String> predicate = new Predicate<String>() {
    @Override
    public boolean test(String string) {
        System.out.println(localVariable); // 10
        int localVariable = 1;    
        System.out.println(localVariable); // 1
        return string.length() > localVariable;
    }
};
```

Example instance variables, `this`and default methods:

```java
public interface InterfaceA {    
    public abstract void doSomething();
    
    public default void logCount(int count) {
        System.out.println(count);
    }
}
```

```java
InterfaceA interfaceA = new InterfaceA() {
    private int count = 0;
    
    @Override
    public void doSomething() {
        this.count++;
        this.logCount(this.count);
    }
};
```

Example accessing `this` reference of the enclosing method:

```java
public class Test {    
    private int instanceVariable = 0;
    
    public int getInstanceVariable() {
        return this.instanceVariable;
    }
    
    public void test() {
        // using method reference
        IntSupplier supplier = this::getInstanceVariable;
        // using a local variable referring to this
        Test outer = this;
        // available from Java 10
        // also works if this is instance of anonymous class
        var outer2 = this;
        
        InterfaceA interfaceA = new InterfaceA() {            
            @Override
            public void doSomething() {
                int outerInstanceVariable = supplier.getAsInt();
                outer.instanceVariable++;
            }
        };
        
        interfaceA.doSomething();
    }
}
```

## Functional interfaces and instantiation

Lambda expressions can be used as the value for variables or parameters that have a functional interface as a type. So, does this mean that lambda expressions violate the rule that interfaces cannot be directly instantiated?

Answer: no!

-   When you write a lambda expression, Java uses that to create an instance of some class that implements the relevant functional interface
-   The way these objects and classes are managed depends on the specific Java implementation and can be highly optimized
-   Similar behavior when using anonymous class

Example:

```java
Predicate<String> pred1 = (string -> string.length() > 1);

Predicate<String> pred2 = new Predicate<String>() {
    @Override
    public boolean test(String string) {
        return string.length() > 1;
    }
};


System.out.println(pred1.getClass()); // class misc.Main$$Lambda$1/834600351
System.out.println(pred2.getClass()); // class misc.Main$4
```

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
-   [Anonymous function](https://en.wikipedia.org/wiki/Anonymous_function)
-   [Package java.util.function](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)
-   [Java 8 Functional interfaces (not the ones listed in java.util.function)](https://stackoverflow.com/questions/42942351/do-you-have-a-list-of-java-8-functional-interfaces-not-the-ones-listed-in-java)
-   [Java 8 Lambdas vs Anonymous classes](https://stackoverflow.com/questions/22637900/java8-lambdas-vs-anonymous-classes)
-   [Access method of outer anonymous class from inner anonymous class](https://stackoverflow.com/questions/53211917/access-method-of-outer-anonymous-class-from-inner-anonymous-class)
