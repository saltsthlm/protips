# Export and import modules in ES6

In EcmaScript 6 there's a couple of new ways of importing and exporting modules that might look a bit different and unusual at first. It's really very simple once you get your eyes used to it. 

### Sidenote - running these examples

If you want to read the code - skip this. If you want to run it - do the following steps.

In order to run these examples, on Node, we need to use [Babel Node](https://github.com/babel/example-node-server). 

1. Create a `package.json` file with `npm init -y`

2. Install the babel-packages `npm install --save-dev babel-cli babel-preset-env`

3. Copy this

   ```json
   {
     "presets": ["env"]
   }
   ```

   Create a file with that content with `pbpaste > .babelrc`

4. Add a start script in the `package.json` like this: `    "start": "npx babel-node coolFuncsClient.js"` , using the namings in this example

5. Run the examples with `npm start`



## Default export - one per file

Imagine that we have a file with functions (`coolFuncs.js`) that contains the following: 

```javascript
function coolFunction() {return 'Pretty fly for a rabbi!'};

export default coolFunction;
```

Note that there can only be one thing exported `default` per module. 

That last part means that we can import it in another file (`coolFuncsClient.js`) like this:

```javascript
import funcs from 'coolFuncs';

console.log(funcs());
```

We can import this under whatever name I want;  `import f from 'coolFuncs'` would also work (calling it with `f()` in that case)

### Exporting classes

We can export stuff that is not a simple function too. For example like this

```javascript
class Person {

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getAge() { return this.age }
}

export default Person
```

In that case we can import and use it like this: 

```javascript
import Person from './coolFuncs';

const p = new Person('Marcus', 46);
console.log(p.get());
```

## Named exports

There can only be one export but there can be many named exports, in addition. 

I've added a few more functions to the original `coolFuncs.js`

```javascript
function coolFunction () { return 'Pretty fly for a rabbi!' };
export function coolerFunction () { return 'Just eat it!' };
export function coolestFunction () { return 'Living in an Amish paradise' };

export default coolFunction;
```

Notice that we have several exports before two functions, but only one `export default`



We can now import those functions using the names like this: 

```javascript
import f from './coolFuncs';
import { coolerFunction } from './coolFuncs';
import { coolestFunction } from './coolFuncs';

console.log(f());
console.log(coolerFunction());
console.log(coolestFunction());
```

Or, we can be fancy, and import everything on one line using EcmaScript 6 destructuring: 

```javascript
import f, { coolerFunction, coolestFunction} from './coolFuncs'

console.log(f());
console.log(coolerFunction());
console.log(coolestFunction());
```

That first part, outside the curly braces, is the default import that might or might not be there. 

## Summary - a React example

This type of exporting and importing happens a lot in modern JavaScript / EcmaScript 6. I hope you now understand what is going on better. 

As a final repetition - let's review some React code, that makes use of these features. Here's a fresh  `App.js` , created with `create-react-app`. I'm only including some parts of it, since just a few lines are interesting for this repetition:

```javascript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    // code here
  }
}

export default App;
```

* On line 1 we are importing `React` and then something called `Component`
  * `React` is outside the curly and hence a import of a `export default` the `react` package is exporting. 
    * We could have called it anything, but chose the name `React`, but `Mmmmmreact` would work just as good, as long as we are using that name to refer to the default exported functionality. 
  * We are also importing `Component` that is a named export from the `react` package
    * This has to be called `Component` and `Compontent` will fail miserably, since the `react` package doesn't expose anything called `Compontent`
    * Once this is imported we can use it in our code, see line 5 `class App extends Component {`, as an example. 
* On the very last line we, in our turn are `export default App` 
  * meaning that someone can import this with `import nameHere from './App'
  * This is what the React framework probably does before it starts to call the methods on our class, that pesky `render` method for example. 

I hope this makes this all a bit clearer. 

