**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# json-server

## Nested Routes

Say we have a database with `Products` and `Carts`. Now, say we want to add a `Products` as an `Item` to a cart by a POST request.
You can achieve that with _custom routes_.

### Set the stage

First we create our initial database with some products in a JSON file. Let's call it `db.json`:

```json
{
  "products": [
    {
      "id": "2f81a686-7531-11e8-86e5-f0d5bf731f68",
      "item": "Keychain Phone Charger",
      "price": "29.99",
      "description": "This keychain lightning charger comes with a plug so you’ll be able to charge anywhere with an outlet. Great for the traveller on the go who always needs their phone."
    },
    {
      "id": "39ac2118-7531-11e8-86e5-f0d5bf731f68",
      "item": "Coffee Mug",
      "price": "11.80",
      "description": "Classic white coffee mug."
    },
    {
      "id": "4262b2c2-7531-11e8-86e5-f0d5bf731f68",
      "item": "Coffee Mug",
      "price": "11.80",
      "description": "Classic red coffee mug."
    }
  ],
  "carts": [
  ],
  "items": [
  ]
}
```
Notice how I also created `carts` and `items` in the schema. This is, with some custom routing, is the key.

Now, let's start the server and convince ourselves that the database is working. Start the server in one terminal `npx json-server --watch db.json --port 8080`.
Then to a GET request to fetch all the products `curl http://localhost:8080/products`. You should now see a list of all the products in the response.

### Create a new Cart

Creating a new cart is as easy as doing an empty POST request on the carts resource: `curl -XPOST http://localhost:8080/carts`

You should get the new cart (including) and id in the response. If you examine your database, it should look something like this
```json
{
  "products": [
    {
      "id": "2f81a686-7531-11e8-86e5-f0d5bf731f68",
      "item": "Keychain Phone Charger",
      "price": "29.99",
      "description": "This keychain lightning charger comes with a plug so you’ll be able to charge anywhere with an outlet. Great for the traveller on the go who always needs their phone."
    },
    {
      "id": "39ac2118-7531-11e8-86e5-f0d5bf731f68",
      "item": "Coffee Mug",
      "price": "11.80",
      "description": "Classic white coffee mug."
    },
    {
      "id": "4262b2c2-7531-11e8-86e5-f0d5bf731f68",
      "item": "Coffee Mug",
      "price": "11.80",
      "description": "Classic red coffee mug."
    }
  ],
  "carts": [
    {
      "id": 1
    }
  ],
  "items": [
  ]
}
```

### Custom routing
Json-server is only setting up routes 1 level deep by default. But you can go around this limitation with some clever custom routing.

Create a new JSON file for your routes. Let's call it `routes.json`.
```json
{
  "/carts/:cartId/items/:itemId": "/items/:itemId"
}
```

What we do here, is that we are setting up a proxy that redirects all items below the `Carts` resource to the `Items` resource.
Json-server is clever enough to understand this and insert a reference id when you post on this resource.

Let's restart our server like so `npx json-server --watch db.json --routes routes.json --port 8080`

#### Starting as node module

If you start your json-server as a node module instead, you can add custom routing by using the rewrite middleware that comes bundled with json-server.
```javascript
// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.use(jsonServer.rewrite({"/carts/:cartId/items/:itemId": "/items/:itemId"}));
server.listen(3000, () => {
  console.log('JSON Server is running')
})
```

### Add Products (Items) to the Cart

To add a couple of items to the cart, the most basic example would be two POST requests like so
`curl -XPOST http://localhost:8080/carts/1/items -H 'content-type: application/json' -d'{"item": {"id": "4262b2c2-7531-11e8-86e5-f0d5bf731f68"}}'`
`curl -XPOST http://localhost:8080/carts/1/items -H 'content-type: application/json' -d'{"item": {"id": "39ac2118-7531-11e8-86e5-f0d5bf731f68"}}'`

What's in our `Items` resource now? Let's find out!
`curl http://localhost:8080/carts/1/items`

```json
[
  {
    "item": {
      "id": "4262b2c2-7531-11e8-86e5-f0d5bf731f68"
    },
    "cartId": "1",
    "id": 1
  },
  {
    "item": {
      "id": "39ac2118-7531-11e8-86e5-f0d5bf731f68"
    },
    "cartId": "1",
    "id": 2
  }
]
```

Unfortunately, you will still only get the cartId when you query the carts resource, but hey... this will take you quite far for a few minutes of work!
