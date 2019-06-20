# Using the proxy setting for React dev server

When we use `create-react-app` we get a very powerful development experience set up for us. Amongst other things a development server. This has a setting, in the `package.json` that is called `proxy`.

Every time we have used this in the courses we have run we have also got problems and have a hard time explaining it. Therefore I wanted to write a short little post describing how it works.

## Background

The problem we try to solve is this:

* Often we have both the client and the server running on our development machine, in two different servers using different ports. For example:
  * The back end server is running on http://localhost:8080
  * The front end server (the React stuff) is running on http://localhost:3000
* But it gets very strange if we have to hard code the complete URL or ports when we want to call from the front end to the back end.

  ```javascript
  // this is strange, right
  fetch('http://localhost:8080/products')

  // and this is also a bit clunky
  const url = process.env === 'DEV' ? 'http://localhost:8080/products' : 'http://www.production.com/products'
  ```

The solution a little setting in the `package.json` file of the front end application, called `proxy`, for example:

```json
"proxy": "http://localhost:8080"
```

## What does it do?

Quite simply - if you request something that is not in your React application (unknown resources), the React Development server will forward the request to the URL in the `proxy` setting in your `package.json`.

That means that if you make a request to `/css/styles.css`, the React will (probably) find a resource like that and serve it as normal.
But if you make a request to `/api/products`, React will not find that (probably) and instead, look at the `proxy` setting of the `package.json` file and forward the request to that.

## Gotcha!

There's a little gotcha that you might want to know. From the documentation:

> Any unrecognized request without a text/html accept header will be redirected to the specified proxy.

It means that if you test this from the browser it will not work since the browser sends GET requests with the `text/html` accept header.

## Example

Hopefully, this will all clear up with an example. Let's create a simple front-end and back-end and see it in action.

Let's create the initial structure and the empty front and back end applications. Find an empty directory somewhere and type along.

```bash
mkdir proxydemo && cd proxydemo
mkdir client server
cd client && npx create-react-app . && npm i node-fetch && cd ..
cd server && npm init -y && npm i json-server
```

Now let's make a very simple back-end api by using JSON server

* Add the following `start`-script in the server `package.json`

  `"start": "json-server --watch db.json --port 8080"`

* Add a `db.json` file with products (I've used the one below)

* It's done! Test your back end server with `npm start` and then head to http://localhost:8080/proudcts to see your products being returned.

Lovely - we now have a back end server running on http://localhost:8080/.

* Leave that running and start a new terminal window in the `client`-folder (`cd ../client`)
* Open the `package.json` file and add a `proxy` setting like this:
  * `"proxy": "http://localhost:8080"` - meaning
  > If you don't find resources I try to request, head on over to this location instead and you will find it there
* Start the React development server with `npm start`

We are done!

Let's test this out:

1. Open http://localhost:3000 and see your lovely empty front end application.
1. Open http://localhost:8080 and see your back end server running.

Everything works, but if we access http://localhost:3000/products - what should happen?

Well, we expect to get the products back from our back end server right.

But we don't. :( At least not in the browser. Remember that the browser is sending an `text/html` request.

Let's try without that header. Let's use curl and not set a header:

```bash
curl http://localhost:3000/products
```

YES! Default curl is not setting any header and hence we get the json back. The React Dev server catches our request, didn't find a resource called `/products` and didn't see the `text/html` accept-header and hence forwarded the request to the value configured in the `proxy` setting of the client `package.json`.

Let's make sure it fails too...

```bash
curl -H "Accept: text/html" http://localhost:3000/products
```

Yes! That returns the HTML page of the default React App because that's what happens when the request is sent with `text/html` as accept header.

### For real

Let's write some code using this as well so that we can see the real value of it.

* Open the `App.js`
* Add the following on top of the file

  ```javascript
  const fetch = require('node-fetch');
  ```

* In the `render` function, before `return` - add the following code

  ```javascript
  fetch('/products')
    .then(res => res.json())
    .then(json => console.log(json));
  ```

* Notice that I didn't have to write `http://localhost:8080/products` that will be proxied by the setting.
* Now open the console of the browser and see that we got our products printed to the console.

## Summary

The proxy setting of the React dev server is powerful since we can host the front end and back end servers on the machine, and we don't have to worry about hard coding server names (`localhost`) or ports (`8080`) into our code.

Instead, we can just access it as if it was on the same server `/products` and let the `proxy` guide us right.

What often trips us up is the fact that when we test this from the browser we hit a special rule, that requests with Accept-Header set to `text/html` are handled in a special way by the React Development Server.

### db.json

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
  },
  {
    "id": "4c1aa7d4-7531-11e8-86e5-f0d5bf731f68",
    "item": "Heat Sensitive Coffee Mug",
    "price": "12.99",
    "description": "This cool coffee will flow with color as you pour warm coffee into it."
  },
  {
    "id": "55bb6ef4-7531-11e8-86e5-f0d5bf731f68",
    "item": "Heart Shaped Tea Mug",
    "price": "18.55",
    "description": "These glass mugs are perfect for romantic tea in the mornings."
  },
  {
    "id": "5d3b9e7e-7531-11e8-86e5-f0d5bf731f68",
    "item": "Tiny Zip Knife",
    "price": "21.65",
    "description": "It’s always convenient to have a tiny knife with you. This is the most portable knife we have seen!"
  }
],
"carts": []
}
```
