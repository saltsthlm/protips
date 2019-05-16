Programming languages come in many different flavors, just as human languages. Each language gives you different opportunities and possibilities to express a solution to a problem. Again just as human languages - let's examine that a bit deeper.

## Example from human language

For example, consider Chinese - a language that is made up of signs. There's a sign for house and another for wagon. If you want to express the concept of a mobile home - you will make a new sign that is the combination of house and wagon (I presume - I don't know Chinese.)

In the language of heroes and Gods (Swedish) we instead use letters to build words. The word for "house" is `h`, `u` and `s` put next to each other, with spaces before and after - to make the word `hus`. Wagon is `vagn`. If you want to represent the concept of mobile home you would combine the letters into a new word `husvagn`. 

The type of language decides how we describe things and how we think about things.

## Programming languages

There are a few different types of programming languages that, in a similar fashion as human languages, affects how we think about the task at hand. This post will describe two of the two big types of programming languages, but there are many more types. 

You can't decisively say that one type of language is better than another language; they are all good in the things they are designed to do. You can solve just about any problem using any kind of language (at least the general purpose programming languages) but they all have their strengths and weaknesses. 

Before we start; the topics that we describe here are both 10-week courses at university and then took me (Marcus) at least 2-3 years more to use to my advantage in real life. This will be a very shallow brush on the surface.

### Object-oriented programming languages

Objection oriented languages (OOP - object orient programming) is obviously based around the concept of objects. These objects contain data and operations to work on that data. 

Famous OOP languages are C#, Java, and Smalltalk. OOP was made popular in the 80-is with the rise of the graphical user interface, that has a good fit for object orientation. 

When writing OOP programs we represent our code as classes. Classes are templates for creating objects. Classes describe how the objects should be structured and behave. We describe the problem we are working with as structures of these classes. Classes can inherit functionality from other classes.

#### An example

