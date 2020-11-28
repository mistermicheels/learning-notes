---
tree_title: Naming classes
description: Some ideas/patterns for naming your CSS classes
last_modified: 2020-11-28T16:32:04.296Z
---

# Naming classes (CSS)

## Contents

-   [Some general tips](#some-general-tips)
-   [Object Oriented CSS](#object-oriented-css)
-   [Block Element Modifier (BEM)](#block-element-modifier-bem)
-   [Resources](#resources)

## Some general tips

-   Use `snake-case`
-   Name classes by feature (example: `.page-title`) instead of style (example: `.title-blue`)
    -   One reason: if name your class by style and you want to change something about the style, you would need to change the class name and change the HTML accordingly everywhere it's used
    -   Note: CSS frameworks often have utility classes that are named by style (`.visibility-hidden`, `.text-center`, ...).
    -   Note: There are frameworks like [Tailwind CSS](https://tailwindcss.com/) that pretty much rely completely on utility classes that are named after the style they apply. For the philosophy behind this and some drawbacks of the rest of the advice in this note, see [CSS Utility Classes and "Separation of Concerns"](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/).
-   Don't go too specific: instead of creating very specific classes (or selector) that have a lot of duplication between them, try to encapsulate different parts of the behavior you want into classes that you can then combine
    -   Example: instead of `.main-article-box` or `article.main p.box`, consider going for `.box` which you can apply in different places, potentially combined with other classes

## Object Oriented CSS

-   Idea: separate CSS into reusable "objects" that can be used anywhere you need
-   The way people use CSS today is heavily influenced by this approach

Example CSS not using OOCSS approach:

```css
.comment {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.comment img {
  border: 1px solid grey;
}

.comment .content {
  font-size: .8rem;
}

.list-item {
  display: grid;
  grid-template-columns: 1fr 3fr;
  border-bottom: 1px solid grey;
}

.list-item .content {
  font-size: .8rem;
}
```

Example CSS using OOCSS approach:

```css
.media {
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.media .content {
  font-size: .8rem;
}

.comment img {
  border: 1px solid grey;
}

 .list-item {
  border-bottom: 1px solid grey;
} 
```

Example HTML for comment:

```html
<div class="media comment">
  <img />
  <div class="content"></div>
</div>
```

Example HTML for list item:

```html
<ul>
  <li class="media list-item">
    <img />
   <div class="content"></div>
  </li>
</ul>
```

## Block Element Modifier (BEM)

-   Naming standard for CSS classes
-   Terminology:
    -   Block: button, menu, logo, ...
    -   Element: something in the block
    -   Modifier: a flag that changes style or behavior
-   Class names: `block__element--modifier`
-   Typical use case: large web projects
-   Can be overkill for smaller projects or for projects that have a way of making CSS more modular by making specific pieces of CSS only apply to specific parts of the website (example: [Angular component styles](https://angular.io/guide/component-styles))

BEM example (from [Get BEM](http://getbem.com/naming/)):

```html
<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit" />
</form>
```

```css
.form { }
.form--theme-xmas { }
.form--simple { }
.form__input { }
.form__submit { }
.form__submit--disabled { }
```

## Resources

-   [CSS - The Complete Guide 2020 (incl. Flexbox, Grid & Sass)](https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/)
-   [Organizing your CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Organizing)
-   [CSS Utility Classes and "Separation of Concerns"](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)
