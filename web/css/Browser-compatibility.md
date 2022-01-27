---
tree_title: Browser compatibility
description: Making sure your CSS works in different browsers
last_modified: 2022-01-27T17:10:03.020Z
---

# Browser compatibility (CSS)

## Contents

-   [Eliminating inconsistencies](#eliminating-inconsistencies)
-   [Checking which browsers support certain functionality](#checking-which-browsers-support-certain-functionality)
-   [Support queries](#support-queries)
-   [Vendor prefixes](#vendor-prefixes)
-   [Polyfills](#polyfills)
-   [Testing in different browsers](#testing-in-different-browsers)
-   [Resources](#resources)

## Eliminating inconsistencies

Problem: Different browsers use different defaults for how elements should look like

Solution: **CSS reset** stylesheet that overrides browser defaults by some sensible values and provides a "clean slate" for your CSS to build upon

Example: [Normalize.css](https://necolas.github.io/normalize.css/)

## Checking which browsers support certain functionality

-   Can use [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
    -   Example: [compatibility for grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns#Browser_compatibility)
-   Can use [Can I Use](https://caniuse.com/)
    -   Example: [compatibility for grid-template-columns](https://caniuse.com/#feat=mdn-css_properties_grid-template-columns)

## Support queries

Can be used to conditionally apply CSS only if the browser supports certain functionality

Example:

```css
@supports (display: grid) {
    .container {
        display: grid;
        /* other grid properties */
    }
}
```

## Vendor prefixes

Different browsers implement new features differently and at different speeds

Vendor prefixes: browser-specific (or rendering-engine-specific) prefixes on properties or values that trigger a browser-specific (or rendering-engine-specific) version of the feature

Goals:

-   Allow developers to make use of new features before they are standardized
-   When the features become standardized, it is still possible to get the old non-standard behaviors by using the prefixes (don't break behavior for early adopters that depend on some specific non-standard behavior)
-   By including the vendor prefixes next to the normal properties/values for a standardized feature, you can still support older browser versions in which the feature was not yet standardized

Example:

```css
.container {
    /* last one supported by current browser wins */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
}
```

You can also automatically include vendor prefixes by using a tool like [Autoprefixer](https://github.com/postcss/autoprefixer)

## Polyfills

Polyfill = JavaScript that enables certain features in browsers that would not support them otherwise

Can be useful, but polyfills come at a cost (loading + execution time)

Also, it is pretty much impossible to create a CSS polyfill that is not either big, slow or doesn't behave the way it should in all cases. See [The Dark Side of Polyfilling CSS](https://philipwalton.com/articles/the-dark-side-of-polyfilling-css/).

## Testing in different browsers

Useful tool: [BrowserStack](https://www.browserstack.com/) (or one of its many alternatives)

## Resources

-   [CSS - The Complete Guide 2020 (incl. Flexbox, Grid & Sass)](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/)
-   [Supporting older browsers](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Supporting_Older_Browsers)
