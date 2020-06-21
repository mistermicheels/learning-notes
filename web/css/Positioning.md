---
tree_title: Positioning
description: Positioning elements using CSS
last_modified: 2020-05-30T15:54:15+02:00
---

# Positioning (CSS)

## Contents

-   [Basic idea](#basic-idea)
-   [Positioning types](#positioning-types)
    -   [Static positioning](#static-positioning)
    -   [Relative positioning](#relative-positioning)
    -   [Absolute positioning](#absolute-positioning)
    -   [Fixed positioning](#fixed-positioning)
    -   [Sticky positioning](#sticky-positioning)
-   [An element's containing block](#an-elements-containing-block)
-   [Extra: z-index](#extra-z-index)
-   [Resources](#resources)

## Basic idea

-   Allows taking elements out of normal document flow
    -   Example: one element on top of another
    -   Example: element remaining in same place when user scrolls the page
-   Controlled through `position` property
-   Note: For creating entire layouts, Flexbox and the CSS Grid are likely better options

## Positioning types

### Static positioning

-   Default positioning type
-   "let the element take its normal position in the document"

### Relative positioning

-   Default placement same as static positioning
-   Same effect on surrounding elements as static positioning (still takes the same amount of space in the same location)
-   Can adjust position **relative to default placement** using the `top`, `bottom`, `left` and `right` properties
    -   Indicate the element being pushed away from its normal position
    -   Example: `top: 30px;` will make the element sit 30px lower than its default position
    -   These properties do not change the effect the element has on its surrounding elements!
    -   Can be used to make the element overlap with surrounding elements

### Absolute positioning

-   No longer part of normal document flow!
    -   Does not push surrounding elements away
    -   Exists in its own layer, separate from other elements
-   Can adjust position **relative to sides of [containing block](#an-elements-containing-block)** using the `top`, `bottom`, `left` and `right` properties
    -   Containing block: see below
    -   Indicate the element being pushes away from the sides of the containing block
    -   Example: `top: 30px;` will make the element sit 30px lower than the top of its container element
-   Useful for UI features that sit on top of other elements without interfering with them: popups, rollover panels, elements that can be dragged and dropped, ...

### Fixed positioning

-   Same as absolute positioning, but element is positioned relative to the browser's viewport
-   Element stays in same position relative to viewport, even if user scrolls
-   Can adjust position **relative to viewport** using the `top`, `bottom`, `left` and `right` properties
-   Can be very useful for things like navigation menus

### Sticky positioning

-   Newer than the others
-   Hybrid between relative and fixed positioning
    -   Makes element acts like relatively positioned one until it is scrolled to a certain point, after which is becomes fixed (to prevent it from being scrolled out of the viewport)
-   Interesting use case: scrollable page with different headings, each heading sticks to the top of the page as it is reached

## An element's containing block

Affects size and position of element:

-   Basis for computation of percentage values applied to width and height
-   Basis for offset computations of absolutely positioned element

Identifying the containing block (see also [Box model](./Box-model.md)):

-   If the element's position is **static**, **relative** or **sticky**, the containing block is the edge of the _content_ box of the nearest ancestor element that is either a block box or establishes a formatting context (which means it can be a table container, flex container, grid container, or the block container itself)
-   If the element's position is **absolute**, the containing block is the edge of the _padding_ box of the nearest ancestor element that does _not_ have static positioning
-   If the element's position is **fixed**, the containing block is the viewport (or the page area in case of paged media)
-   For elements with position **absolute** or **fixed**, there are also some special cases described here: [Layout and the containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block)

Note: the containing block for the root element (the `<html>` tag) is called the **initial containing block** and has the dimensions of the viewport (or the page area in case of paged media)

## Extra: z-index

-   Determines, if elements overlap, which element is on top of the other
    -   This is also important for making elements clickable! If multiple elements overlap beneath the mouse pointer, the one receiving the click event will be the one that sits on top of the others
-   Property `z-index` accepts unitless values (default is 0)
-   Higher values are considered to be on top of lower values

## Resources

-   [CSS - The Complete Guide 2020 (incl. Flexbox, Grid & Sass)](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/)
-   [Positioning](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning)
-   [Layout and the containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block)
