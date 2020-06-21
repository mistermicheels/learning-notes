---
tree_title: Responsive design
description: Making your site look good on any device and screen
last_modified: 2020-05-30T15:54:15+02:00
---

# Responsive design (CSS)

## Contents

-   [Basic idea](#basic-idea)
-   [Viewport meta tag](#viewport-meta-tag)
-   [Media queries](#media-queries)
-   [Flexbox and Grids](#flexbox-and-grids)
-   [Testing your design](#testing-your-design)
-   [Resources](#resources)

## Basic idea

-   Goal: make your website look good on any device
-   Important tools:
    -   Viewport meta tag
    -   Media queries

## Viewport meta tag

-   Converts between "hardware pixels" and "software pixels", helping you support screens with different pixel densities
    -   On a small screen with huge pixel density, you still don't want your website to for example fill only a part of the screen or show tiny text
    -   If used correctly, a small screen with huge pixel density will appear to your CSS rules as a screen with small dimensions in terms of pixels
    -   See also [mydevice.io](https://www.mydevice.io/#compare-devices)
-   Doesn't change actual design, just makes sure you have sensible width and height values to base your design on

Example (common, recommended version of the tag):

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
```

## Media queries

-   Allow changing design based on viewport width/height
-   Have to define design changes yourself based on detected width/height
-   Widely used in CSS framworks like [Bootstrap](https://getbootstrap.com/docs/4.0/layout/grid/)

Example:

```css
@media screen and (min-width: 800px) { 
  .container { 
    margin: 1em 2em; 
  } 
} 
```

Common approach: **mobile-first design**

-   First create a design that looks good on narrow-screen devices
-   Then use media queries to change the layout on larger screens so it looks better or makes better use of the available screen space

## Flexbox and Grids

In general, [Flexbox](./Flexbox.md) and [Grids](./Grids.md) are good tools for building pages that scale with the viewport size

## Testing your design

Useful tool: Chrome DevTools Device Mode

See [Simulate Mobile Devices with Device Mode in Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/device-mode)

## Resources

-   [CSS - The Complete Guide 2020 (incl. Flexbox, Grid & Sass)](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/)
-   [Responsive design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
