# LowDb and some application design

When developing applications we sometimes need a quick little database to store small amounts of data in. For example when we are creating a prototype or first iterations of our application, or if the data will never be a lot like configuration data.

There are a few tools and frameworks that we can use for this; [DiskDb](https://www.npmjs.com/package/diskdb) or [LowDb](https://www.npmjs.com/package/lowdb).

This post will talk about LowDb and show you how to use this, but also show you how to think about using external frameworks/tools in a way that we can grow into it later.

First things first - let's store some data into a file.

## Storing data in a json file

This is pretty simple actually:

* Create a new application (`npm init -y`) with an `index.js` file
* Install LowDb (`npm i lowdb`)
* Create a file for our code `touch index.js`
* and a file that will be our database `touch db.js`

There! We are now ready to write some code.

### Setting up LowDb to use a json-file
First we need to tell LowDb that it should use a file as database and which file that is:

```javascript
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
```

Then we can tell LowDb about some collections that we are interesting to store data about. In this case, let's build a database for a blog, so we need posts and a user:

```javascript
db.defaults({ posts: [], user: {} })
  .write()
```

### Adding data

Adding data to the post-collection is now very simple:

```javascript
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()
```

If we check the `db.json` file now (`cat db.json`) we can see the post being added into its structure.

```json
{
  "posts": [
    {
      "id": 1,
      "title": "lowdb is awesome"
    }
  ],
  "user": {}
}
```

By the way, we can add many objects... before we call `.write()` that will write it to the database

```javascript
db.get('posts')
  .push({ id: 2, title: 'lowdb is awesome', published: true, views: 5 })
  .push({ id: 3, title: 'lowdb is awesome again', published: true, views: 53 })
  .push({ id: 4, title: 'lowdb is awesome three times', published: true, views: 25 })
  .push({ id: 5, title: 'lowdb is awesome GRRRRRREAT', published: true, views: 50 })
  .write()
```

For the user, it's only one object and not an array and we are using a different syntax to change, rather than append to that object:

```javascript
db
  .set('user.id', 123)
  .set('user.name', 'Mies')
  .set('user.title', 'Global Head of IT')
  .set('user.adress.street', 'At the office')
  .write()
```

### Querying
Now that we have data stored, let's get it back out...

Here's how we will get all posts and all posts with a `title` equal to `</salt> is awesome`:

```javascript
db.get('posts').value()
db.get('posts').filter({ title: '</salt> is awesome' }).value()
```

And here is an advanced query to get the top 3 published post, sorted by number of views

```javascript
const top3 = db.get('posts')
  .filter({ published: true })
  .sortBy('views')
  .take(3)
  .value()
```

### Updating
If we want to change posts we can use `.assign()` - here's a query that updates all the posts with `title` of `</salt> is awesome`

```javascript
db.get('posts')
  .find({ title: '</salt> is awesome' })
  .assign({ title: 'School of applied technology'})
  .write()
````

### Remove
Finally we can remove items using `.remove()`. For example, here I am removing all documents, as an inititial clean up:

```javascript
if (db.has('posts').value()) {
  db.get('posts').remove({}).write()
}
```

We can obviously remove only the items that are matching criteria too. Let's remove all entries that have the title `lowdb`:

```javascript
db.get('posts').remove({title: 'lowdb'}).write()
```

## Changing the adapter
This all well and good but we are not limited to only using files as storage. And switching between to another storage form is very simple.

Let's keep our database in memory instead. This is how sessions are stored in many web servers, for example.

This is the only thing we need to do:

```javascript
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')

const adapter = new Memory()
const db = low(adapter)

// ... rest of the file is the same
```

Pretty cool - now we can do in-memory databases instead, without changing the rest of the code.

For example; we could use file or in-memory depending on which environment we are running in

```javascript
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')

const db = low(
  process.env.NODE_ENV === 'test'
    ? new Memory()
    : new FileSync('db.json')
)
```

## A word on design
This is pretty awesome but also begs a thought on system design. It feels like changing the underlying storage and getting the information are not really the same thing.

We should try to keep things that are related, functional-wise, together. So that each module/file has one reason to change. This is known as `Separation of concerns`.

Imagine, if you will, that we are writing tests for our database interaction. Note that this could be a back-end server or something else, a test is just an example.

The tests really just want to concern itself with WHAT we are doing (`get top 3 viewed blog posts`), the database code with HOW we are getting the information and finally another part should be concerned with which type of storage we are using.

Let's write that, here's my test

```javascript
/* global before, describe, it */
const dbClient = require('./sov.db.js')
const db = require('./sov.db.infra.js').db()
const assert = require('assert')

describe('showing of separation of concerns', () => {
  before(() => {
    process.env.NODE_ENV = 'test'
  })

  it('should return top 3', () => {
    // ARRANGE: insert test docs
    dbClient.addPost(db, { title: 'A', views: 1 })
    dbClient.addPost(db, { title: 'B', views: 2 })
    dbClient.addPost(db, { title: 'C', views: 3 })
    dbClient.addPost(db, { title: 'D', views: 4 })

    // ACT: get result
    const top3Posts = dbClient.getTopViewedPost(db, 3)

    // ASSERT: check the result
    assert.equal(top3Posts.length, 3)
    // and more checks as needed
  })
})
```

The infrastructure for the database is in the `sov.db.infra.js` file and basically just exposes a single function to set up the database for us.

```javascript
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')

module.exports.db = () => {
  const db = low(
    process.env.NODE_ENV === 'test'
      ? new Memory()
      : new FileSync('db2.json')
  )

  db.defaults({ posts: [], user: {} })
    .write()

  return db
}
```

Finally the actual database access code `sov.db.js` is not clean and easy like this:

```javascript

module.exports.addPost = (db, post) => {
  db.get('posts')
    .push(post)
    .write()
}

module.exports.getTopViewedPost = (db, numberToGet) => {
  return db.get('posts')
    .filter({})
    .sortBy('views')
    .take(numberToGet)
    .value()
}
```

Notice:
* the test (code using the database) doesn't know HOW to access the database, nor what kind of database is being used (in memory or file)
* the database access code (`sov.db.js`) is very simple and clear and doesn't care what kind of database is being used
  * the database gets send to it. In this case in each function call
* the infrastructure code is only concerned with how the infrastructure is handled (where is the file located, what kind of database should be used when etc)