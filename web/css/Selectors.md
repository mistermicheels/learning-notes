---
tree_title: Selectors
description: An overview of CSS selectors and how to combine them
last_modified: 2020-05-30T15:54:15+02:00
---

# Selectors (CSS)

## Contents

-   [Selector types](#selector-types)
    -   [Type selector](#type-selector)
    -   [Universal selector](#universal-selector)
    -   [Class selector](#class-selector)
    -   [ID selector](#id-selector)
    -   [Attribute selector](#attribute-selector)
    -   [Pseudo-class selector](#pseudo-class-selector)
    -   [Pseudo-element selector](#pseudo-element-selector)
-   [Combining selectors](#combining-selectors)
    -   [Selector lists using `,`](#selector-lists-using-)
    -   [Same-element combinations](#same-element-combinations)
    -   [Descendant combinator](#descendant-combinator)
    -   [Child combinator](#child-combinator)
    -   [Adjacent sibling combinator](#adjacent-sibling-combinator)
    -   [General sibling combinator](#general-sibling-combinator)
-   [Resources](#resources)

## Selector types

### Type selector

Selects based on HTML element type

```css
h1 {
    color: red;
}
```

### Universal selector

Selects all elements

```css
* {
    color: red;
}
```

### Class selector

Selects elements based on class

```css
.error-text {
    color: red;
}
```

### ID selector

Selects elements based on ID

```css
#main-text {
    color: black;
}
```

### Attribute selector

Select elements based on attributes

```css
[disabled] {
    color: red;
}
```

### Pseudo-class selector

Selects elements that are in a specific state

Typically combined with other selectors (see also below)

```css
a:hover {
    color: red;
}   
```

[Pseudo-classes reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#Index_of_standard_pseudo-classes)

Special case: the **negation pseudo-class**

```css
/* matches any element that is not a paragraph */
:not(p) {
  color: blue;
}
```

### Pseudo-element selector

Selects specific part of an element

Typically combined with other selectors

```css
p::first-line {
  text-transform: uppercase;
}
```

[Pseudo-elements reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements#Index_of_standard_pseudo-elements)

## Combining selectors

### Selector lists using `,`

No effect other than reducing code duplication

Example: before

```css
h1 { 
  color: blue; 
} 

.special { 
  color: blue; 
} 
```

Example: after

```css
h1, .special { 
  color: blue; 
} 
```

### Same-element combinations

Combine multiple selectors that all need to apply to the same element

Example: select all hyperlinks with class `test` that the user hovers over

```css
a.test:hover {
    color: red;
}
```

### Descendant combinator

Typically represented by a single space (` `) character

Elements matched by the second selector are selected if they have an ancestor matching the first selector

Example: select all spans that are directly or indirectly inside a div with class test

```css
div.test span {
    color: red;
}
```

### Child combinator

Represented by the `>` sign

Same as descendant combinator, but only considers the direct parent of an element

Example: select all spans that are a direct child of a div with class test

```css
div.test > span {
    color: red;
}
```

### Adjacent sibling combinator

Represented by the `+` sign

Matches an element matching the second selector if that element immediately follows an element matching the first selector and they both have the same parent

Example: select all paragraphs that immediately follow an image

```css
img + p {
  color: red;
}
```

### General sibling combinator

Represented by the `~` sign

Matches an element matching the second selector if that element follows an element matching the first selector (but not necessarily immediately) and they both have the same parent

Example: select paragraphs that come after any image with the same parent

```css
img ~ p {
  color: red;
}
```

## Resources

-   [CSS - The Complete Guide 2020 (incl. Flexbox, Grid & Sass)](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/)
-   [CSS selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors)