An ([overused](https://twitter.com/iamdevloper/status/727854065426804738?lang=en)) example hopefully clarifies what this means. Let's say that we are building a register for animals:

```javascript
class Animal {
  constructor(name) { this.name = name }
  getName() { return this.name.toUpperCase() }
}

class Dog extends Animal {
  constructor(name) { super(name) }
  makeYourSound() { return `${this.getName()} says WOOOF` }
  paws() { return 4 }
}

class Bird extends Animal {
  constructor(name) { super(name) }
  makeYourSound() { return `${this.getName()} says Tweet-tweet` }
  beekLength() { return 2.5 }
}
```

Let's go through this example and see a lot of the OOP paradigms in action. These are the different way that we think about a problem and we will see constraints and opportunities.

* On line 1 we write a class `Animal` that will hold all the information that is common for all animals, for example, a name. 
  * We have a special method called `constructor` that is used to create new objects of this class. Notice that we need to supply a `name` to this, ensuring that all animals will have a `name`.
  * We can get the name of the animal by calling `getName`. This is called **encapsulation** meaning that we hide the internal representation and only allow users of this class to get names through this method. Hence it will always be uppercased

* On line 6 we write another class  `Dog`, a specialization of animals. This will hold all the information about Dogs. 
  * The `Dog` class `extends` the `Animal` class, meaning that inherits all the data and methods from `Animal`. 
    * Hence a `Dog` has a name, that is defined on `Animal`
  * In order to create a `Dog` we will use the constructor, passing the `name` as before. But we will call the `super(name)` method and pass its name. This is how we call `Animals` constructor to set up the animal in the correct way. 
  * For example, a dog has a `paws` method that returns the number of paws
  * The `makeYourSound` method will return a string that represents how the Dog sound. Notice that Dogs always says `Woof`. An abstract `Animal` don't have a `makeYourSound` method since we don't know how those (abstract animals) sound. It doesn't make sense talking about sounds for animals, without knowing what type of animal it is.
*  Line 12 defines another specialization of `Animal` called `Bird`. 
  * It behaves like an `Animal` but has a specialization implementation of `makeYourSound` that makes it sound like a bird.
  * It also has a `beekLength` method that returns the length of the beek, which will be the same for all birds (that is strange but I ran out of imagination)

Let's use these classes and create a few concrete objects:

```javascript
const d = new Dog('Fido') 
console.log(d.makeYourSound()) // Logs: FIDO says WOOOF
console.log(d.paws()) // 4

const b = new Bird('Jacko') 
console.log(b.makeYourSound()) // JACKO says Tweet-tweet
console.log(b.beekLength()) // 2.5
```

We create an instance of the `Dog` class by using the `new` keyword, that will call the constructor passing `Fido` as the name of the Dog. The instance is called an object and we store it in a variable called `d`. There's only one` and has the name `Fido`. We can see that by calling the `makeYourSound()` method. 

The same behavior can be witnessed as we create a `Bird` object `const b = new Bird('Jacko')`. The `makeYourSound` method now returns the sound of the bird. 

Now, we know that everything inheriting from `Anmial` have a `getName` method so we can use that to our advantage. Let's create an array of `Animals`:

```javascript
const d = new Dog('Fido') 
const b = new Bird('Jacko') 
const animals = [d, b]
animals.forEach((a) => console.log(a.getName()))
// FIDO
// JACKO
```

Both `d` and `b` is `Animals` since they `extends` animals and we can safely use `getName` to logs their individual names.  

But even cooler is that we can use the `makeYourSound` method on both of the animals. They both have them and we don't need to care what kind (or type) of animal it is - as long as we know that it *has* a `makeYourSound` method. 

```javascript
animals.forEach((a) => console.log(a.makeYourSound()))
// FIDO says WOOOF
// JACKO says Tweet-tweet
```

Now it a behaves differently depending on what type it is, but our code doesn't care. This is called [Polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)). 

(Notice that since JavaScript (that the code is written in) doesn't have basic OOP features has overrides and interfaces the example is not complete, but showing a point.)

### Functional programming languages

Functional programming (FP) is oriented around functions that you pass data too. We strive to write immutable (once defined, unchangeable) data and pure (stateless) functions. Program is made up by composing many small functions into a larger whole.

FP is much older than OOP and dates back to the childhood of computer science (1950-is). Commonly used functional programming languages are JavaScript, Haskell and Erlang (or Elixir).

In FP our function operates on data (objects) and we seldom describe the template (classes) for such data. Function themselves are first class citizens and very often is passed as parameters to other functions, building so-called high-order functions (functions that take functions as parameters). 

#### An example

Again, an example might be useful:

```javascript
const dogPrinter = d => `${d.name} has ${d.paws} paws and says WOOF`
const birdPrinter = b => `${b.name} says tweet-tweet with her ${b.beekLength} cm beek`
const animalPrinter = a => {
  switch (a.type) {
    case 'Dog':
      return dogPrinter(a)
    case 'Bird':
      return birdPrinter(a)
  }
}
const animalSorter = (a, b) =>
  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1

```

(Yes, I'm using the [arrow function syntax](https://saltsthlm.github.io/protips/arrowFunctions.html) throughout my example - read up on it if it confuses you. Also, I'm not a fan of semi-colons where they are not needed. So I have not used them - sue me! :))

Let's go through the code line by line

* Line 1 creates a function called `dogPrinter` that returns a string representing a dog. 
  * The function presupposes that we will pass it data that has `.name` `.paws`. We will also *always* return 'WOOF'. Since this is the **dog** printer we can do that
  * Notice that it doesn't change any data and only operate on the data passed to it. If I send the same` to the function it will return the same result. This is what's known as a *pure* function
    * An unpure function would, for example, have returned the date of the day we ran the function. It would have changed between calls. 
* We then (line 2) create a `birdPrinter` that does similar things for birds. 
* Line 3 sets up an animal printer that checks the `.type` and then calls the correct print function. If you pass `animalPrinter` something that doesn't have a `.type` property or if the `a` passed to the function not is `Dog` or `Bird` it will fail.
* Line 11 creates an function called `animalSorter` that returns 1 if `a.name` is greater than `b.name`. This will be used to sort and tell us which of the animals (`a` or `b` ) that comes before another in an alphabetically sorted list. 
  * Notice that `animalSorter` needs data passed to it with `.name`-properties. It doesn't care if it is animals or not. Hence it could be called … name sorter or something like that. 
  * I am using the *ternary operator* to make the code into one single line. As the functionality of each function is very little, we often can make one-liners and then combine it into more advanced features

Let's use the functions and put them together. First, we need some data to operate on: 

```javascript
const animalList = [
  { name: 'Jacko', type: 'Bird', beekLength: 2.5 },
  { name: 'Fido', type: 'Dog', paws: 4 }
]

animalList
  .sort((a, b) => animalSorter(a, b))
  .map(a => animalPrinter(a))
  .forEach(el => console.log(el))
```

* The `animalList` is an array of animals. Notice that they are not formatted the same, but have some common properties, such as `name` and `type`
  * This is important since our functions are using them to do different things
* We run the functions in a chain operating on the array `animalList`
  * First we will sort the list by calling the `animalSorter` for each element.
    * `.sort` takes two parameters, two elements from the `animalList` and just call into the `animalSorter`
    * `.sort` will go through the entire array and call `animalSorter` for all the elements and create a new sorted array, according to the `animalSorter` rule
    * At the end `.sort` will return a new sorted array
  * Then we will get the sorted array and pass it to `.map`. 
    * `.map` takes an array and calls the function for each element to produce another, new array
      * `.sort` is actually a special version of `.map` (`.map` is a generic version calling a function for each element in an array, returning a new array)
    * We will call the `animalPrinter` function for each animal.
    * `animalPrinter` will return a string for each, meaning that `.map` will return an array of strings
  * We will use this array of string and pass each of those string to `console.log`, using the `.forEach` function 
    * The `.forEach` function that just executes a function per element but doesn't return anything.    



There's an even tighter way to call the functions above, that you might see. If all there parameters that a function takes are the same as the parameter of the calling function we can just write the name of the function. 

So this part:

```javascript
animalList
  .sort((a, b) => animalSorter(a, b))
  .map(a => animalPrinter(a))
  .forEach(el => console.log(el))
```

Could be written like this: 

```javascript
animalList
  .sort(animalSorter)
  .map(animalPrinter)
  .forEach(el => console.log(el))
```







Notice some of the functional paradigms in action here:

* Our small functions are composed into bigger, more advanced functions
* How the data is passed from function to function like water through a pipe
  * Notice that we don't change the data passed to the function but create new data that we return to the next function
* How each function is small and simple and also only depend on the data passed to it - hence it is pure. 
* Each function is very easy to test and reason about

### What type of language is JavaScript then?

From [Wikipedia](https://en.wikipedia.org/wiki/JavaScript) we can read:

> JavaScript has [curly-bracket syntax](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Curly-bracket_languages), [dynamic typing](https://en.wikipedia.org/wiki/Dynamic_programming_language), [prototype-based](https://en.wikipedia.org/wiki/Prototype-based_programming) [object-orientation](https://en.wikipedia.org/wiki/Object-oriented_programming), and [first-class functions](https://en.wikipedia.org/wiki/First-class_function).

and 

> As a multi-paradigm language, JavaScript supports [event-driven](https://en.wikipedia.org/wiki/Event-driven_programming), [functional](https://en.wikipedia.org/wiki/Functional_programming), and [imperative](https://en.wikipedia.org/wiki/Imperative_programming) (including [object-oriented](https://en.wikipedia.org/wiki/Object-oriented_programming) and [prototype-based](https://en.wikipedia.org/wiki/Prototype-based_programming)) [programming styles](https://en.wikipedia.org/wiki/Programming_paradigm).

This means … 

JavaScript is not really OOP but rather more FP. Meaning you can do most of the things needed to call it an FP-language but not all of it (pattern matching is lacking for example). 

You can do some of the OOP things too but it has an even poorer fit. 

Thinking in FP paradigms and patterns is most useful when doing JavaScript development. 

## Summary

Object-oriented programming (OOP) is built around the object that encapsulates data and methods that operate and change that data. We represent the problem we are working with as classes (templates for objects) that inherit functionality from each other. 

Functional programming (FP) is built around functions that operate on data. Functions are often passed as parameters to other functions (high-order functions) making up more advanced features from simpler. Functions should be stateless and operate on data passed to it (pure function). The functions should not modify the data passed to it but rather return new data (immutable).



I hope it's a bit more clear what the difference between the two paradigms are. If not, here's a lovely graphics that probably is a much better summary than I can do. It is from https://www.educba.com/functional-programming-vs-oop/ and is really good.

![Functional Programming vs OOP](https://cdn.educba.com/academy/wp-content/uploads/2018/07/Functional-Programming-vs-OOP.jpg)