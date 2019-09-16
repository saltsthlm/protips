**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# Classes in ECMAScript 6

JavaScript is a [functional programming language](https://en.wikipedia.org/wiki/Functional_programming) meaning that functions and objects are at the core of everything we do. We write small (hopefully) functions that operate on data in the object to create bigger programs.

To get the age of a person we would write something like:

```javascript
function getPersonAge(person) {
    return person.age;
}

const p = { name: 'Marcus', age: 46};
console.log(`Marcus is ${getPersonAge(p)} years old`);
```

(Put this in a file `fpPerson.js` and run it with `node fpPerson.js`)

Notice how the `getPersonAge` takes a person *object* as a parameter and will fail when you pass it anything that doesn't have a `.age`  field defined on it.



Another type of language is [object oriented programming language](https://en.wikipedia.org/wiki/Object-oriented_programming) where classes are at the centre of everything we do. Here we create classes (types) that encapsulate the data and operations we can do on that data.

In an object-oriented fashion we would write something like this:

```javascript
class Person {

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getAge() { return this.age }
}

const p = new Person('Marcus', 46);
console.log(`Marcus is ${p.getAge()} years old`);
```

(Put this in a file `ooPerson.js` and run it with `node ooPerson.js`)

Here we can see that how the name and age are *stored* inside the class (on the  `this.age` field, for example). There's no way to get hold of `this.age` from the outside, other than to call the `getAge()` method.

(Actually ... that last part is a lie. You can refer to `p.age` since JavaScript cannot declare private members - but you **should not**. The whole purpose of classes is to encapsulate the access to the members through a well-defined interface. )

## Classes and objects - what is the difference?

Ok at this point you should be confused about the difference between object and class.

* An class represent a type of objects. For example, Marcus is a type of Person. He is of the class Person. You can easily make new instances of Person by using `new Person()` passing it other parameters.
* The object `p`, in the second example above, represents an instance of the Person class called Marcus.

### JavaScript only has Object - no classes

You don't need to read this. It's for deeper understanding. I will end this paragraph with a plea to you forget this part.

JavaScript has basically doesn't have classes, but only objects. The `class` keyword is actually just syntactic sugar to create copies of *objects* and their methods. The traditional JavaScript way to handle this is through something called prototyping, which is beyond the scope of this post.

Let's bring it home with an example. **Classes in ECMAScript 6 is just syntactical sugar**. Instead of writing this:

```javascript
var Person = (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    Person.prototype.getAge = function () { return this.age; };
    return Person;
}());
```

we can write something much tighter and more descriptive:

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getAge() { return this.age }
}
```

The second example will get translated to the first example at runtime, by JavaScript (or a transpiler)

Perfect - now that you know this, you can forget about it and just use classes. Let see how.

## How to create new objects from classes

Good to have you back. Let's see how to use objects

### Constructor

In order to create a new object (aka an instance of a class) we are using the keyword `new`, like this `const p = new Person('Marcus', 46);`.

When `new` is called a special method called the constructor is called. In JavaScript, this method is also named `constructor`. Every class has one even if you define one or not. So this class has a constructor too:

```javascript
class Dog {}
```

JavaScript will create an empty constructor if you don't define it. The class above, could, in other words, look like this

```javascript
class Dog {
    constructor() {

    }
}
```

A constructor is a good place to set up the instances that get created and store it in members of the class. We did that with the `Person` class before, like this:

```javascript
class Person {

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
```

### Class-level methods

A class can / should have methods to access the data on the object we create from the class.

These are just normal JavaScript functions, with a few special rules. Here's the example from before again:

```javascript
class Person {

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getAge() { return this.age }
}
```

The `getAge()` method is now part of the class. When we create a new instance `const p = new Person('Marcus', 46);` the returned object has a function called `getAge()` that we can call using dot notation: `p.getAge()`



The methods on the class are created using [shorthand method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) meaning that you don't need to include the word `function` nor arrows and stuff. Also, you don't separate different methods, in classes, with commas, as you would do when you define objects.

### Inheritance with extends

One of the really cool things about object-oriented programming is that you can inherit functionality from one class to another. This is done (or rather fixed with a syntactic sugar wizardry) in JavaScript using `extends`.

Let's do an age-old example of animals. Here's a class called Animal

```javascript
class Animal {
  constructor(name) { this.name = name; }

  getName() { return this.name }
}

```

It encapsulates the name of each animal that we then can get via the method `getName`.

So when we create another class of animals, `Cat` we already have the `getName()` method defined - by just extending the class

```javascript
class Cat extends Animal {
  constructor(name) { super(name); }
}

const figaro = new Cat('Figaro');
console.log(figaro.getName()); // prints 'Figaro'
```

But we can also replace (aka override) the functionality of `getName` by giving a new implementation. Here's a class, `Dog` that obviously also track the length of the tail (that is super important for Dogs, as we all know):

```javascript
class Dog extends Animal {
  constructor(name, tailLength) {
    super(name);

    this.tailLength = tailLength;
  }

  getName() { return `${this.name} (${this.tailLength})` }
}

const fido = new Dog('Fido', 0.54);
console.log(fido.getName()); // prints 'Fido (0.54)'

```

The cool part here is that depending on what each object *is* (a Dog or a Cat in this case) it will pick up the correct implementation of `getName` for that class.

By extending classes ( `React.Component` for example) the objects we create can become very rich, advanced objects in just a few lines of code:

```javascript
class App extends React.Component {}
```

means that App now has everything that is defined in the `React.Component` class.

### super

This you see the super cool function name `super`? That just means that we call the constructor of the super-class, the class we are extending.

We don't **have** to do this, for all classes that are extending another class, but if we need to do that it has to be the first thing we do.

Also, it's considered good practice since the superclass constructor probably does some initialization of the object created. If we don't all `super` in our constructor we need to take responsibility for all that initialization being done correctly.

## Summary

Classes in ECMAScript 6 is a way to create an encapsulated unit of functionality and data. This feature doesn't make JavaScript object-oriented but should rather be viewed as syntactical sugar on top of JavaScript functional features.

We will be using classes a lot, since all [React](https://reactjs.org) components are classes, so knowing and understand the basis of them is a good idea.



