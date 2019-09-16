**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# Destructuring

From ECMAScript 6 (ES6) we have a new powerful tool to our disposal **Destructuring**. It reminds me a little bit about a Jedi lightsaber as it's very simple but powerful, elegant almost. And potentially hurt you a lot if used the wrong way :)

Or in the words of master Obi-Wan

> ... lightsaber. This is the weapon of a Jedi Knight. Not as clumsy or as random as a blaster. An elegant weapon... for a more civilized age.

Let's try to wield it for fun and profit.

## Destructuring arrays

Consider the following array:

```javascript
const arr = ['Marcus', 'Hammarberg']
```

If we want to pick out the different parts of that array, we can use the old ways:

```javascript
const first = arr[0]
const last = arr[1]
```

But there's a much more elegant way - using destructuring:

```javascript
const [first, last] = arr
```

We are binding the elements of the array to the corresponding constants `first` and `last` using destructuring. Notice that position matters `const [first, last ] = arr` would work but not produce an unwanted result. Much like trying to shave with a lightsabre.

We can actually bind to anything that is assignable if we wanted:

```javascript
let user = {};
[user.firstName, user.lastName] = arr
console.log({ user })
// { user:
//   { firstName: 'Marcus',
//     lastName: 'Hammarberg'
//   }
// }
```

(Note that wickedly cool [console log formatting](https://saltsthlm.github.io/protips/console.html))

In fact, we can even supply default values if important information was missing:

```javascript
const halfAnArr = ['Marcus']
const [firstName = 'Mies', lastName = 'Hammarberg'] = halfAnArr
console.log(firstName) // Marcus - not Mies
console.log(lastName) // Hammarberg - that was not supplied
```

Now, 'Hammarberg' will always be set as the last name, even though I didn't supply anything. What would be the name for an empty array (`const [firstName = 'Mies', lastName = 'Hammarberg'] = []`)

### The rest of the array

But what our array had more elements than the ones we picked out. Let's revisit the array again and add another element to it:

```javascript
const arr2 = ['Marcus', 'Carl', 'Hammarberg']

const [first2, last2] = arr2
console.log(first2) // Marcus
console.log(last2) // Carl?!
```

Destructuring arrays will only pick out the elements in the positions that you have given values `[first2, last2]`.

To fix this we can simply omit the elements we are not interested in:

```javascript
const arr3 = ['Marcus', 'Carl', 'Hammarberg']

const [first3, ,last3] = arr3
console.log(first3) // Marcus
console.log(last3) // Hammarberg
```

But what if we wanted the rest of the elements then? That's is actually easy using the rest/spread operator (`...`)

```javascript
const arr4 = ['Marcus', 'Carl', 'Hammarberg']
const [firstOfTheNames, ...theRestOfTheNames] = arr4
console.log(firstOfTheNames) // Marcus
console.log(theRestOfTheNames) // [ 'Carl', 'Hammarberg' ]
```

There's a lot of awesome stuff with destructuring arrays. But let's see what we can do around objects

## Destructuring objects

Consider the following object:

```javascript
const person = {
  firstName: 'Marcus',
  lastName: 'Hammarberg',
  languages: [
    'Swedish',
    'English',
    'Indonesian',
    'JavaScript'
  ],
  sayHi: (name) => `Hi ${name}`
}
```

We can now, armed with our elegant weapon destructuring, pick this apart like this:

```javascript
const { firstName, lastName } = person
console.log(firstName) //Marcus
console.log(lastName) //Hammarberg
```

Notice that in this case, the order doesn't matter, as it did with the array. Here we are using the name of the properties. So this works as well

```javascript
const { lastName, firstName } = person
```

And this will fail since there's no property named `name`:

```javascript
const { name } = person
console.log(name)
```

Actually, it will not fail, but rather produce an `undefined` value for name.

We can actually change the name of the variables that we pull out if we want

```javascript
const { firstName: fName, lastName: lName, languages: langs } = person;
console.table(langs)
console.log(fName)
console.log(lName)
```

Notice that the local name, the name of the constant we creating, is placed last.

Obviously, we can import other things than simple properties. Look here for example:

```javascript
const { languages } = person
const { length } = languages
console.table(languages)
console.log(`The languages array has ${length} languages`)
```

First, we pull out the `languages` array to a separate constant, but from that, we pull out the value of the `languages.length` property too.

### Rest and spread

Just as with arrays we can use the spread operator (`...`) for objects. It's actually very versatile and flexible.

```javascript
const { firstName: f, lastName: l, ...personWithoutName } = person
console.log(f)
console.log(l)
console.log(personWithoutName)
```

Now we get the properties `f` and `l` destructed from the `firstName` and `lastName` but we also get a new object with all other properties (the rest of the properties, hence the rest operator `...`) to a constant called `personWithoutName`

This can be very useful since it means that we can easily make copies of the whole object in a simple statement:

```javascript
const copyOfPerson = { ...person}
```

But we can also create augmentations, and shape our result to write some very powerful statements in a few lines of code:

```javascript
const { sayHi: hi, ...personDataWithAge } = { age: 46, ...person }
console.log(personDataWithAge)
```

* On the right side we are adding an extra property by prepending it to the object.
* Also on the right side, we are copying all the properties of `person` using the `...` spread/rest operator
* Then on the left side, we are picking off the function
* And then spreading the rest of the values to a new object `personDataWithAge`

This together will produce a nice little way for us to shape a new object, with only the data properties we care about:

```json
{
  age: 46,
  firstName: 'Marcus',
  lastName: 'Hammarberg',
  languages: [ 'Swedish', 'English', 'Indonesian', 'JavaScript' ]
}
```

### Imports

Finally, we can pull out functions to separate constants too:

```javascript
const greeter = {
  sayHi: (name) => `Hi ${name}`
}
const { sayHi } = greeter
console.log(sayHi('Marcus')) // Hi Marcus
```

In fact, this is probably the most common place to see destructuring in action, when importing functionality from a separate library:

```javascript
import { Component } from 'react';
```

Will import the `Component` class and all it's functionality to a constant called ...`Component`

There's a whole [separate blog post on imports and exports](https://saltsthlm.github.io/protips/exports.html) so I will only mention that here.
