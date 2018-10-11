# Crafting Readable Code

## Setting the stage
Suppose we are developing a module in some system. 
The module we are developing is using some service to fetch a collection of some sort.
Then it refines the data according to some business rules. 
Finally it is publishing this data as an event on some event stream.
Exactly what these things are or how they are implemented is not important. 
Let's concentrate on how we write the code in our module.

## The first draft
Of course we are developing this code using TDD practices. 
Suppose we have implemented all the functionality we are supposed to do and all our tests are passing the test suite.
The code now looks like this:

```javascript
var service = require('./service');
var emitter = require('./emitter');

function publish() {
  var collection = service.getAll(); 
  var action = collection.action;
  var ids = [];
  collection.forEach(function (item) { // get the ids
    // console.log(item);
    if (!item.role === 'admin' || !item.package === 'premium') {
      ids.push('N/A');
    } else { ids.push(item.id); }
  });
  // publish event to location
  emitter.publish(collection.location, {
    id: ids,
    action: action
  }, function(err) { throw err; });
}

module.exports.publish = publish;
```

### Are we done?
No. No we are not done. This code has several problems. 

First of all, it is using vars all over. Well, that's easy to refactor, but this code has bigger problems than that.
__It is not readable!__


## Breathe!
The biggest problem with this code is that it is very compact, so let us fix that.

```javascript
const service = require('./service');
const emitter = require('./emitter');

function publish() {
  const collection = service.getAll(); 
  const action = collection.action;

  const ids = [];
  collection.forEach(function (item) { // get the ids
    // console.log(item);

    if (!item.role === 'admin' || !item.package === 'premium') {

      ids.push('N/A'); 

    } else { 

      ids.push(item.id);
    }
  });

  // publish event to location
  emitter.publish(collection.location, {
    id: ids,
    action: action
  }, function(err) { 
    throw err; 
  });
}

module.exports.publish = publish;
```

This is much better. You can actually read and understand this code without suffocating - good.
However, this code is still not very good.
There are three comments in this code and none of them is justified.
The out commented debug print is obvious, but the other two comments should also be removed immediately.
They are completely unnecessary.

## Clean code

With all the comments removed and replaced by properly named functions, this code has become acceptable.
We could stop here if we wanted. Go grab a coffee and be happy.

```javascript
const service = require('./service');
const emitter = require('./emitter');

function findIds(collection) {
  collection.map(item => {
    
    if (!item.role === 'admin' || !item.package === 'premium') {

      return 'N/A';

    } else { 

      return item.id;
    }
  });
}

function publishEventTo(location, data, errorHandler) {
  emitter.publish(location, data, errorHandler);
}

function errorHandler(err) {
  throw new Error('Could not publish event', err);
}

function publish() {
  const collection = service.getAll(); 
  const action = collection.action;
  const ids = findIds(collection);

  const data = {
    id: ids,
    action: action
  };

  publishEventTo(collection.location, data, errorHandler);
}

module.exports.publish = publish;
```

## Crafting good code
But let's not stop there. There are still things we can improve. 
Take a look at the if statement. It is using two negative comparisons and an `OR` statement.
That is a language construct that is often difficult to reason about. But the fix for that is easy. 
According to boolean algebra, this is equivalent to turning the negative comparisons to positive and using an `AND` statement.
We will also break that out into a function so that it reads more like plain English.

```javascript
const service = require('./service');
const emitter = require('./emitter');

function isAdminAndPremium(item) {
  return item.role === 'admin' && item.package === 'premium';
}

function findIds(collection) {
  return collection.map(item => {
    
    if (isAdminAndPremium(item)) {

      return item.id;

    } else { 

      return 'N/A';
    }
  });
}

function publishEventsTo(location, data, errorHandler) {
  emitter.publish(location, data, errorHandler);
}

function errorHandler(err) {
  throw new Error('Could not publish event', err);
}

function publish() {
  const collection = service.getAll(); 
  const action = collection.action;

  const ids = findIds(collection);

  const data = {
    id: ids,
    action: action
  };

  publishEventTo(collection.location, data, errorHandler);
}

module.exports.publish = publish;
```

Now look at this! This is well written code. It is both easy to read and easy to reason about. 
Also, there are no comments, that will rot and become completely misleading after a few iterations.

## Getting functional
The code above is well written and there is no need to refactor more.
However, especially experienced programmers, would probably find it even more readable and robust if it was more functional.
Let's make it a little more functional!

```javascript
const service = require('./service');
const emitter = require('./emitter');

const isAdminAndPremium = item => 
  item.role === 'admin' && item.package === 'premium';

const findIds = collection =>
  collection.map(item => isAdminAndPremium ? item.id : 'N/A');

const publishEventTo = (location, data, errorHandler) =>
  emitter.publish(location, data, errorHandler);

const errorHandler = err => {
  throw new Error('Could not publish event', err);
}

function publish() {
  const collection = service.getAll(); 
  const action = collection.action;
  const ids = findIds(collection);

  const data = {
    id: ids,
    action: action
  };

  publishEventTo(collection.location, data, errorHandler);
}

module.exports.publish = publish;
```

Look! Short and concise, yet readable.

If this last step was an improvement or not is in the eye of the beholder. An experienced programmer would probably say yes. 
However, it could be a little more alien to somebody who has just started out.
