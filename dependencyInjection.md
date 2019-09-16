**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# Dependency Injection

One pattern that we see again and again in our code is called Dependency injection. Although it sounds and looks a bit daunting at first, it's actually not that hard to understand and use.

## Dependency

I think it's easiest to start with an example. Here's a method that peforms a calculation of the saldo of all the accounts of a user

```javascript
function calculateSaldo(userName, getUser, getAccounts) {
  const user = getUser(userName);
  const accountsForUser = getAccounts(user.id);

  let saldo = accountsForUser.reduce((sum, account) => sum += account.balance, 0);
  // ... and thousands of lines more that makes tricky calculcations
  return saldo
}
```

In order to calculate this saldo we:

* need to get the user information from the database, by username (`const user = getUser(userName)`)
* then get the accounts for that user, using another function that takes a user id (`const accountsForUser = getAccounts(user.id);`)
* With the list of accounts we need to do a very complicated (not really ... but let's pretend) set of calculations to get the sum

The **real** business functionality is that last part, summarizing the balance on the accounts. However, in order to do this we depend on some other parts to supply us with the data for the calculation. The two functions are dependencies to us.

## Injection

Now, since I wrote the code to get the user and accounts I happen to know that it's very simple. In fact, we could have written it rigth in the `calculateSaldo` function if we wanted. Like this:

```javascript
function calculateSaldo(userName) {
  const user = userDb.find(user => user.name === userName);
  const accountsForUser = accountDb.filter(account => account.userid === user.id);

  let saldo = accountsForUser.reduce((sum, account) => sum += account.balance, 0);
  // ... and thousands of lines more that makes tricky calculcations
  return saldo
}
```

There are a couple of problems with this code:

* First the function is now responsbile for many things 1)It knows how to get users, 2) It knows how to get accounts for user ids, 3) it does the calculation
  We want functions to be responsible for one thing and one thing only - it's called the Single Responisiblity Prinicple
* Secondly how we get things from the database is now hardcoded into the function that calculate saldo. We cannot call `calculateSaldo` without having it do exactly what it does now. That makes testing the `calculateSaldo` much harder.
* Thirdly I cannot see the forrest for all the threes. In order to see the really (business) code I have to squint and see past the infrastructure code.

For these, and probably more, reasons we can *inject* the dependencies / things that `calculateSaldo` needs, in order for `calculateSaldo` do it's job.

Hence we can inject two parameters, the two functions that `calculateSaldo` needs, into the function. Which brings us back to the first example, like this:

```javascript
function calculateSaldo(userName, getUser, getAccounts) {
  const user = getUser(userName);
  const accountsForUser = getAccounts(user.id);

  let saldo = accountsForUser.reduce((sum, account) => sum += account.balance, 0);
  return saldo
}
```

## Hey hey hey ... Jakob had some kind of this and what-have-you

The example above is known as a function injection, where we inject the dependencies into a single function. A special, but common, way of that is what's known as constructor injection.

Let's mimic, in part, what we had in the `PlayerService` by creating a `CalculatorService` class. It has a constructor like this:

```javascript
function CalculatorService(userGetter, accountGetter){
  this.getUser = userGetter;
  this.getAccounts = accountGetter;
}
```

This constructor takes the two dependencies of the class as inparameters - we are *constructor injecting the dependencies* of `CalculatorService`.

When we are creating a new class we get an object (instance of the object) back. We are storing the dependencies on the instance by using `this`, `this.getUser = userGetter`, for example.

We can then use these dependencies by using `this` and the function we stored: `const accountsForUser = this.getAccounts(user.id);` for example.

Last part, in order to create this class we need to do `new CalculatorService`, like we are doing in the convince-method `create` that we are exposing outside the `CalculatorService`

```javascript
module.exports.create =
  (userGetter, accountGetter) =>
		new CalculatorService(userGetter, accountGetter);
```

Notice the use of `new` that is passing the parameters to the create function into the constructor.

Also notice that the `CalculatorService` knows (and cares) nothing about the dependencies we are passing to the constructor ...

Almost. Here is how we are using it:

```javascript
CalculatorService.prototype.calculateSaldo = function(userName) {
  const user = this.getUser(userName);
  const accountsForUser = this.getAccounts(user.id);

  let saldo = accountsForUser.reduce((sum, account) => sum += account.balance, 0);
  return saldo
}
```

See how we are using `this.getUser` to get hold of the method we stored in the instance variable, in the constructor.

So `CalculatorService` knows (and cares) nothing about the dependencies we are passing to the constructor... except that once we use it we:

* expect `this.getUser` to take a username and return the user
* expect the `this.getAccounts` to take a id parameter and return the accoutns for the user with that id.

How this is accomplished and implemented the `CalculatorService` couldn't care less about. Separation of concerns in actions.



Now if we want to use this we can do something like this, stiching all the parts together:

```javascript
const userGetter = require('./dependencies').getUserFromDb;
const accountGetter = require('./dependencies').getAccountsForUser;

const calc = require('./CalculatorService')
				.create(userGetter, accountGetter);

const marcusSaldo = calc.calculateSaldo('Marcus')
const jakobSaldo = calc.calculateSaldo('Jakob')
console.log(`Marcus has ${marcusSaldo}`);
console.log(`Jakob has ${jakobSaldo}`);
```

We use the `.create`-function on the `CalculatorService` and pass it the `getUserFromDb` and `getAccountsForUser` functions as dependencies for the class.

When we call the `.calculateSaldo` function it will use the dependencies that is injected into the constructor.

## Summary

I hope this made dependencies a bit more clear for you. I love to walk you through this if you want to.

