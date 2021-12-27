---
tree_title: Event loop
description: A high-level overview of how JavaScript handles concurrency using its Event Loop
last_modified: 2021-12-27T16:49:37.804Z
---

# Event loop (JavaScript)

## Contents

-   [JavaScript and concurrency](#javascript-and-concurrency)
    -   [Single-threaded](#single-threaded)
    -   [Non-preemptive (run-to-completion)](#non-preemptive-run-to-completion)
-   [The Event Loop](#the-event-loop)
    -   [Example execution](#example-execution)
-   [Don't block the Event Loop](#dont-block-the-event-loop)
    -   [Recommendation: asynchronous where possible](#recommendation-asynchronous-where-possible)
    -   [Recommendation: watch out with JSON and regexes](#recommendation-watch-out-with-json-and-regexes)
    -   [Recommendation: task partitioning](#recommendation-task-partitioning)
    -   [Recommendation: offloading](#recommendation-offloading)
-   [Resources](#resources)

## JavaScript and concurrency

### Single-threaded

A JavaScript program typically executes inside a _single thread_ (let's ignore some less common cases where code spawns [child processes](https://nodejs.org/api/child_process.html), [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), [Worker Threads](https://nodejs.org/api/worker_threads.html) or similar)

-   This means that, at any point in time, at most one code path is executing. 
-   This does not prevent JavaScript from making it seem like multiple things are going on at the same time!
    -   Example: while a part of the JavaScript code is getting some data from the backend to update the page with, another part of the code might be creating some visual effects whenever the user hovers over a button
    -   JavaScript is able to accomplish this using a combination of _asynchronous calls_ and the _Event Loop_

When making _asynchronous calls_, JavaScript code tells the JavaScript engine something like "ok, I'm done for now, but please perform this task for me and pass the resulting data to this function I'm giving you". The task in question could be something like retrieving data from a URL. When the engine has retrieved the data, it can then execute the program starting from the function it received. But while the engine was waiting for the data, other pieces of JavaScript that are triggered by other events can already be run. 

The part of the engine responsible for determining what code to run when is the _Event Loop_, which in essence constantly checks if there is something ready to be executed and also determines what to execute first in case there are multiple candidates. See also [The Event Loop](#the-event-loop).

Note that, although the JavaScript code runs in a single thread, the engine might use several threads for performing asynchronous operations like retrieving data from a server.

### Non-preemptive (run-to-completion)

Another important thing about JavaScript concurrency is that it is _non-preemptive_. Basically, that means that the execution of a piece of code will never be interrupted unless the code itself asks for it.

In a lot of languages, things are quite different. In Java, for example, concurrency is achieved using threads which could be interrupted (preempted) at any moment. This means that even code like `sharedCounter++` can lead to unexpected behavior in programs using concurrency, as it's possible that the execution is interrupted after the current value is read but before the new value is written. If that happens and some other code changed the counter during the interruption, your shared counter will probably not behave as you intended. This situation is called a _race condition_. See also [Java threads](../java/concurrency-details/Threads.md).

Because JavaScript concurrency is _non-preemptive_, we don't have this problem. Instead, we have the guarantee that synchronous code (no asynchronous calls) will always be executed atomically, entirely, to completion.

```javascript
const currentValue = sharedCounter;

// any amount of synchronous code

// guaranteed that the code didn't get interrupted before reaching this line
sharedCounter = currentValue + 1; 
```

As JavaScript normally only runs in a single thread, the fact that the code above didn't get interrupted also means that we have the guarantee that `sharedCounter` didn't change in the meantime (again, we are ignoring the exceptional cases where code might for example be sharing data with [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) or [Worker Threads](https://nodejs.org/api/worker_threads.html), see also [The Return of SharedArrayBuffers and Atomics](https://www.sitepen.com/blog/the-return-of-sharedarraybuffers-and-atomics/))

The code will only be interrupted if it chooses to be interrupted (by making an asynchronous call). Example:

```javascript
const currentValue = sharedCounter;

// execution gets interrupted here
await somePromise;

// note sure what has executed in the meantime
sharedCounter = currentValue + 1; 
```

The fact that code runs until it chooses to be interrupted greatly reduces the potential for timing bugs. However, you can still create timing bugs by making invalid assumptions about the order in which different pieces of code will run if they are all waiting for some asynchronous call to complete.

Another consequence of the run-to-completion behavior is that a long-running synchronous operation prevents any other code from running. A two-second synchronous operation means that, for two seconds, your webpage will freeze or your server will be unresponsive. This means that you need to be very careful about preventing long-running synchronous operations. Even if a piece of code has everything it needs to continue, you might actually want it to be interrupted in order to give other code a chance to run on the single thread that is available. See also [Don't block the Event Loop](#dont-block-the-event-loop).

## The Event Loop

The _Event Loop_ is responsible for determining when which piece of the program gets executed, based on any events that the program's code is waiting for. These events could be timers, the user interacting with HTML elements, data being retrieved from a server, ...

The exact implementation and behavior of the Event Loop is different for different JavaScript engines (browsers differ in their behavior, Node.js has its own behavior, ...). However, there are some concepts that they all share:

-   **Queues:** There several queues holding callbacks that are ready to be executed. Within a queue, tasks will be executed in order.
-   **Tasks:** Tasks are the "normal" callbacks to be executed. 
    -   Examples: expired timers (including Node.js `setImmediate()`), HTML click events, ...
-   **Microtasks:** Microtasks take priority over normal tasks. They are used for things that should execute immediately after the currently running code has finished. Whenever the engine finishes a task, it first checks for any microtasks to be executed. The next normal task will only get executed once there are no more microtasks waiting.
    -   Example: Promise callbacks. Note that, even if a Promise has already been resolved, its callback is executed asynchronously through a microtask.
    -   Example: Node.js has `process.nextTick()` which also allows scheduling microtasks

You could imagine the code for the event loop to look a bit like this (adapted from [Event loop explainer](https://github.com/atotic/event-loop)):

    while(true) {
        // get first normal task from some queue
        task = eventLoop.nextTask(); 

        if (task) {
            // execute that single task
            task.execute(); 
        }
        
        // execute all microtasks until none are left
        eventLoop.executeMicrotasks(); 
        
        // browser-specific: render if needed
        if (eventLoop.needsRendering()) {
            eventLoop.render();
        }        
    }

Note: The JavaScript specification doesn't specify exactly how the engine should select the next task to execute. It does specify that the engine needs to take the first task from some queue, but the engine can still choose _which_ queue to pick a task from.

Note: Take a look at [Understanding the Node.js event loop phases and how it executes the JavaScript code.](https://dev.to/lunaticmonk/understanding-the-node-js-event-loop-phases-and-how-it-executes-the-javascript-code-1j9) for more details on the event loop used by Node.js. It includes details on the different phases used by the event loop, as well as the confusingly named `setImmediate()` and `process.nextTick()`. Interestingly, `setImmediate()` is less immediate than `process.nextTick()`, and `process.nextTick()` doesn't wait until the next tick (iteration of the event loop through all of its phases) but actually executes in the current one.

### Example execution

Let's take a look at how the engine executes the following script (from [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)):

```javascript
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
    console.log('promise1');
}).then(function() {
    console.log('promise2');
});

console.log('script end');
```

When we execute this script, it happens as follows:

1.  There is an initial task to run the script
    1.  The code logs `script start`
    2.  The callback for setTimeout is scheduled as a _task_
    3.  The first Promise callback is scheduled as a _microtask_
    4.  The code logs `script end`
2.  The microtask for the first Promise callback is executed
    1.  The code logs `promise1`
    2.  The second Promise callback is scheduled as a _microtask_
3.  The microtask for the second Promise callback is executed
    1.  The code logs `promise2`
4.  The first iteration of our event loop pseudocode (see above) is now complete
5.  Next task: the callback for setTimeout
    1.  The code logs `setTimeout`

## Don't block the Event Loop

As said above, JavaScript runs in a single thread and the execution of a piece of code is never interrupted unless the code itself chooses to wait for some kind of event.

While this prevents a lot of concurrency bugs, it also means that long-running synchronous code completely prevents the event loop from doing anything else:

-   A long synchronous operation on a webpage prevents any click events, responses from the server, ... from being processed. The worst case is an infinite synchronous loop, which freezes the entire page.
-   A long synchronous operation on a Node.js server prevents the server from doing anything else, making it seem unresponsive. The worst case is an infinite synchronous loop, which makes the server appear to be down from the outside world, while the server itself and process managers still consider the server to be running.
-   Basically, it is up to you to ensure that you don't block the event loop for long periods of time so that all kinds of tasks are able to run without having to wait for a long amount of time.

The following code is an example of how synchronous code blocks asynchronous callbacks:

```javascript
const start = Date.now();

setTimeout(() => console.log("setTimeout"), 0);

while(Date.now() < start + 1000) {
    console.log("synchronous");
}
```

Although setTimeout callback is scheduled to execute after 0 milliseconds, it only executes after one second once the synchronous loop is done executing. The synchronous operation is blocking other tasks from being executed.

Note that, in extreme cases where the microtask queue stays full, the microtask queue can also block normal tasks from being executed. As an example, see the following piece of code.

```javascript
const start = Date.now();

setTimeout(() => console.log("setTimeout"), 0);

function recursivePromise() {
    Promise.resolve().then(() => {
        console.log("recursivePromise");

        if (Date.now() < start + 1000) {
            recursivePromise();
        }
    });
}

recursivePromise();
```

Although setTimeout callback is scheduled to execute after 0 milliseconds, it only executes after one second once our recursive function stops adding microtasks to the queue.

In Node.js, there is pool of workers that handle asynchronous tasks like file reads. It's also possible to block the workers in this pool, for example by asking them to read the complete contents of a very large file. In essence, if you give a worker in the pool a long-running task, you are basically reducing the size of the worker pool by one until that task completes. If you somehow manage to get all of the workers in the pool working on a long-running task, the pool will not be able to process any other tasks that the code is waiting for.

### Recommendation: asynchronous where possible

Unless you're writing a simple script, go for asynchronous operations instead of synchronous ones where possible. Regarding Node.js specifically, if you are writing an actual server (rather than a script) you should avoid using any of the synchronous crypto, compression, file system, child process or other calls. Instead, use their asynchronous versions.

### Recommendation: watch out with JSON and regexes

JSON stringifying and parsing happens synchronously. While these operations scale linearly with the length of the input, they can take a long time for large input. This means you could suffer a DOS attack if your server using Node.js receives very large JSON inputs.

Some ways to mitigate this:

-   Reject large input
-   Use alternative ways of parsing JSON, like [JSONStream](https://www.npmjs.com/package/JSONStream) or [Big-Friendly JSON](https://www.npmjs.com/package/bfj)

Regexes are also evaluated synchronously. Some particular regular expressions might need an exponential number of passes through the input string. That means that the time it takes to match a string against the regular expression grows exponentially as the input string grows. Large input provided to these regular expressions can basically render a Node.js server unresponsive for long periods of time. This is called a [ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) vulnerability.

Some ways to mitigate this:

-   Reject large input
-   Avoid regular expressions using nested quantifiers (like `(a+)*`), backreferences (like `(a.*) \1`, ...)
-   Use simple string matches (like `indexOf`) instead of regexes where possible
-   Use tools like [safe-regex](https://github.com/substack/safe-regex) that can help you identify some (but not all) vulnerable regexes

### Recommendation: task partitioning

Imagine that you have a Node.js server that accepts two types of requests:

-   Type A, needing 1ms of synchronous computation
-   Type B: needing 500ms of synchronous computation

Let's assume that every second the server receives 100 requests of type A and 1 request of type B. If 50 requests of type A come in just after a request of type B, all of those relatively fast requests needs to wait for 500ms before they can even start to be processed (making it seem to the client like they also took 500ms). One large synchronous request can have an enormous impact on the waiting time of lots of smaller requests.

You can solve this situation using _task partitioning_.

-   Basic idea: minimize the variation in task times by chopping up large tasks into smaller ones
-   Application to example above:
    -   Rewrite the code for requests of type B: Instead of performing all of the computations in one big synchronous chunk, we let the code peform a small part of the computations (maybe a few ms worth of computation) and then call `setTimeout` with a delay of 0 and a callback that performs the next chunk of computation (which is put at the end of the relevant queue). 
    -   This way, all tasks in the event loop take at most a few ms, making the server appear to be a lot faster and more responsive to clients issuing requests of type A.

Note: depending on how asynchronous operations are handed by the engine, you should also be careful about long-running asynchronous tasks

-   Example: workers in the Node.js worker pool that are asked to read the complete contents of some potentially huge files can end end up blocking the worker pool
-   You can apply task partitioning here by manually specifying which part of the file to read or using a streaming API to read the files.

Also note that task partitioning shouldn't be taken too far, as there is also some overhead involved in the creation of a whole lot of tasks vs. a single long-running task.

### Recommendation: offloading

For some kinds of long-running synchronous computations, task partitioning is very hard to achieve. In this case, you can spare the event loop (and potentially even make better use of the available CPU cores) by running those computations inside their own [child process](https://nodejs.org/api/child_process.html), [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), ... 

Do note that there is some overhead for creating these and communicating with them. You can mitigate this overhead by maintaining a pool of reusable workers/processes (instead of creating new ones each time) and limiting the amount of communication that is needed.

## Resources

-   [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
-   [Concurrency model and the event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
-   [Event loop explainer](https://github.com/atotic/event-loop)
-   [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
-   [Understanding the Node.js event loop phases and how it executes the JavaScript code.](https://dev.to/lunaticmonk/understanding-the-node-js-event-loop-phases-and-how-it-executes-the-javascript-code-1j9)
-   [Don't Block the Event Loop (or the Worker Pool)](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
