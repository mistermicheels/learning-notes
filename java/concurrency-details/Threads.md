---
tree_title: Threads
description: Some details regarding Java threads
last_modified: 2020-05-30T15:54:15+02:00
---

# Threads (Java)

## Contents

-   [Java threads basics](#java-threads-basics)
-   [Thread interruption](#thread-interruption)
-   [Daemon threads](#daemon-threads)
-   [Resources](#resources)

## Java threads basics

Starting a new thread manually:

```java
Runnable task = () -> {
    // ...
};

Thread thread = new Thread(task);
thread.start();
```

Note: typically, you are better off letting executors manage thread creation for you (see [Concurrency](../Concurrency.md)

Making the current thread sleep for a given amount of time:

```java
Thread.sleep(millis);
```

Blocking the current thread until another thread finishes:

    otherThread.join();

A thread finishes when its `Runnable` finishes execution, either normally or by throwing an exception. If an exception was thrown, it is passed to the _uncaught exception handler_ that was set for the thread.

## Thread interruption

In Java, the code running inside a thread is responsible for ensuring that it can be interrupted if needed. Each thread has a flag indicating if it is interrupted. Other threads can set this flag to true by calling the `interrupt()` method.

A `Runnable` can check the _interruption status_ of its thread and then respond accordingly. Typically, this means stopping the computations.

```java
Runnable task = () -> {
    while (moreWorkAvailable()) {
        if (Thread.currentThread().isInterrupted()) {
            return; // this ends the thread
        } else {
            // do some work
        }
    }
}
```

A thread might not be active at the time it is interrupted. If a thread is interrupted while inside a `wait()`, `join()` or `sleep()`, it is immediately reactivated and the interrupted method (for example the `wait()`) throws an `InterruptedException`. This is a checked exception, so you are forced to deal with it if you call `wait()`, `join()` or `sleep()`.  You could just put all of your `Runnable`'s code inside a try-catch catching `InterruptedException` and doing nothing in response (ending the thread).

If the thread was interrupted before a call to `wait()`, `join()` or `sleep()`, the call immediately throws an `InterruptedException`. This could mean you don't need to check for the interruption status yourself as long as you catch the `InterruptedException` when it is thrown.

When you are calling a method throwing `InterruptedException` at a point where you cannot do anything sensible with it, either let it propagate upwards (by declaring the exception on your method) or at least set the current thread's interruption status to true (`Thread.currentThread().interrupt()`).

## Daemon threads

You can mark a thread as a daemon thread, which indicates that the thread is just a helper for other threads and should not prevent the program from exiting. When all non-daemon threads finish, the program exits.

```java
Thread thread = new Thread(task);
thread.setDaemon(true);
thread.start();
```

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
