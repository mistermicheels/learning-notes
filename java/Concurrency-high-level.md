# Concurrency (high-level)

See:

- Core Java SE 9 for the Impatient (book by Cay S. Horstmann)

## High-level concurrency

This page describes some high-level tools that Java offers to parallelize computations. Using these tools is typically the way to go when writing applications, as they are easier and safer to use than lower-level constructs.

## Concurrent execution basics

Runnable: describes a task that can be executed but does not return a result

```java
// defined by the JDK
public interface Runnable {
    void run();
}
```

Note that the `run()` method cannot throw any checked exceptions! See also [Exceptions](./Exceptions.md).

Running a task:

- Can of course be run on the current thread by just invoking `run()`
- Can be run inside a dedicated thread (see [Low-level concurrency](./Concurrency-low-level.md))
  - Note: This one-to-one relationship between threads and tasks is not recommended!
    - You might want to reuse the same thread for several tasks
    - If you have a large number of computationally-intensive tasks, just immediately executing all of them in their own thread will lead to a loss of performance due to overhead from switching between threads
- Can be run using an *executor service*
  - Executor service takes care of scheduling tasks on one or multiple threads
  - Recommended approach: separates task definition and task scheduling

Cached thread pool: executor service that uses an existing idle thread if possible and creates a new thread otherwise (and cleans up unused idle threads after a while

```java
Runnable runnable = () -> {};      
ExecutorService executor = Executors.newCachedThreadPool();
executor.execute(runnable);
```

Fixed thread pool: executor service that uses a fixed number of threads

- Can use this to limit resource consumption
- Runnables are queued until a thread becomes available

```java
Runnable runnable = () -> {};      
int processors = Runtime.getRuntime().availableProcessors();
ExecutorService executor = Executors.newFixedThreadPool(processors);
executor.execute(runnable);
```

## Synchronous tasks

Callable: describes a task that returns a result

```java
// defined by the JDK
public interface Callable<V> {
    V call() throws Exception;
}
```

Note that the `call()` method can throw any kind of exception!

Submitting a `Callable` yields a `Future` which can be used to get the result:

```java
Callable<String> callable = () -> { return "test"; };
ExecutorService executor = Executors.newCachedThreadPool();
Future<String> resultFuture = executor.submit(callable);

// get() blocks current thread until result is available
// if task throws, it throws ExecutionException wrapping the exception from the task
String result = resultFuture.get(); 
System.out.println(result);
```

A `Future` also has a method `cancel(mayInterruptIfRunning`) which attempts to cancel the task:

- If task is not running yet, it won't be scheduled
- If the task is running and `mayInterruptIfRunning` is true, the thread running the task is interrupted
  - Thread interruption: see [Low-level concurrency](./Concurrency-low-level.md)

Invoking several tasks and waiting for all results:

```java
// blocks current thread until all tasks have completed
List<Future<String>> results = executor.invokeAll(tasks);
```

Invoking several tasks, waiting until the first one succeeds and canceling the rest:

```java
String result = executor.invokeAny(tasks);
```

Invoking several tasks and getting the completed ones immediately:

```java
ExecutorCompletionService<String> completionService =
    new ExecutorCompletionService<>(executor);
      
for (Callable<String> task: tasks) {
    completionService.submit(task);
}

for (int i = 0; i < tasks.size(); i++) {
    // blocks until a new result is available
    String currentResult = completionService.take().get();
}
```

## Asynchronous concurrency

In the section on synchronous concurrency, the current thread would always wait for at least some of the concurrent work to complete. With asynchronous concurrency, this is not the case. Instead of waiting for a result, the current thread continues its work. However, you specify a callback that should be executed once the task has completed.

### Completable futures

```java
CompletableFuture<String> f = CompletableFuture.supplyAsync(() -> {
    return "test";
}, executor);
```

Specifying a callback for the result:

```java
f.thenAccept(result -> { System.out.println(result); });
```

Specifying a callback that can also handle exceptions:

```java
f.whenComplete((result, exception) -> {
    if (exception == null) {
        // process result
    } else {
        // process exception
    }
});
```

It is also possible to complete a `CompletableFuture` manually:

```java
CompletableFuture<String> f = new CompletableFuture<>();

executor.execute(() -> {
    String result = calculatingSupplier.get();
    f.complete(result);
});

executor.execute(() -> {
    while (!f.isDone()) {
        // try something crazy and call f.complete() if it works
    }
});
```

Note: if you call `cancel()` on a `CompletableFuture`, it will only make it complete with a `CancellationException`

Transforming `CompletableFuture` instances:

```java
CompletableFuture f2 = f.thenApply(result -> result.toLowerCase());

// similar to concept of flatMap
CompletableFuture f3 = f.thenCompose(functionReturningNewCompletableFuture);
```

Combining `CompletableFuture` instances:

