---
description: What are Cookies and Web Storage? What do they have in common? What are their differences?
last_modified: 2022-01-31T10:44:35.355Z
---

# Cookies and Web Storage

## Contents

-   [What they have in common](#what-they-have-in-common)
-   [Cookies](#cookies)
-   [Web Storage](#web-storage)
-   [Resources](#resources)

## What they have in common

-   Solution for storing data client-side
-   Function as a kind of key-value store, allowing to store string values

## Cookies

-   Are typically set from the server (as part of a response to the client) using `Set-Cookie` headers
-   Are sent automatically as `Cookie` headers with each request to a domain and path matching the cookie's specified `Domain` and `Path`
    -   Good for information that needs to be sent to the server on each call (for example tokens)
    -   Can be particularly handy in cases where it's hard to control the actual request made to the server (examples: GET request from and `<img>` tag, server-side rendering where each navigation loads a new page from the server, ...)
    -   Not good for storing large amounts of data that don't need to be sent every time
-   Lifetime:
    -   Session cookies: no specified expiry date or max age. Normally lasts until the browser is shut down, although browsers may use _session restoring_ which means they survive across browser restarts
    -   Permanent cookies: specific expiry date (specified through `Expires`) or max age (specified through `Max-Age`)
-   `Secure` flag, if turned on the cookie can only be sent over HTTPS
-   `HttpOnly` flag, if turned on the cookie cannot be accessed by JavaScript
    -   Recommended for storing sensitive information like tokens, as this helps prevent tokens from being stolen through XSS (cross-site scripting)
    -   Cookies without this flag can be read/written by JavaScript (but only from JavaScript that was loaded by a page in a matching domain)
    -   Cookies with the flag turned on can still be viewed and edited by the user, for example through developer tools!
-   Risk of CSRF (cross-site request forgery attacks), where a completely different site makes a request to your backend, counting on the fact that cookies holding tokens will automatically be sent
    -   Can be mitigated by also requiring a CSRF token to be sent in a way that requires JavaScript being involved. An example is requiring the client to get the token from a cookie and then put it in a header (remember that cookies for a certain domain can only be accessed by JavaScript loaded by pages in that domain).

## Web Storage

-   Can be set and read from JavaScript loaded by a page with matching origin (origin = `protocol://host:port`)
    -   Values don't get sent to the server unless JavaScript adds it to a request
    -   Ideal for storing preferences, scores, ... that don't need to be stored on the server (or should be able to survive page reloads without asking the server for them again)
-   Can generally store more data than cookies (something along the lines of 5MB in total per domain, versus 4KB per cookie)
-   Lifetime:
    -   `sessionStorage`: keeps the data as long as the page is open
        -   Survives page reloads and restores
        -   Opening the page in a new tab or window gives it its own separate `sessionStorage`
        -   In some browsers, duplicating a tab gives the new tab its own separate `sessionStorage`, but the data from the original tab's `sessionStorage` is initially copied into it
    -   `localStorage`: stays until cleared through JavaScript or the user clearing browser data
-   Interesting feature: `StorageEvent` fired when storage is changed, could be used within your web application to trigger certain things or even as a mechanism to communicate between different instances of your web application (in different windows or tabs) within the same browser

## Resources

-   [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
-   [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
-   [What is the difference between localStorage, sessionStorage, session and cookies?](https://stackoverflow.com/questions/19867599/what-is-the-difference-between-localstorage-sessionstorage-session-and-cookies)
-   [Could someone explain the life of a sessionStorage object?](https://stackoverflow.com/questions/8945744/could-someone-explain-the-life-of-a-sessionstorage-object)
-   [In HTML5, is the localStorage object isolated per page/domain?](https://stackoverflow.com/questions/4201239/in-html5-is-the-localstorage-object-isolated-per-page-domain)
