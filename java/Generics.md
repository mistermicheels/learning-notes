---
tree_title: Generics
description: An overview of generics in Java
last_modified: 2020-07-11T16:56:51.595Z
---

# Generics (Java)

## Contents

-   [Generics basics](#generics-basics)
-   [Wildcards](#wildcards)
    -   [A note about arrays](#a-note-about-arrays)
-   [Generics inside the Java Virtual Machine](#generics-inside-the-java-virtual-machine)
    -   [Type erasure](#type-erasure)
    -   [Cast insertion](#cast-insertion)
    -   [Bridge methods](#bridge-methods)
-   [The Class class](#the-class-class)
-   [Generics restrictions](#generics-restrictions)
-   [Resources](#resources)

## Generics basics

Simple class hierarchy for examples:

```java
public class Animal {}
```

```java
public class Dog extends Animal {}
```

Example generic interface:

```java
List<Dog> dogList = new ArrayList<Dog>();
dogList.add(new Dog());
Dog dog = dogList.get(0);
dogList.add(new Object()); // compiler error
```

Example generic method:

```java
public <T extends Animal> T getFirstAnimal(List<T> animals) {
    return animals.get(0);
}
```

`T extends Animal` is a _type bound_.

## Wildcards

What if you need something representing any kind of list of animals?

```java
List<Dog> dogList = new ArrayList<Dog>();
List<Animal> animalList = dogList; // compiler error
```

Reason why this fails: a proper `List<Animal>` allows adding any `Animal`, while a `List<Dog>` should only allow adding `Dog`s. This means that the two types are not compatible. 

If we only care about the fact that our List contains some kind of `Animal`s, we can use type wildcards to define this:

```java
List<Dog> dogList = new ArrayList<Dog>();
List<? extends Animal> extendsAnimalList = dogList; // works
```

`? extends Animal` is called a _subtype wildcard_. `? super Dog` is called a _supertype wildcard_

```java
List<Dog> dogList = new ArrayList<Dog>();

List<? extends Animal> extendsAnimalList = dogList;
Animal animal = extendsAnimalList.get(0); // works
extendsAnimalList.add(new Dog()); // compiler error

List<? super Dog> superDogList = dogList;
Animal animal2 = superDogList.get(0); // compiler error
superDogList.add(new Dog()); // works
```

 For very generic code, you can also use a wildcard (`?` without type bounds)

### A note about arrays

We saw above that it is not possible to assign a `List<Dog>` to a `List<Animal>`, which makes sense. However, this is not the case for arrays. You can easily assign a `Dog[]` array to an `Animal[]` array without the compiler complaining. However, if you then attempt to insert an `Animal` that is not a `Dog` into the array, you will get an error at runtime.

```java
Dog[] dogs = new Dog[10];
Animal[] animals = dogs; // works
animals[0] = new Animal() // fails at runtime
```

## Generics inside the Java Virtual Machine

### Type erasure

Java only added generics in version 1.5. Before that, instead of the generic `ArrayList<T>`, there was just the class `ArrayList`. When introducing generics, the Java team decided to maintain compatibility by actually erasing the generic type information at compile time, meaning that the byte code running in the Java Virtual Machine does not know anything about generics.

Example generic type:

```java
public class AnimalWrapper<T extends Animal> {    
    private T wrappedAnimal;

    public AnimalWrapper(T wrappedAnimal) {
        this.wrappedAnimal = wrappedAnimal;
    }
    
    public T getWrappedAnimal() {
        return this.wrappedAnimal;
    }
}
```

The above type is compiled into the following _raw_ type:

```java
public class AnimalWrapper {    
    private Animal wrappedAnimal;

    public AnimalWrapper(Animal wrappedAnimal) {
        this.wrappedAnimal = wrappedAnimal;
    }
    
    public Animal getWrappedAnimal() {
        return this.wrappedAnimal;
    }
}
```

Before erasing the types, the compiler checks for errors involving generic types. For example, it will forbid wrapping an `Animal` in an `AnimalWrapper<Dog>`. This means that, although the types are erased later on, the type variables are still respected.

### Cast insertion

Although the compiler checks for generic type mismatches, that this in itself is not always enough. An example is the following code:

```java
List<Dog> dogList = new ArrayList<Dog>();        
List rawList = dogList;        
Animal animal = new Animal();
rawList.add(animal);
```

The above code generates warnings, but if you choose to ignore those, you now have an `Animal` sitting inside a `List<Dog>`. This is known as _heap pollution_. But what about type safety?

Java handles this in the compiler by inserting a cast whenever the code _reads_ from an expression with erased type. This means that, while we can add the `Animal` to our `List<Dog>`, we will get a `ClassCastException` if we try to retrieve that `Animal` as a `Dog`.

```java
List<Dog> dogList = new ArrayList<Dog>();  
List rawList = dogList;
Animal animal = new Animal();
rawList.add(animal);

Animal retrievedAnimal = dogList.get(0); // works
Dog retrievedDog = dogList.get(0); // ClassCastException
```

Compiled code is equivalent to this:

```java
List dogList = new ArrayList();  
List rawList = dogList;
Animal animal = new Animal();
rawList.add(animal);

// note that the erased List.get() method returns an Object
// cast insertion generates casts based on target type
Animal retrievedAnimal = (Animal) dogList.get(0); // works
Dog retrievedDog = (Dog) dogList.get(0); // ClassCastException
```

when we get the `ClassCastException` on the last line, that does not help us to find the actual source of the problem (which is the code where we inserted an `Animal` inside a `List<Dog>`). When debugging such problem, it can be useful to use a _checked view_ of the `List`. This checks the type of inserted objects as they are inserted.

```java
List<Dog> dogList = 
    Collections.checkedList(new ArrayList<Dog>(), Dog.class);

List rawList = dogList;
Animal animal = new Animal();
rawList.add(animal); // ClassCastException
```

Note the use of `Dog.class`, a `Class<Dog>` instance which is needed to know the actual value of the type parameter for the `List` at runtime. 

### Bridge methods

In some cases, basic type erasure would lead to problems with method overriding. In order to prevent this, the Java compiler sometimes generates _bridge methods_.

Example class:

```java
public class GoodBoyList extends ArrayList<Dog>{
    @Override
    public boolean add(Dog dog) {
        dog.pet():
        return super.add(dog);
    }
}
```

Now, let's say we use it this way:

```java
GoodBoyList goodBoyList = new GoodBoyList();
ArrayList<Dog> dogList = goodBoyList;
dogList.add(new Dog());
```

After erasure, we have `add(Dog)` in `GoodBoyList` and `add(Object)` in `ArrayList`. The last line of the code above calls the `add` method on `ArrayList`. We expect the `add` method from `GoodBoyList` to override this, but the problem is the method signatures are different.

The compiler solves this by inserting a bridge method `add(Object)` into the `GoodBoyList` class. That method looks like this:

```java
// overrides ArrayList.add(Object)
public boolean add(Object dog) { 
    return this.add((Dog) dog); // calls add(Dog) 
}
```

Bridge methods can also be used when the return type varies. For example, imagine that our `GoodBoyList` also overrides the `get(int)` method.

    public class GoodBoyList extends ArrayList<Dog>{
        @Override
        public Dog get(int i) {
            Dog dog = super.get(i);
            dog.pet():
            return dog;
        }
    }

Note: inside the Java Virtual Machine, a method is defined by its name, the number and types of its arguments _and_ by its return type. This means that, after erasure, we again need a bridge method to make overriding work here. This way, we get two `get` methods in `GoodBoyList`:

-   `Dog get(int)`: this is the actual method as defined in `GoodBoyList`
-   `Object get(int)`: this is a generated bridge method that overrides the `Object get(int)` method in `ArrayList`.

The compiler takes care of the generation of bridge methods, so in principle you don’t have to worry about them. However, they may show up in stack traces or explain why the compiler complains about certain pieces of code.

## The Class class

The Java language has a `Class<T>` class. A `Class<T>` object represent the class `T`. This class object can directly be obtained from the class `T`. It is also possible to to get a `Class` object from an instance of a class, but in that case you are getting the actual run-time type of that instance, which may be a subclass of its compile-time type.

```java
Class<Dog> test = Dog.class; // ok
Class<Dog> test2 = new Dog().getClass(); // error
Class<? extends Dog> test3 = new Dog().getClass(); // ok
```

You can use the `Class` class to get more information regarding the value of a type variable at run-time (so after type erasure). Example:

```java
public class Test<T> {    
    Test(T object, Class<T> objectClass) {}
}

public class Main {
    public static void main(String[] args) {            
        Dog dog = new Dog();
        new Test<Animal>(dog, Animal.class);
    }
}
```

`T` is erased, but we can still have a look at `objectClass` to check what kind of object we received.

The `Class<T>` object is also very useful when using `reflection`. For example, it can help you access the constructor(s) for the class.

## Generics restrictions

Type arguments cannot be primitives

-   A type parameter must always be Object or a subclass of Object. This means that, for example, it is not possible to define an `ArrayList<int>`.

At runtime, all types are raw

-   Reason: type erasure
-   Something like `if (object instanceof ArrayList<Dog>`) will not compile because this check is impossible to execute at runtime.
-   The Class instances that you get are also always raw types. There is no `ArrayList<Dog>.class`, only `ArrayList.class`.

Type variables cannot be instantiated

-   If you have a type variable T, you cannot do `new T(...)` or `new T[...] (array)`. 
-   Reason: type erasure (you would be instantiating the erased value for T, not T itself).
-   If you want to construct objects of type T or arrays of type T inside a generic method, you will have to ask the caller for the right object or array constructor or for a Class object.
-   While you cannot instantiate an array of type T, you can easily create an `ArrayList<T>`. This is because ArrayList is a generic type itself, while in order to create an array of type T we would need the exact type T at runtime.

It’s impossible to create arrays of parameterized types

-   You can declare arrays of a parameterized type (e.g. `AnimalWrapper<Dog>[]`)
-   You cannot instantiate an array of a parameterized type. 
-   Reason: type erasure. At runtime, we would just get an `AnimalWrapper[]` array that allows any kind of `AnimalWrapper` without throwing an `ArrayStoreException`. If that is what you want, you can create an `AnimalWrapper[]` and then cast it to `AnimalWrapper<Dog>[]` (this will generate compiler warnings though).
-   The simplest solution is often to just create an `ArrayList<AnimalWrapper<Dog>>` instead.

Class type variables are not valid in static contexts

-   Type variables defined at the level of the class cannot be used in static contexts (static variables and static methods). 
-   Example: if you have a class with type parameter T, you cannot have a static variable of type T. 
-   Reason: type erasure. You can use a class multiple times with different values for T but a static variable only exists once (on the raw type), so it’s impossible to have a static variable with the exact type T for each of those values.
-   Remember that you can still use type variables in static contexts if they are not defined at the level of the class. For example, you can have a static method parameterized with type T if that type parameter is declared at the level of the method.

Methods may not clash after erasure

-   You are not allowed to declare methods that would clash after erasure (meaning that, after erasure, there would be two methods with the same signature).
-   This includes bridge methods! If you get a compiler error about methods clashing after erasure, it’s possible that the clash is generated by the bridge methods generated by the compiler. This is why it’s important to have some understanding of what these bridge methods are.

Exceptions: it is not possible to throw objects of a generic class. 

-   Reason: type erasure. Catching instances of a generic class with a specific type parameter would require information that is not available at runtime.
-   It is still allowed to have a type variable in your throws declaration, as this is checked by the compiler.

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
