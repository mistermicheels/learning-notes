---
tree_title: Overloading, overriding and method hiding
description: An overview of how overloading, overriding and method hiding works in Java
last_modified: 2020-05-30T15:54:15+02:00
---

# Overloading, overriding and method hiding (Java)

## Contents

-   [Overloading](#overloading)
-   [Overriding](#overriding)
-   [Combining overloading and overriding](#combining-overloading-and-overriding)
-   [Method hiding](#method-hiding)
-   [Resources](#resources)

## Overloading

What it is: a class has several methods with the same name but different number or types of parameters and Java chooses which one to call based on the arguments you pass

```java
class OverloadingTest {
    public void testMethod(Object object) {
        System.out.println("object");
    }
    
    public void testMethod(String string) {
        System.out.println("string");
    }
}
```

```java
OverloadingTest test = new OverloadingTest();
Object testObject = new Object();
String testString = "testString";

test.testMethod(testObject); // object
test.testMethod(testString); // string
```

Important: the exact _signature_ of the method to call is based at **compile time** using the compile-time types of the arguments

```java
Object testStringAsObject = testString;
test.testMethod(testStringAsObject); // object
```

## Overriding

What it is: a subclass overrides an instance method of a direct or indirect superclass by providing its own implementation

```java
class OverridingTestSuper {
    public void testMethod(Object object) {
        System.out.println("super");
    }
}

class OverridingTestSub extends OverridingTestSuper {
    @Override
    public void testMethod(Object object) {
        System.out.println("sub");
    }
}
```

Note: use`@Override` annotation when overriding, so the Java compiler helps you check that the method is actually correctly overriding a supertype method

```java
OverridingTestSuper testSuper = new OverridingTestSuper();
OverridingTestSub testSub = new OverridingTestSub();
Object testObject = new Object();

testSuper.testMethod(testObject); // super
testSub.testMethod(testObject); // sub
```

Important: The _implementation_ to invoke is determined at **run time** based on the actual runtime type of the object and the structure of the inheritance hierarchy

```java
OverridingTestSuper testSubAsSuper = testSub;
testSubAsSuper.testMethod(testObject); // sub
```

## Combining overloading and overriding

```java
class CombinedTestSuper {
    public void testMethod(Object object) {
        System.out.println("super object");
    }
}

class CombinedTestSub extends CombinedTestSuper {
    @Override
    public void testMethod(Object object) {
        System.out.println("sub object");
    }
    
    public void testMethod(String string) {
        System.out.println("sub string");
    }
}
```

```java
CombinedTestSuper testSuper = new CombinedTestSuper();
CombinedTestSub testSub = new CombinedTestSub();
CombinedTestSuper testSubAsSuper = testSub;

String testString = "testString";
Object testStringAsObject = testString;

testSuper.testMethod(testString); // super object (only one method on CombinedTestSuper)
testSuper.testMethod(testStringAsObject); // super object (only one method on CombinedTestSuper)

testSub.testMethod(testString); // sub string (chooses signature testMethod(String) on CombinedTestSub)
testSub.testMethod(testStringAsObject); // sub object (chooses signature testMethod(Object) on CombinedTestSub)

testSubAsSuper.testMethod(testString); // sub object (uses signature of only method on CombinedTestSuper but implementation of CombinedTestSub)
testSubAsSuper.testMethod(testStringAsObject); // sub object (uses signature of only method on CombinedTestSuper but implementation of CombinedTestSub)
```

## Method hiding

For static methods, overloading is still used to determine the signature of the method to invoke

But what if superclass and subclass both have static method with same signature?

```java
class CombinedTestSuper {
    public static void testStaticMethod(Object object) {
        System.out.println("super");
    }
}

class CombinedTestSub extends CombinedTestSuper {
    public static void testStaticMethod(Object object) {
        System.out.println("sub");
    }
}
```

Calling static methods on classes:

```java
Object testObject = new Object();

StaticSuper.testStaticMethod(testObject); // super
StaticSub.testStaticMethod(testObject); // sub
```

Calling static methods on instances (note that this will generate compiler warnings):

```java
StaticSuper staticSuper = new StaticSuper();
StaticSub staticSub = new StaticSub();
StaticSuper staticSubAsSuper = staticSub;

staticSuper.testStaticMethod(testObject); // super
staticSub.testStaticMethod(testObject); // sub
staticSubAsSuper.testStaticMethod(testObject); // super (!!!)
```

No overriding here! Instead, we get _method hiding_.

Can be pretty confusing (not only the method hiding itself, but also the fact that we call a static method in a way that makes it look like an instance method), which is also why we get warnings when doing this.

## Resources

-   [Overloading in the Java Language Specification](https://docs.oracle.com/javase/specs/jls/se10/html/jls-8.html#jls-8.4.9)
-   [Java Method Hiding and Overriding](https://crunchify.com/java-method-hiding-and-overriding-override-static-method-in-java/9)
