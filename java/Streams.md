---
tree_title: Streams
description: An overview of Java Streams and when/how to use them
last_modified: 2020-05-30T15:54:15+02:00
---

# Streams (Java)

## Contents

-   [Basic idea](#basic-idea)
-   [Creating streams](#creating-streams)
-   [Intermediate operations](#intermediate-operations)
-   [Terminal operations](#terminal-operations)
    -   [Simple reductions](#simple-reductions)
    -   [Transforming into arrays or collections](#transforming-into-arrays-or-collections)
    -   [Transforming into maps](#transforming-into-maps)
-   [Streams of primitive types](#streams-of-primitive-types)
-   [Parallel streams](#parallel-streams)
    -   [Avoid blocking operations in parallel streams](#avoid-blocking-operations-in-parallel-streams)
-   [Drawbacks of using streams](#drawbacks-of-using-streams)
-   [Resources](#resources)

## Basic idea

Streams are a way to specify operations on lists in a more declarative way.

Example: counting all of the words in a list that are longer than 3 characters.

The classic imperative way (_imperative_, focus on _how_ to do it):

```java
long numberLongWords = 0;

for (String word: words) {
    if (word.length() > 3) {
        numberLongWords++;
    }
}
```

The streams approach (more _declarative_, focus on _what_ to do without specifying exactly how):

```java
numberLongWords = words.stream()
        .filter(word -> word.length() > 3)
        .count();
```

Because we are specifying what to do rather than how to do it, it becomes easier to change the exact way that the calculation is performed. For example, if we simply use the `parallelStream()` method instead of the `stream()` method, the filtering and counting can now happen in parallel (using multiple threads).

Streams can seem similar to collections, but there are some important differences:

-   A stream does not necessarily store its elements. They can also be generated on demand. There are even situations when storing all of the elements would be impossible. An example of this are _infinite_ streams, which do not have a finite number of elements.
-   Operations on a stream don't change the stream itself. Instead, they generate a new altered stream.
-   Stream operations are **lazy** when possible. This means results are only calculated when needed. For example, if you have a stream expression that filters a list of words to only keep the long words and then takes the first five words, the filter will only be executed until the first five matching words are found. This also makes it possible to perform finite operations on infinite streams.

A stream expression is typically composed of three stages:

-   Creating the stream
-   _Intermediate operations_ that transform the stream into new streams
-   A _terminal operation_ that turns a stream into a non-stream result. Because this is the part that determines what result we need, this is also the part that determines exactly which lazy operations are executed. Without a terminal operation, nothing will happen!

## Creating streams

Obtaining a stream from a collection: see above.

Obtaining a stream from an array:

-   You can use the static `Stream.of()` method and pass the array to it. That method has a varargs parameter, so instead of an actual array you can also pass it a variable number of arguments that will make up the stream.
-   If you already have an array but want a stream representing only a part of it, you can use the method `Arrays.stream(array, from, to)` to get such a stream

```java
Stream.of("a", "b", "c");
Stream.ofNullable(nullableString); // 0 elements if nullableString == null, 1 otherwise

Arrays.stream(wordsArray, startIndex, endIndex);
```

Creating an empty stream: `Stream.empty()`

Creating infinite streams:

-   Use the `Stream.generate()` method, which takes a `Supplier<T>` that generates the actual values. Whenever a new value must be generated for the stream, that supplier function is used.
-   Use the `Stream.iterate()` method when the next value of a stream needs to depend on the previous value
    -   Since Java 9, there is also an overload for this method that takes 3 arguments instead of 2. The added argument (in the middle, not at the end) is a `Predicate` that specifies when the generation of new elements should finish. If the `Predicate` fails for a newly generated element, that element is not added to the stream and the generation of new elements is stopped.

```java
Stream.generate(() -> "constant"); // infinite constant stream
Stream.generate(Math::random); // infinite stream of random values
```

```java
Stream<Integer> powersOfTwo = 
        Stream.iterate(2, n -> n * 2);
```

```java
Stream<Integer> powersOfTwoSmallerThanFiveHundred = 
        Stream.iterate(2, n -> n < 500, n -> n * 2);
```

## Intermediate operations

Filter:

```java
words.stream().filter(word -> word.length() > 12);
```

Map:

```java
words.stream().map(String::toUpperCase);
```

Flatmap:

-   apply operation that turns every element into a stream
-   flatten resulting streams into a single stream

```java
words.stream().flatMap(word -> Stream.of(word.split("")));
```

Limit number of elements:

```java
infiniteStream.limit(100)
```

Skip a number of elements:

```java
words.stream().skip(1)
```

Take elements from stream while a certain condition is true (and stop then)

```java
Stream.of("a", "a", "b", "a").takeWhile(letter -> letter.equals("a")) // a, a
```

Drop elements while a certain condition is true (get stream of all elements starting from the first element for which the condition was true)

```java
Stream.of("a", "a", "b", "a").dropWhile(letter -> letter.equals("a")) // b, a
```

Concatenate streams (only makes sense if first one not infinite):

```java
Stream.concat(firstStream, secondStream);
```

Suppress duplicates:

```java
words.stream().distinct();
```

Sorting:

```java
words.stream().sorted(Comparator.comparing(String::length));
```

Invoke a function every time an element is retrieved:

```java
Stream.iterate(2, n -> n * 2)
        .peek(System.out::println) // executed every time an element is generated
        .limit(20)
        .toArray(); // terminal operation to make sure elements are actually retrieved
```

The `peek` function from the above example is also useful for using a debugger on a stream:

```java
Stream.iterate(2, n -> n * 2).peek(x -> {
    System.out.println(x); // set breakpoint on this line
}).limit(20).toArray();
```

## Terminal operations

Streams are lazy -> without terminal operations, nothing happens at all!

### Simple reductions

Count number of elements:

```java
words.stream().filter(word -> word.length() > 12).count();
```

Get min or max:

```java
words.stream().max(String::compareToIgnoreCase); // returns Optional<String>
```

Find first element:

```java
words.stream()
        .filter(word -> word.length() > 12)
        .findFirst(); // returns Optional<String>
```

Find any element (useful with parallel streams):

```java
words.stream()
        .filter(word -> word.length() > 12)
        .findAny(); // returns Optional<String>
```

Check if something matches

```java
words.stream().anyMatch(word -> word.length() > 12) // returns boolean
```

Execute a function for each element:

```java
words.stream().forEach(System.out::println); // not guaranteed to preserve order
words.stream().forEachOrdered(System.out::println) // guaranteed to preserve order
```

Reduce to a sum, count, average, maximum or minimum value:

```java
IntSummaryStatistics summary =     
        words.stream().collect(Collectors.summarizingInt(String::length));
        
int max = summary.getMax();
double average = summary.getAverage();
```

Concatenate stream of strings:

```java
words.stream().collect(Collectors.joining(", "))
```

### Transforming into arrays or collections

Array:

```java
// to get an array of the correct type (not Object), we need to pass a constructor
String[] result = words.stream().toArray(String[]::new);
```

List:

```java
words.stream().collect(Collectors.toList());
```

Set:

```java
words.stream().collect(Collectors.toSet());
```

Specific kind of collection by passing constructor:

```java
words.stream().collect(Collectors.toCollection(TreeSet::new));
```

### Transforming into maps

```java
words.stream().collect(
        Collectors.toMap(String::length, String::toLowerCase)):    

words.stream().collect(
        Collectors.toMap(String::length, Function.identity())): // element is value
```

Note: the above statements will throw if there is more than one element with the same key!

Fix: provide third function that resolves the conflict and determines the value for the key given the existing and new value

```java
words.stream().collect(
        Collectors.toMap(
                String::length, 
                Function.identity(), 
                (existingValue, newValue) -> existingValue));
```

Specific kind of map -> pass as fourth argument

Transforming into map of lists:

```java
words.stream().collect(
        Collectors.groupingBy(String::length));
```

If classifier function you want to pass to groupingBy is a predicate, partitioningBy is more efficient:

```java
// Map<Boolean, List<String>>
words.stream().collect(
        Collectors.partitioningBy(word -> word.startsWith("t"))); 
```

Transforming into map of sets:

```java
words.stream().collect(
        Collectors.groupingBy(String::length, Collectors.toSet()));
```

## Streams of primitive types

When working with primitive values, it is more efficient to work directly with those primitive values instead of using their boxed versions. There are specialized types `IntStream`, `DoubleStream`, ... that work directly with primitive types, without using wrappers.

```java
IntStream stream = IntStream.of(1, 1, 2, 3, 5);
IntStream stream = IntStream.range(0, 100); // upper bound excluded
IntStream stream = IntStream.rangeClosed(0, 100); // upper bound included
    
IntStream stream = words.stream.mapToInt(String::length);
```

Additional functionality present in `IntStream`, `DoubleStream`, ...: simple min, max, sum, .. methods

```java
System.out.println(IntStream.rangeClosed(1, 100).sum());
```

Converting a primitive type stream to an object stream:

```java
Stream<Integer> stream = intStream.boxed();
```

## Parallel streams

Getting a parallel stream:

```java
collection.parallelStream()
existingStream.parallel()
```

Note: if the stream is in parallel mode when the terminal method executes, all intermediate stream operations will also be parallelized!

Note: there is quite some overhead in parallelization, so don't blindly make all of your streams parallel! Parallel streams only make sense for huge in-memory collections of data and computationally expensive processing where different parts of the stream can be processed separately

Getting an idea of the threads involved:

```java
.peek(string -> System.out.println(Thread.currentThread().getName()))
```

Important: operations to execute in parallel should be stateless and should be able to be executed in arbitrary order!

```java
// bad code (likely to get different - wrong - results each time)
int[] shortWordCounts = new int[12]

words.parallelStream().forEach(word -> {
    if (word.length < 12) {
        shortWords[word.length()]++; // race condition!
    }
})

// better alternative
Map<Integer, Long> shortWordCounts = 
        words.parallelStream()
                .filter(word -> word.length < 12)
                .collect(Collectors.groupingBy(
                        String::length,
                        Collectors.counting()));
```

Some operations on parallel streams can be made more efficient by making it clear that you do not care about ordering!

-   Example: distinct()
    -   If you just want distinct elements, but not necessarily in the order in which they first appeared in the original stream, the stream processing can happen in different segments and uniqueness can be tracked using a shared set of duplicates
-   Example: limit()
    -   If you just want x element, not the first x elements, elements can more easily be processed in parallel

Note: by default, streams from ordered collections (arrays and lists), ranges, generators, iterators or from `Stream.sorted` are ordered!

Making a stream unordered: simply call `Stream.unordered`

### Avoid blocking operations in parallel streams

When using parallel streams, avoid blocking operations!

Parallel streams use the common fork-join pool (`ForkJoinPool.commoPool()`). The number of threads in this common pool is determined by the number of cores available and is equal to (#cores - 1). If you use blocking (or in general-long-running) operations in your parallel streams, these will affect **all** other parallel streams (and any other code that is using the common fork-join pool). It's not that hard to actually block all threads in the common fork-join pool, meaning that no other parallel streams can get any work done until those threads aren't blocked anymore.

Example illustrating this:

```java
public static void main(String[] args) throws InterruptedException {     
    System.out.println("CommonPool Parallelism: " + ForkJoinPool.commonPool().getParallelism());
    ExecutorService es = Executors.newCachedThreadPool();  
    es.execute(() -> blockingStreamTask());   
    es.execute(() -> blockingStreamTask());  
    es.execute(() -> normalStreamTask());  
    es.execute(() -> normalStreamTask());   
    es.execute(() -> normalStreamTask());   
 }

private static void normalStreamTask() {
    IntStream.range(1, Integer.MAX_VALUE).parallel().filter(i -> i % 2 == 0).count();
    System.out.println("Finished normal stream task");
}

private static void blockingStreamTask() {
    IntStream.range(1, Integer.MAX_VALUE).parallel().filter(i -> {
        try {
            Thread.sleep(Integer.MAX_VALUE);
        } catch (InterruptedException e) {}
        
        return i % 2 == 0;
    }).count();
    
    System.out.println("Finished blocking stream task");
}
```

The result of executing the above code might be different every time you execute it, but you will likely see that one or more normal stream tasks are blocked by the blocking stream tasks. Once all threads in the common fork-join pool are executing the `Thread.sleep(Integer.MAX_VALUE);` statement, no other work can be processed by the common fork-join pool until the threads stop sleeping.

See also [Concurrency](./Concurrency.md)

## Drawbacks of using streams

-   Performance: 
    -   Using streams implies some overhead, so they are likely slower than hand-written loops etc.
    -   Note: For huge in-memory collections of data, parallel streams could actually be an easy way to speed up computations. There will still be some overhead compared to the ideal hand-written parallel code, but using parallel streams could be easier and way less error-prone.
-   Readability (subjective)
    -   From a certain level of complexity, code using streams starts to get harder to read (see below)
    -   Also depends on how familiar the team is with streams
-   Stack traces
    -   Errors happening inside streams lead to more complex stack traces than errors in simple loops

Example:

```java
List<Integer> list = Arrays.asList(1, 2, 3);

// simple nested loop
for (Integer i : list) {
    for (int j = 0; j < i; j++) {
        System.out.println(i / j);
    }
}

/*
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at misc.Main.main(Main.java:15)
*/

// streams
list.forEach(i -> {
    IntStream.range(0, i).forEach(j -> {
        System.out.println(i / j);
    });
});

/*
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at misc.Main.lambda$1(Main.java:22)
    at java.base/java.util.stream.Streams$RangeIntSpliterator.forEachRemaining(Streams.java:104)
    at java.base/java.util.stream.IntPipeline$Head.forEach(IntPipeline.java:593)
    at misc.Main.lambda$0(Main.java:21)
    at java.base/java.util.Arrays$ArrayList.forEach(Arrays.java:4390)
    at misc.Main.main(Main.java:20)
*/
```

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
-   [Be Aware of ForkJoinPool#commonPool()](https://dzone.com/articles/be-aware-of-forkjoinpoolcommonpool)
-   [Think Twice Before Using Java 8 Parallel Streams](https://dzone.com/articles/think-twice-using-java-8)
-   [3 Reasons why You Shouldn’t Replace Your for-loops by Stream.forEach()](https://blog.jooq.org/2015/12/08/3-reasons-why-you-shouldnt-replace-your-for-loops-by-stream-foreach/)
