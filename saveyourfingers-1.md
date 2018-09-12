*Save your fingers - lesson 2 - NPM*

We are programmers. We type a lot. Let's save our fingers and make the precious keystrokes we do, count!

There's quite a lot of shortcuts to be found in the `npm` command. Here's a few that I've found very useful:

* `npm install` can be abbreviated to `npm i`
* `npm run-script` can be abbreviated to just `npm run` (y'all probably did that already)
* Running tests is a very common script. Hence you don't need to use `run`. The full abbreviation phase is this:

  * `npm run-script test` can become `npm run test` and can become
  * `npm run tst` or `npm run t` and finally
  * `npm t`
* Similary the `npm run-script start`  doesn't need the `run` part either and can become `npm start`

*PS*
Bonus tip, that isn’t really about writing less but could be handy: reinstall and make a new installation by going: `rm -rf node_modules && npm i`

In other words - remove the `node_modules` (and it’s subfolders) and then install the packages again.