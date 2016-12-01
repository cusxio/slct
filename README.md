# Slct

A native DOM selection engine with cache built in. :zap:

[Motivation](#motivation).


## Usage

Using [npm](https://www.npmjs.com/):

```
$ npm install --save slct
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/slct/dist/slct.min.js"></script>
```

## API

### slct(query, invalidate)

#### query

A normal query string with an identifier.

The substring after the identifier will be passed into the native DOM methods.

Type: `String`

```js
// Supported Identifiers
// '.' =     getElementsByClassName
// '#' =     getElementById
// '%' =     getElementsByTagName
// '@' =     getElementsByName
// '?' =     querySelector
// '*' =     querySelectorAll

// Examples:
import $ from 'slct';

$('.links')    // document.getElementsByClassName('.links');
$('#logo')     // document.getElementById('logo');
$('%li')       // document.getElementsByTagName('li');
$('@random')   // document.getElementsByName('random');
$('?div')      // document.querySelector('div');
$('*.links')   // document.querySelectorAll('.links');
```

#### invalidate

To invalidate a selector and re-cache it.

Type: `Boolean`
Default: `false`

## Motivation

Often, we have to write code that looks like this:

```js
/**
 * Here, we are caching the selector for better performance.
 * This prevents any additional DOM lookup when the selector
 * is needed again.
 */
const links = document.querySelectorAll('.links');

/**
 * Since NodeList is not Array-like, we can't call `forEach` directly,
 * and this results in the following code.
 */
[].forEach.call(links, (link) => {
    link.addEventListener('click', () => {
        link.style.color = 'red';
    });
});
```

What if we can write code that looks like this ?

`Slct` automatically does two things:

1. Caches the Selector
2. Convert's `NodeList` into Array-like

```js
/**
 * Slct automatically caches the selector and convert NodeList's
 * into Array-like, thus resulting in less boilerplate code.
 */
import $ from 'slct';

$('*.links').forEach((link) => {
    link.addEventListener('click', () => {
        link.style.color = 'red';
    });
});


/**
 * To invalidate the selector and re-cache it.
 */
$('*.links', true);
```