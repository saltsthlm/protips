**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

## Arrow functions

With ES6 (EcmaScript 6) there's a new way to declare functions. It can, at first, be a little bit tricky to wrap your head around. But once you get used to it, they provide a much tighter way to declare functions.

## A normal declaration

Let's, as an example, declare two functions in the old vanilla JavaScript way:

```javascript
const f1 = function (p1) {
  return p1;
}

const f2 = function (p1, p2) {
  return p1 + ' ' + p2;
}
```

they can now be called like this:

```javascript
console.log(f1('marcus')) // logs 'marcus'
console.log(f2('mies', 'lars')) // logs 'mies lars'
```

## Arrows

Let's rewrite one of the functions as an arrow function.

```javascript
const f2 = function (p1, p2) {
  return p1 + ' ' + p2;
}

const f2arrow = function(p1, p2) {
  return p1 + ' ' + p2;
}
```

This is easy. We can remove the word `function` and replace it with an arrow. We could also make one line rather than these two.

```javascript
const f2arrow = (p1, p2) => { return p1 + ' ' + p2; }
```

But we can actually do more. If you only have one line in the function AND that is a `return`-statement. We can omit the curly braces and remove the return statement.

```javascript
const f2arrow = (p1, p2) => p1 + ' ' + p2;

/* for comparison
const f2 = function (p1, p2) {
  return p1 + ' ' + p2;
}*/
```

Pretty smooth, huh?

Let's look at the `f1` function, because it gives us even more opportunities to clear things up.

let's first make all the abbreviations as before:

```javascript
const f1 = function (p1) {
  return p1;
}

const f1 = (p1) => p1;
```

Ok - this has only one parameter and we can actually remove the paraenthesis around that parameter, making it into:

```javascript
const f1 = p1 => p1;

/* for comparison
const f1 = function (p1) {
  return p1;
}
*/
```

That's quite a difference!

## Functions and arrow functions in callbacks.
the most important usecase where the abbreviation of functions become handy is when we declare it as callback functions.

Let's try it on the `.forEach` function. `.forEach` is a function on arrays that gets called once per item in the array. It takes a callback that gives you the element.

Here's a very simply function that just logs out each element in an array.

First using the normal function declaration syntax:

```javascript
const arr = [1,2,3,4,5];

arr.forEach(function(el) {
  console.log(el);
});
```

Let's clean it up. First put in it on one line:

```javascript
const arr = [1,2,3,4,5];

arr.forEach(function(el) { console.log(el); });
```

then remove the `function` keyword and add the arrow

```javascript
const arr = [1,2,3,4,5];

arr.forEach((el) => { console.log(el); });
```

then, since this only has one parameter, we can remove the paranthesis.

```javascript
const arr = [1,2,3,4,5];

arr.forEach(el => { console.log(el); });
```

And finally, we can remove the curly braces too. We are not returning anything out of this,

```javascript
const arr = [1,2,3,4,5];

arr.forEach(el => console.log(el));

/* for comparision
arr.forEach(function(el) {
  console.log(el);
});
*/
```

If the callback took more than one variable (`.forEach` has an overloaded version that does that) it would look like this:

```javascript
const arr = [1,2,3,4,5];

arr.forEach((el, index) => console.log(el));

/* for comparision
arr.forEach(function(el, index) {
  console.log(el);
});
*/
```

Notice that I had to put the paranthesis back in for this version.

## A video please

Here's a [little video](https://www.youtube.com/watch?v=6sQDTgOqh-I) on how to write arrow functions by a much cooler guy than me.