```java
f.thenCombine(f2, (resultFromFirst, resultFromSecond) -> {
    // return something based on both values
});

CompletableFuture<Void> waitForAll = CompletableFuture.allOf(f, f2);
```

### User Interface callbacks

In Java programs with a UI, you can't perform heavy computations in the UI thread or the UI will freeze. Instead, you should perform the computations in one or more separate threads and then notify the UI thread of the result.

Problem: UIs are typically not thread-safe (see below), so manipulating UI elements from other threads than the UI thread might corrupt the UI

Solution: schedule UI updates to happen on the UI thread

Example for JavaFX:

```java
Platform.runLater(() -> {
    // make some changes on the UI elements
})
```

## Parallel algorithms

For some computations, you can use even higher-level mechanisms than the ones above in order to speed them up using parallelization

### Parallel streams

See [Streams](./Streams.md)

### Parallel Array operations

```java
Arrays.parallelSetAll(theArray, i -> i % 10);
Arrays.parallelSort(theArray);
```

## Thread safety

Even if you don't use low-level concurrency mechanisms, you still need to be careful about concurrency issues!

The issues below can for example still arise when using parallel streams, if lambdas passed to `filter()` or `map()` use shared data

### Concurrency issue: visibility

Basic idea: updates to a variable might not be visible across different threads!

Example:

```java
private static boolean done = false;

public static void main(String[] args) {
    ExecutorService executor = Executors.newCachedThreadPool();
    
    executor.execute(() -> {
        for (int i = 0; i < 1000; i++) {
            System.out.println("Hello " + i);
        }
        
        done = true;
    });                
    
    executor.execute(() -> {
        int i = 0;
        
        while (!done) {
            i++;
        }
        
        System.out.println("Goodbye " + i);
    });
}
```

Result you might expect: first all "Hello" messages, then a "Goodbye" message with a high number

Result you are likely to get: all "Hello" messages, and then the program never prints "Goodbye" but also never completes

Problem: the effect of `done = true;` in the thread printing the "Hello" messages might not be *visible* to the to thread that needs to print the "Goodbye" message

Cause: optimizations performed by compilers, the JVM and processors

- Processor tries to cache values from RAM in much faster processor cache
- The order of instructions might be changed in an attempt to improve performance
  - As the inner part of the `while` loop in the code above doesn't change `done`, this code might be changed to `if (!done) while (true) i++;`
- These optimizations assume that there is no concurrent memory access

Ways to ensure that an update to a variable is visible:

- The value of a `final` variable is visible after initialization
  - Good practice: make variables final if possible
- The initial value of a static variable is visible after static initialization
  - Static initialization: code running in a `static {}` block
- Changes to a `volatile` variables are visible
- Changes that happen before releasing a lock are visible to anyone acquiring the same lock afterwards (see [Low-level concurrency](./Concurrency-low-level.md))

In the example above, marking the variable `done` as volatile fixes the problem

### Concurrency issue: race conditions

A race condition is a situation where multiple threads are each attempting to perform an operation and the interaction between the threads yields an incorrect result that is different from the result that we would get if we just applied each thread's operation sequentially

Example race condition:

```java
private static volatile int count = 0;

public static void main(String[] args) {
    ExecutorService executor = Executors.newCachedThreadPool();
    
    for (int i = 0; i < 100; i++) {
        int taskId = i;
        
        executor.execute(() -> {
            for (int j = 0; j < 1000; j++) {
                count++;
            }
            
            System.out.println(taskId + " " + count);
        });
        
    }
}
```

Result you might expect: task 999 printing the number 100000

Result you are likely to get: task 999 printing a number lower than 100000, and a different one every time you run the program

Problem: `count++` is not an atomic operation! It is actually equivalent to the following:

```java
temp = count + 1;
// at this point, another thread might take over and compute and/or set the new count
count = temp; // if something happened in between, this likely sets an incorrect value
```

Counters are definitely not the only problem. Race conditions can lead to issues whenever variables shared between threads are mutated. In fact, a lot of Java data structures (for example `ArrayList` and `HashSet`) are not thread-safe and can become corrupted if they are accessed from multiple threads.

### Strategies for safe concurrency

- *Confinement*
  - Don't share any data between threads
  - Data from different threads can be combined after they have finished their computations
- *Immutability*
  - Immutable objects are safe to share
    - Of course, overwriting a shared variable holding an immutable object can still lead to issues! (see also the concurrency issue above, taking into account that an integer value is somewhat equivalent to an immutable object)
  - Examples of immutable classes: `String` and the classes from the [Date and Time API](./Date-Time-API.md)
  - Example: it's safe share a single `LocalDate` object among multiple threads, because all operations on the object (like adding a year to it) do not change the object itself but return a new object instead
  - Tips for implementing your own immutable classes
    - Make all instances variables `final` (this also helps with visibility, see above)
    - Don't leak any state that could be mutated externally (example: don't return a reference to an internal array or collection from any of your methods). Return a copy instead.
    - Don't store a reference to a mutable object received in the constructor. Make a copy of the object instead.
    - Don't let the `this` reference escape the constructor (or someone could observe the object in an incomplete state)
