---
tree_title: Locking
description: Some details regarding locking as a low-level concurrency tool in Java
last_modified: 2020-05-31T14:45:09+02:00
---

# Locking (Java)

## Contents

-   [A word of caution](#a-word-of-caution)
-   [Locks](#locks)
-   [The `synchronized` keyword](#the-synchronized-keyword)
-   [Using locks to coordinate between threads](#using-locks-to-coordinate-between-threads)
-   [Resources](#resources)

## A word of caution

Note: locking is a low-level concurrency tool typically used by system programmers writing things like web servers or middleware. When writing normal applications, it's probably easier and safer to use higher-level concurrency tools (see [Concurrency](../Concurrency.md) and the thread-safe date structures in [Thread safety](./Thread-safety.md)).

## Locks

Locks can be used to implement _critical sections_, parts of the code that can only be executed entirely, without being interrupted, by only one single thread at a time

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

The above example is simple, but implementing locking yourself can get tricky. You might have inadequate locking, you might have deadlocks, ... Therefore, it is recommended to use the other tools listed in [Concurrency](../Concurrency.md) when possible.

## The `synchronized` keyword

The code above used an explicit lock object. This isn't strictly necessary, because every object also has an _intrinsic lock_.  This lock can be used using the `synchronized` keyword.

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

Note: locks also guarantee visibility. More specifically, changes that happen before releasing a lock are visible to anyone acquiring the same lock afterwards. For more about visibility, see [Thread safety](./Thread-safety.md).

## Using locks to coordinate between threads

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

-   The call to `wait()` should happen inside a while loop checking for the condition. This is a best practice and it prevents issues if more than one thread was waiting inside the `take()` method or a method other than `add()` calls `notifyAll()`
-   There is also a method `notify()` that only unblocks one waiting thread. This might be more efficient, but it can lead to issues it the waiting thread that is unblocked finds that it still wants to wait. In that case, that thread is just blocked again, while there might also be other blocked threads that can actually continue at this point. Typically, it's a better idea to just call `notifyAll()`.

## Resources

-   Core Java SE 9 for the Impatient (book by Cay S. Horstmann)
