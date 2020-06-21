---
tree_title: Concurrency
description: An overview of concurrent programming in Java
last_modified: 2020-05-30T15:54:15+02:00
---

# Concurrency (Java)

## Contents

-   [Concurrent execution basics](#concurrent-execution-basics)
-   [Synchronous tasks](#synchronous-tasks)
-   [Asynchronous concurrency](#asynchronous-concurrency)
    -   [Completable futures](#completable-futures)
    -   [User Interface callbacks](#user-interface-callbacks)
-   [Parallel algorithms](#parallel-algorithms)
    -   [Parallel streams](#parallel-streams)
    -   [Parallel Array operations](#parallel-array-operations)
-   [Be careful with blocking operations](#be-careful-with-blocking-operations)
-   [Thread safety](#thread-safety)
-   [Threads](#threads)
-   [Locking](#locking)
-   [Resources](#resources)

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

-   Can of course be run on the current thread by just invoking `run()`
-   Can be run inside a dedicated thread (see [Threads](./concurrency-details/Threads.md))
    -   Note: This one-to-one relationship between threads and tasks is not recommended!
        -   You might want to reuse the same thread for several tasks
        -   If you have a large number of computationally-intensive tasks, just immediately executing all of them in their own thread will lead to a loss of performance due to overhead from switching between threads
-   Can be run using an _executor service_
    -   Executor service takes care of scheduling tasks on one or multiple threads
    -   Recommended approach: separates task definition and task scheduling

Cached thread pool: executor service that uses an existing idle thread if possible and creates a new thread otherwise (and cleans up unused idle threads after a while

```java
Runnable runnable = () -> {};      
ExecutorService executor = Executors.newCachedThreadPool();
executor.execute(runnable);
```

Fixed thread pool: executor service that uses a fixed number of threads

-   Can use this to limit resource consumption
-   Runnables are queued until a thread becomes available

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

-   If task is not running yet, it won't be scheduled
-   If the task is running and `mayInterruptIfRunning` is true, the thread running the task is interrupted
    -   Thread interruption: see [Threads](./concurrency-details/Threads.md)

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

## Be careful with blocking operations

If you are using a thread pool with a limited or fixed number of threads, be very careful with blocking operations. Once all of the treads in the pool are executing a blocking or long-running operation, the pool will not be able to do any other kind of work until at least one of those blocking operations finishes.

Example:

```java
public static void main(String[] args) throws InterruptedException {
    ExecutorService es = Executors.newFixedThreadPool(2);
    es.execute(() -> blockingTask());
    es.execute(() -> blockingTask());
    es.execute(() -> normalTask());
    es.execute(() -> normalTask());
    es.execute(() -> normalTask());
}

private static void normalTask() {
    System.out.println("Starting normal task");
    System.out.println("Finished normal task");
}

private static void blockingTask() {
    System.out.println("Starting blocking task");
    
    try {
        Thread.sleep(Integer.MAX_VALUE);
    } catch (InterruptedException e) {
    }

    System.out.println("Finished blocking task");
}
```

Important note: the common fork-join pool (`ForkJoinPool.commonPool()`) is a pool with a fixed number of threads which is used under the hood by parallel streams and by default also by completable futures!

See below example for completable futures and see [Streams](./Streams.md) for an example with parallel streams

```java
public static void main(String[] args) throws InterruptedException {
    int commonPoolParallelism = ForkJoinPool.commonPool().getParallelism();

    for (int i = 0; i < commonPoolParallelism; i++) {
        CompletableFuture.supplyAsync(() -> blockingTask()).thenAccept(result -> {
            System.out.println(result);
        });
    }

    for (int i = 0; i < 10; i++) {
        CompletableFuture.supplyAsync(() -> normalTask()).thenAccept(result -> {
            System.out.println(result);
        });
    }
    
    Thread.sleep(Integer.MAX_VALUE);
}

private static String normalTask() {
    System.out.println("Starting normal task");
    System.out.println("Finished normal task");
    return "normal";
}

private static String blockingTask() {
    System.out.println("Starting blocking task");

    try {
        Thread.sleep(Integer.MAX_VALUE);
    } catch (InterruptedException e) {
    }

    System.out.println("Finished blocking task");
    return "blocking";
}
```

## Thread safety

See [Thread safety](./concurrency-details/Thread-safety.md)

## Threads

See [Threads](./concurrency-details/Threads.md)

## Locking

See [Locking](./concurrency-details/Locking.md)

Note that locking is a low-level concurrency tool and that code using locks is hard to get right! You are likely better off using other tools.

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
-   [Be Aware of ForkJoinPool#commonPool()](https://dzone.com/articles/be-aware-of-forkjoinpoolcommonpool)