- *Thread-safe data structures*
  - Some data structures are intended to be used concurrently by multiple threads (see below)
- *Locking*
  - Low-level concurrency mechanism
  - Can be used to ensure that a sequence of operations is carried out without being interrupted
    - This is called a *critical section*
  - Is used internally by thread-safe classes to control concurrency
  - Very hard to get right, so avoid implementing manually when possible
    - Locks can become bottlenecks or even lead to deadlocks
    - Inadequate locking might still allow concurrency issues to occur
  - For more details, see [Low-level concurrency](./Concurrency-low-level.md)

## Thread-safe data structures

Collections in `java.util.concurrent` are thread-safe and efficient: multiple threads can access them concurrently without corrupting them and the threads won't even block each other if they access different parts

Example: `ConcurrentHashMap`

```java
ConcurrentHashMap<String, Long> map = new ConcurrentHashMap<>();

// thread-safe methods
map.putIfAbsent("key", 1L);
map.compute("key", (key, value) -> value == null ? 1 : value + 1);

// don't do this, this is not thread-safe
Long oldValue = map.get("key");
Long newValue = oldValue == null ? 1 : oldValue + 1);
map.put("key", newValue);
```

Note: you can get a concurrent `Set` (that is internally backed by a `ConcurrentHashMap`) using `ConcurrentHashMap.newKeySet()`

Useful for coordinating work between tasks: blocking queues

- Examples: `LinkedBlockingQueue` and `ArrayBlockingQueue`
- Producer tasks add elements into the queue, consumer tasks retrieve them
- The queue blocks when trying to add an element through `put()` if the queue is currently full
  - this makes producer tasks block if they get too far ahead of the consumers
- The queue blocks when trying to retrieve an element through `take()`if the queue is empty
  - this makes consumer tasks block until the producers catch up
- In addition to the blocking methods
  - Methods that throw on queue full/empty: `add()`, `remove()`, `element()`
  - Methods that return null false on queue full/empty: `offer()`, `poll()`, `peak()`
- Challenge: stopping the consumers
  - An empty queue doesn't necessarily mean that the work is over, it might just mean the producers need to catch up
  - If there is a singe producer, it can help to add a "last item" indicator after the last real item in the queue

Copy-on-write collections: `CopyOnWriteArrayList` and `CopyOnWriteArraySet`

- All mutators make a copy of the underlying array
- Useful if there are a lot more threads reading the collection than threads mutating it
- If the collection is mutated after creation of an iterator, the iterator still refers to the old array
  - Iterator has a consistent view, but it might be outdated

## Atomic counters and accumulators

Package `java.util.concurrent.atomic` has some useful classes that provide a thread-safe way to create counters and accumulators

Example:

```java
AtomicLong nextId = new AtomicLong();
        
// in some thread
long id = nextId.incrementAndGet(); // gets value, adds 1, sets it and returns it
```

The `incrementAndGet()` method is atomic, which means that it executes all of its operations before another thread is able to access the `AtomicLong`. This means that multiple threads can safely access the same `AtomicLong` instance concurrently.

```java
AtomicLong largest = new AtomicLong();

// thread-safe
largest.updateAndGet(x -> Math.max(x, observed));

// not thread-safe
largest.set(Math.max(largest.get(), observed));
```

Drawback: updates are performed *optimistically*

- The operation first computes the new value, then checks if the old value is still the same, and retries if it's not
- This might not work well with a large number of threads all trying to make updates, as there will be a lot of retries required

Better alternative when lots of threads will be updating at the same time: `LongAdder`

- Keeps multiple variables, the sum of all those variables makes up the current value
- This is efficient in the common situation where we only need the sum after all the work has been done

```java
LongAdder count = new LongAdder();
        
// in some thread
count.increment();
```

## Thread-local variables

Sometimes, you might want multiple threads to have access to an instance of a certain non-tread-safe class, but you don't need every thread to use the exact same instance. In this case, you can avoid sharing between the threads by giving every thread its own specific instance of the class.

Example: letting multiple threads "share" a `NumberFormat`

```java
private static final ThreadLocal<NumberFormat> currencyFormat = ThreadLocal
        .withInitial(() -> NumberFormat.getCurrencyInstance());

// inside some thread
String amountString = currencyFormat.get().format(total)
```

The first time a thread calls the `get()` method, an instance is created based on the lambda expression supplied to `withInitial()`. From then on, that same instance will always be returned whenever that specific thread calls `get()`.