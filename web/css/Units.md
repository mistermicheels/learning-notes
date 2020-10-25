---
tree_title: Units
description: An overview of the most important CSS units and some advice on when to use which
last_modified: 2020-10-25T21:56:09.044Z
---

# Units (CSS)

## Contents

-   [Types of units](#types-of-units)
-   [When to use what](#when-to-use-what)
-   [Resources](#resources)

## Types of units

-   Absolute: `px` (pixels) etc.
    -   Typical example: `px` (pixels)
    -   Drawback when using px for font size: ignores any non-standard default font size that user has configured in browser
-   Relative to parent element: `%`
    -   See also [Box model](./Box-model.md)
-   Relative to viewport: `vh`, `vw ` (% of viewport height, % of viewport width)
    -   See also [Box model](./Box-model.md)
    -   Also `vmin`, `vmax` (% of smallest viewport dimension, % of largest viewport dimension)
-   Relative to font size
    -   `rem`: font size of root (HTML) element (this is set by the browser by default)
    -   `em`: font size of parent element

## When to use what

Good practice (but not necessarily best in all cases):

-   Font size on root element
    -   Nothing (let your browser specify it)
    -   `%` (percentage of default font size, still increases proportionally with font size configured in browser)
        -   Most browsers set default font size to 16px by default -> setting `62.5%` as font size on the root element will make `1 rem` equal to 10px for default browser settings, which can make calculations easier
-   Font size on non-root element:
    -   `rem`  (typically the safe choice)
    -   `em` (useful when font sizes need to gradually decrease when elements are nested)
-   Padding and margins: `rem`
-   Borders: `px` (visually, it often doesn't make sense for border thickness to scale with font size)
-   Width and height: `%` or `vh`
-   Top, bottom, left, right: `%`

## Resources

-   [CSS - The Complete Guide 2020 (incl. Flexbox, Grid & Sass)](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/)
-   [CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
-   [CSS units for font-size: px | em | rem](https://medium.com/code-better/css-units-for-font-size-px-em-rem-79f7e592bb97)
