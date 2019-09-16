**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# Convention over configuration … and a word about WebPack

As developers we are, nowadays, using a lot of frameworks and tool to build our applications. Developing has more and more become stitching together applications rather than writing the basic functionality from scratch.

And Thank God for that. This is one of the reasons that we confidently use [npm packages]([http://npmjs.com](http://npmjs.com/)) such as [React](https://www.npmjs.com/package/react) or [Express](https://www.npmjs.com/package/express) and hence focus on the code that makes a difference for us.

Naturally, most tools can be configured, tweaked and changed in many ways, to support our specific needs. This blog post talks, generally, about an approach to making these configurations using conventions. And then how the tool WebPack uses this approach.

## Convention over configuration

Many of the tools that we are using have many, sometimes hundreds or thousands, configuration parameters that can be set and changed. This is great because it gives us a lot of flexibility.

But that is also bad because it means that we need to firstly know/learn about all these parameters and secondly set them to something useful for us.

Therefore many of the parameters have sensible defaults that allow us to not set a value for that particular configuration parameter.

Some tools have even taken this further and only use the default values, allowing you to supply no configuration at all. Only defaults.

This is called [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration). Meaning that as long as you follow the conventions that the toolmakers have made you can trust that the tool does the correct thing. Many tools (and [WebPack is one of them](https://medium.com/@hpux/webpack-4-in-production-how-make-your-life-easier-4d03e2e5b081) is one of them) is trying to do zero-configuration so that you can just use the tool. Given that you are following the conventions...

### An made-up example

For example; imagine a tool that will minimize your source code. We could, by configuration, require that the user send the folder where the source code resides, like this:

```javascript
const miniMe = require('marcus-fake-minimiser')

miniMe.minimize({
  input: {
    folder: './src'
  }
})
```

Or we can just have a *convention* that says that the source code always resides in a folder called `src` in the folder where we are running the tool. This would instead give us the following code, to create the same output.

```javascript
const miniMe = require('marcus-fake-minimiser')

miniMe.minimize()
```

Boom! Smaller, leaner and clearer. But… the flip-side is obviously that we now need to *know* that convention.

## WebPack - a tool that uses conventions over configuration

The WebPack tool is a

> is a *static module bundler* for modern JavaScript applications. When WebPack processes your application, it internally builds a [dependency graph](https://webpack.js.org/concepts/dependency-graph/) which maps every module your project needs and generates one or more *bundles*.

Needless to say, there are many, many configuration options for this tool.

However, as the [documentation says here](https://webpack.js.org/configuration/):

> Out of the box, WebPack won't require you to use a configuration file. However, it will assume the entry point of your project is `src/index` and will output the result in `dist/main.js` minified and optimized for production.

So the convention here is that the starting point for our application is `src/index` and the rest of the application's files are `required`  from this point. Also, by convention, the output of WebPack (after it's done all that is supposed to do; minify, uglify and preprocess and what have you) will end up in a single file called `dist/main.js`.

### Convention file structure for WebPack

The convention layout of the application looks like this:

```bash
dist
 |
  --- main.js
src
 |
  --- index.js
public
  |
   --- my-cool-styles.css
   --- my-cool-image.png
index.html
```



By following these conventions we can write very simple scripts like these:

```json
"scripts": {
  "build": "webpack .",
  "dev": "webpack-dev-server ."
}
```

Notice how both the WebPack build tool and the dev server is using the same (configuration-file-less) conventions.


### Changing convention

Naturally, we might want to change some parts of the conventions, for example adding a loader. But with the conventions in place, we only need to add the configuration that deviates from these conventions.

That means that we **will** add a configuration file and, in that file, only the things that deviate from convention.

```json
"scripts": {
  "build": "webpack --config prod.config.js"
}
```

And then the file `prod.config.js` might look like this:

```javascript
const path = require('path');

module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://localhost:4000'
    },
  },
}
```

If you take a look at the [configuration file options documentation](https://webpack.js.org/configuration/#options) you will find all the configuration options. But we only need to add the configuration that deviates from the convention. In this case, we are serving the backend API on port `4000` instead of `3000` that is the default. Hence we need to add the configuration.

### A word on webpack-dev-server

There are two tools in use above;

- `webpack` that builds, minifies and moves the ready files to the `dist` folder.
- `webpack-dev-server` that gives a development time server. It keeps the `dist` folder in memory and does NOT create the `dist` folder on disc.

## Summary

Convention over configuration is a very powerful approach to configuring our tools that means that we don't need to explicitly spell out every setting. Instead, we learn and follow the conventions over our tools and only specify the deviations from the conventions.

### Extra - testing the power of conventions

Let's see the power of conventions in action. Find a suitable directory and execute the following script:

```bash
mkdir webpacktest
cd webpacktest
npm init -y
npm i webpack webpack-cli webpack-dev-server
mkdir src
mkdir public
echo "alert('</salt> rocks!')" > src/index.js
echo "* { background: hotpink }" > public/main.css
echo "<link rel='stylesheet' href='/public/main.css'> \
<script src='/main.js'></script>" > index.html
```

This sets up a very simple, but according to WebPack conventions, well-structured application.

We can now build the javascript bundle, using this command:

```bash
./node_modules/.bin/webpack -p
```

If you look a `dist` folder has been created and in it, there's a `main.js` that is minified and ready to be deployed to production. Notice that the `index.html` and the `public` -folder is not automatically moved to the `dist` folder. This needs some configuration in a config file.

We can also open a development server using this command:

```bash
./node_modules/.bin/webpack-dev-server --open
```

Without any configuration files.