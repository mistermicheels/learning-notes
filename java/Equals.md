---
tree_title: Equals
description: How and why to write custom equals methods in Java
last_modified: 2022-01-31T10:44:35.256Z
---

# Equals (Java)

## Contents

-   [Why override standard equals?](#why-override-standard-equals)
-   [The requirements for a good `equals` method](#the-requirements-for-a-good-equals-method)
-   [Example class](#example-class)
-   [Naïve implementations](#naïve-implementations)
    -   [Not properly overriding the `equals` method](#not-properly-overriding-the-equals-method)
    -   [Forgetting about `hashCode`](#forgetting-about-hashcode)
    -   [Mutable variables](#mutable-variables)
-   [Simple decent implementation](#simple-decent-implementation)
-   [Dealing with subclasses](#dealing-with-subclasses)
    -   [Allowing subclasses to be equal to superclasses](#allowing-subclasses-to-be-equal-to-superclasses)
    -   [Subclasses including additional state in `equals`](#subclasses-including-additional-state-in-equals)
        -   [General remark](#general-remark)
        -   [The hard, but potentially more correct way](#the-hard-but-potentially-more-correct-way)
        -   [The easy way](#the-easy-way)
-   [In practice](#in-practice)
-   [Testing `equals` methods](#testing-equals-methods)
-   [Resources](#resources)

## Why override standard equals?

By default, every Java object has an `equals(Object o)` method which is inherited from the `Object` class. The implementation of this `equals` method compares objects using their memory locations, meaning that two objects are only considered equal if they actually point to the exact same memory location and are thus really one and the same object.

```java
@Test
public void test() {
    Object object1 = new Object();
    Object sameObject = object1;
    Object object2 = new Object();

    assertTrue(object1.equals(sameObject)); // this succeeds
    assertTrue(object1.equals(object2)); // this fails
}
```

If you want to define equality in such a way that two objects can be considered equal even if they are not really the exact same object in the exact same memory location, you will need a custom `equals` implementation.

## The requirements for a good `equals` method

-   Reflexivity: every object is equal to itself
-   Symmetry: if a is equal to b, then b is also equal to a
-   Transitivity: if a is equal to b and b is equal to c, then a is also equal to c
-   Consistency: if a is equal to b right now, then a is always equal to b as long as none of their state that is used in the `equals` method has been modified
-   Non-nullity: an actual object is never equal to `null`

## Example class

```java
public class Point {
    private int x;
    private int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // getters and setters for x and y here
}
```

## Naïve implementations

### Not properly overriding the `equals` method

```java
public boolean equals(Point other) {
    return (this.x == other.x && this.y == other.y);
}
```

```java
@Test
public void test() {
    Point point1 = new Point(1, 1);
    Point point2 = new Point(1, 1);
    List<Point> points = Arrays.asList(point1);
                
    assertTrue(point1.equals(point2)); // this succeeds
    assertTrue(points.contains(point2)); // this fails
}
```

Problem: `equals(Point) ` does not properly override `equals(Object)` because the signature doesn't match. 

```java
@Test
public void test() {
    Point point1 = new Point(1, 1);
    Object pointObject = new Point(1, 1);
                
    assertTrue(point1.equals(pointObject)); // this fails
    assertTrue(pointObject.equals(point1)); // also fails
}
```

-   In the first assertion, we are calling a method with signature `equals(Object)` on an object with compile-time type `Point`. As `Point` does not implement a method with that signature, the best match is the `equals(Object)` method inherited from `Object`.
-   In the second assertion, we are calling a method with signature `equals(Point)` on an object with compile-time type `Object`. As `Object` does not have an `equals(Point)` method, the best match at compile time is its `equals(Object)`method. And, because `Point` (the run-time type of `pointObject`) does not override that method, the actual implementation that gets called is still the one defined in `Object`.

See also [Overloading, overriding and method hiding](Overloading-overriding-method-hiding.md)

### Forgetting about `hashCode`

```java
@Override
public boolean equals(Object o) {
    if (o == null || o.getClass() != this.getClass()) {
        return false;
    }
    
    Point other = (Point) o;
    return (this.x == other.x && this.y == other.y);
}
```

```java
@Test
public void test() {        
    Point point1 = new Point(1, 1);
    Point point2 = new Point(1, 1);
    Set<Point> points = new HashSet<Point>();
    points.add(point1);
            
    assertTrue(points.contains(point2)); // this fails
}
```

Problem: `HashSet` uses `hashCode`, and default implementation is likely to return different hash codes for different objects (not same memory location)

### Mutable variables

```java
// getters and setter for x and y here

@Override
public boolean equals(Object o) {
    if (o == null || o.getClass() != this.getClass()) {
        return false;
    }
    
    Point other = (Point) o;
    return (this.x == other.x && this.y == other.y);
}

@Override
public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + x;
    result = prime * result + y;
    return result;
}
```

```java
@Test
public void test() {    
    Point point1 = new Point(1, 1);
    Set<Point> points = new HashSet<Point>();
    points.add(point1);
    
    point1.setX(2);
            
    assertTrue(points.contains(point1)); // this fails
}
```

Problem: changing `x` also changes the hash code, which means that the hash bucket where the set now looks for the point is different from the hash bucket where the point ended up based on its initial hash code.

## Simple decent implementation

```java
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // getters for x and y here
    
    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true; // optimization, this check is very fast
        }
        
        if (o == null || o.getClass() != this.getClass()) {
            return false;
        }
        
        Point other = (Point) o;
        return (this.x == other.x && this.y == other.y);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + x;
        result = prime * result + y;
        return result;
    }    
}
```

The `equals` and `hashCode` methods are pretty much what Eclipse generates by default

## Dealing with subclasses

### Allowing subclasses to be equal to superclasses

Problem with `equals` method using `getClass`: 

```java
@Test
public void test() {    
    Point point1 = new Point(1, 1);
    Point point2 = new Point(1, 1) {}; // anonymous subclass

    assertTrue(point1.equals(point2)); // this fails
}
```

Reason: `this.getClass()` returns different class for objects of different classes!

Solution: replace

```java
o.getClass() != this.getClass()
```

with

    !(o instanceof Point)

Most IDEs have option to do this when generating `equals`.

### Subclasses including additional state in `equals`

What if some subclasses of `Point` have additional info to consider when determining if objects are equal?

Example:

```java
public enum Color {
    BLUE, RED, YELLOW, GREEN;
}

public class ColorPoint extends Point {
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        super(x, y);
        this.color = color;
    }
    
    // getter for color
}
```

What if we want to include the color in the `equals` method so that a `ColorPoint(1, 1, Color.RED)` is not equal to a `ColorPoint(1, 1, Color.BLUE)`?

#### General remark

If we want this, we have to accept that a `ColorPoint` will never be equal to any `Point`. The reason for this is transitivity (see above). If we want to say that `ColorPoint(1, 1, Color.RED)` and `ColorPoint(1, 1, Color.BLUE)` are both equal to `Point(1, 1)` , then transitivity would imply that they are also equal to each other. That is exactly what we didn't want here.

This could be seen as a violation of the [Liskov substitution principle](../architecture-design/oo-design/SOLID-principles.md)

```java
@Test
public void test() {
    Point point1 = new Point(1, 1);
    Point point2 = new ColorPoint(1, 1, Color.BLUE);
            
    assertTrue(point1.getX() == point2.getX());
    assertTrue(point1.getY() == point2.getY());
    assertTrue(point1.equals(point2)); // this fails
}
```

#### The hard, but potentially more correct way

```java
public class Point {
    // ...
    
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point)) {
            return false;
        }
        
        Point other = (Point) o;
        
        if (!other.canEqual(this)) {
            return false;
        }
        
        return (this.x == other.x && this.y == other.y);
    }
    
    public boolean canEqual(Object o) {
        return (o instanceof Point);
    }    
    
    // ...
}

public class ColorPoint extends Point {
    // ...

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ColorPoint)) {
            return false;
        }
        
        ColorPoint other = (ColorPoint) o;
        
        if (!other.canEqual(this)) {
            return false;
        }
        
        return (this.color == other.color 
                && super.equals(other));
    }
    
    public boolean canEqual(Object o) {
        return (o instanceof ColorPoint);
    }
    
    // ...
}
```

Benefits:

-   passes all of the previous tests
-   still allows subclasses of `Point` that do not include additional state to be equal to a `Point`

#### The easy way

Simply use `getClass()` again!

Drawback: objects can only be equal if they are or exactly the same class

## In practice

Recommended approach:

1.  Let your IDE generate your `equals` (and `hashCode`) methods for you, using `instanceof` instead of `getClass()`.
2.  Either make your class `final` or make your `equals` and `hashCode` methods `final`.

Note that the two options outlined in step 2 have different effects:

-   Making your class `final` prevents any issues with subclasses by simply not allowing subclasses for your class.
-   Making your `equals` and `hashCode` methods `final` prevents subclasses from overriding your `equals` and `hashCode` methods and including additional state in them.

In cases where this is not sufficient (you want subclasses to include additional state in their `equals` method), consider using the solution involving the `canEqual` method or the simpler solution using `getClass` if you’re ok with subclass instances never being equal to superclass instances.

## Testing `equals` methods

Better alternative to hand-written `equals` tests: the [EqualsVerifier](http://jqno.nl/equalsverifier/) library by Jan Ouwens.

```java
@Test
public void equalsContract() {
    EqualsVerifier.forClass(Point.class).verify();
}
```

Uses reflection to inspect class and test its `equals` and `hashCode` methods with 100% coverage.

[Overview of detected errors](http://jqno.nl/equalsverifier/errormessages/). It is also possible to suppress certain errors.

## Resources

-   [EqualsVerifier](http://jqno.nl/equalsverifier/)
-   [How to Write an Equality Method in Java](http://www.artima.com/lejava/articles/equality.html)
-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
-   [Overloading in the Java Language Specification](https://docs.oracle.com/javase/specs/jls/se10/html/jls-8.html#jls-8.4.9)
