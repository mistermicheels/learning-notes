---
description: A short introduction to Sass and SCSS
last_modified: 2020-05-30T15:54:15+02:00
---

# Sass/SCSS

## Contents

-   [Basic idea](#basic-idea)
-   [Some features](#some-features)
    -   [Variables](#variables)
    -   [Nesting](#nesting)
    -   [Mixins](#mixins)
    -   [Inheritance](#inheritance)
        -   [Same example but using mixins](#same-example-but-using-mixins)
        -   [Example where inheritance can be confusing](#example-where-inheritance-can-be-confusing)
-   [Resources](#resources)

## Basic idea

-   "Syntactically Awesome Style Sheets"
-   Sass is a style sheet preprocessor that transpiles files in the Sass/SCSS language into regular CSS that can be understood by browsers
-   Two syntaxes available:
    -   SCSS (Sassy CSS): This is an extension of the CSS syntax, meaning that every valid CSS file is also a valid SCSS file with the same meaning
    -   Sass syntax (also known as indented syntax): Older syntax that uses indentation instead of brackets to indicate nesting and uses newlines instead of semicolons to separate different properties

## Some features

(examples taken from the [Sass website](https://sass-lang.com/))

### Variables

Example SCSS:

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

Resulting CSS:

```css
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
```

### Nesting

Allows you to nest your CSS selectors in a way that's similar to how your HTML elements are nested

Example SCSS:

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

Resulting CSS:

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline-block;
}

nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

### Mixins

Mixin = a group of CSS declarations that you can reuse together, potentially parameterized

Helps to keep your SCSS DRY

Typical use case: vendor prefixes

Example SCSS:

```scss
@mixin transform($property) {
  -webkit-transform: $property;
  -ms-transform: $property;
  transform: $property;
}

.box { @include transform(rotate(30deg)); }
```

Resulting CSS:

```css
.box {
  -webkit-transform: rotate(30deg);
  -ms-transform: rotate(30deg);
  transform: rotate(30deg);
}
```

### Inheritance

Inheritance lets you share properties between selectors

Helps to keep both your SCSS and CSS DRY

Example SCSS:

```scss
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.message {
  @extend %message-shared;
}

.success {
  @extend %message-shared;
  border-color: green;
}

.error {
  @extend %message-shared;
  border-color: red;
}

.warning {
  @extend %message-shared;
  border-color: yellow;
}
```

Resulting CSS:

```css
.message, .success, .error, .warning {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  border-color: green;
}

.error {
  border-color: red;
}

.warning {
  border-color: yellow;
}
```

In the above example, `%message-shared` is a **placeholder class** which will not be included as such into the resulting CSS

Note: inheritance and mixins are very similar, but can have different effects. See [SASS and Bootstrap - mixins vs. @extend](https://stackoverflow.com/questions/30744625/sass-and-bootstrap-mixins-vs-extend). One important difference is that inheritance also avoids duplication in the resulting CSS (see above), which is not the case when using mixins. The way inheritance avoids duplication in the resulting CSS can sometimes have confusing consequences caused by the order in which rules are loaded (example below, see alo [Inheritance, the cascade and specificity](./Inheritance-cascade-specificity.md)).

#### Same example but using mixins

SCSS for same example but with mixins:

```scss
@mixin message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.message {
  @include message-shared;
}

.success {
  @include message-shared;
  border-color: green;
}

.error {
  @include message-shared;
  border-color: red;
}

.warning {
  @include message-shared;
  border-color: yellow;
}
```

Resulting CSS:

```css
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
  border-color: green;
}

.error {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
  border-color: red;
}

.warning {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
  border-color: yellow;
}
```

#### Example where inheritance can be confusing

Example element: `<div class='row highlight-row'></div>`

Example SCSS (at first sight, this seems to make the element red):

```scss
.red-text {
    color: red;
}

.row {
    color: green;
}

.highlight-row {
    @extend .red-text;
}
```

Resulting CSS (actually makes the element green):

```css
.red-text, .highlight-row {
    color: red;
}

.row {
    color: green;
}
```

## Resources

-   [CSS - The Complete Guide 2020 (incl. Flexbox, Grid & Sass)](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/)
-   [Sass](https://sass-lang.com/)
-   [What's the difference between SCSS and Sass?](https://stackoverflow.com/questions/5654447/whats-the-difference-between-scss-and-sass)
