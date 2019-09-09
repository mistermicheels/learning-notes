# Concurrency (low-level)

See:

- Core Java SE 9 for the Impatient (book by Cay S. Horstmann)

## Low-level concurrency

This page describes some low-level tools that Java offers to parallelize computations. These are typically used by system programmers writing things like web servers or middleware. When writing normal applications, it's probably easier and safer to use [high-level concurrency tools](./Concurrency-high-level).

## Locking

### Locks

Locks can be used to implement *critical sections*, parts of the code that can only be executed entirely, without being interrupted, by only one single thread at a time

Example of critical section using lock:

```java
Lock countLock = new ReentrantLock(); // explicit lock, shared among threads
int count = 0; // shared among threads

// some thread
{
    countLock.lock(); // blocks if some other thread holds the lock
    
    try {
        // do something complex
        count++;
    } finally {
        countLock.unlock(); // allows another thread to acquire the lock
    }
}
```

It is important to release the lock in the `finally` clause, so it is always released at the end of the operation even if an exception occurred

The above example is simple, but implementing locking yourself can get tricky. You might have inadequate locking, you might have deadlocks, ... Therefore, it is recommended to use [high-level concurrency tools](./Concurrency-high-level) when possible.

### The `synchronized` keyword

The code above used an explicit lock object. This isn't strictly necessary, because every object also has an *intrinsic lock*.  This lock can be used using the `synchronized` keyword.

```java
// this ...
synchronized(obj) {
    // critical section
}

// ... is equivalent to this
obj.intrinsicLock.lock(); // note: there is not really a field named intrinsicLock

try {
    // critical section
} finally {
    obj.intrinsicLock.unlock();
}
```

You can also declare a method as `synchronized`

```java
// this ...
public synchronized void theMethod() {
    // body
}

// ... is equivalent to this
public void theMethod() {
    this.intrinsicLock.lock();

    try {
        // body
    } finally {
        this.intrinsicLock.unlock();
    }
}
```

A pattern using intrinsic locks that you might see is that an object with `synchronized` methods is used inside a `synchronized` block locking on that object:

```java
synchronized (theObject) { 
    theObject.synchronizedMethod();
    theObject.otherSynchronizedMethod();
}
```

Note: locks also guarantee visibility. More specifically, changes that happen before releasing a lock are visible to anyone acquiring the same lock afterwards. For more about visibility, see [high-level concurrency tools](./Concurrency-high-level).

### Using locks to coordinate between threads

Suppose we have a simple `Queue` class with synchronized methods:

```java
public class Queue {
    public synchronized void add(Object element) {
        // add element at the end
    }
    
    public synchronized Object remove() {
        // return and remove element at head, or return null if the queue is empty
    }
    
    pubic synchronized boolean isEmpty() {
        // returns true if and only if the queue is empty
    }
}
```

Now, we want to replace the `remove()` method by a method `take()` that blocks until an element is available. This means that, if the queue is empty, the `take()` method needs to stop executing, allow other threads to obtain the lock (otherwise, no elements can be added) and then continue when an element is available. This can be implemented using `wait()` and `notifyAll()`.

```java
public synchronized Object take() {
    while(this.isEmpty()) {
        wait(); // thread gives up the lock and will not run again until it is notified
    }
    
    // return and remove element at head
}

public synchronized void add(Object element) {
    // add element at the end
    notifyAll(); // notifies all waiting threads on the intrinsic lock
}
```

Some important remarks:

- The call to `wait()` should happen inside a while loop checking for the condition. This is a best practice and it prevents issues if more than one thread was waiting inside the `take()` method or a method other than `add()` calls `notifyAll()`
- There is also a method `notify()` that only unblocks one waiting thread. This might be more efficient, but it can lead to issues it the waiting thread that is unblocked finds that it still wants to wait. In that case, that thread is just blocked again, while there might also be other blocked threads that can actually continue at this point. Typically, it's a better idea to just call `notifyAll()`.

## Threads

### Java threads basics

Starting a new thread manually:

```java
Runnable task = () -> {
    // ...
};

Thread thread = new Thread(task);
thread.start();
```

Note: typically, you are better off letting executors manage thread creation for you (see [high-level concurrency tools](./Concurrency-high-level))

Making the current thread sleep for a given amount of time:

```java
Thread.sleep(millis);
```

Blocking the current thread until another thread finishes:

```
otherThread.join();
```

A thread finishes when its `Runnable` finishes execution, either normally or by throwing an exception. If an exception was thrown, it is passed to the *uncaught exception handler* that was set for the thread.

### Thread interruption

In Java, the code running inside a thread is responsible for ensuring that it can be interrupted if needed. Each thread has a flag indicating if it is interrupted. Other threads can set this flag to true by calling the `interrupt()` method.

A `Runnable` can check the *interruption status* of its thread and then respond accordingly. Typically, this means stopping the computations.

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

### Daemon threads

You can mark a thread as a daemon thread, which indicates that the thread is just a helper for other threads and should not prevent the program from exiting. When all non-daemon threads finish, the program exits.

```java
Thread thread = new Thread(task);
thread.setDaemon(true);
thread.start();
```

