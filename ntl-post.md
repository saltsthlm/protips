**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# NTL - a wizard for scripts

The `package.json` file is at the heart of almost all our applications and it can sure be a beast to tame. It contains a lot of meta data about our application but one thing that is particular interesting and useful is the `scripts
` -node.

The scripts defined in there are availble for us to run using `npm run {name of script}`. For example: `npm run test` runs the script defined in `package.json => scripts => test`-node. You have already used it many times already, to run tests, start application etc.

If you are anything like me you might forget what these scripts are named. I wanted to share two handy tips that will help you see that.

1) in the root of the project (where the `package.json`-file is located) go `npm run`. This will just list all the scripts that are defined in the file and will be a handy reminder, without having to open and parse the file itself.

2) A more interactive alternative is to use `ntl` (https://www.npmjs.com/package/ntl). Install it globally on your computer with `npm install -g ntl`.  When that is done you can just go `ntl` in any folder with a `package.json` and it will show you a nice little wizard to select command from.

```
› ntl
✔  Npm Task List - v3.0.0
? Select a task to run:
  start-production
  _start
❯ start
  restart
  lint
  test
  watch
(Move up and down to reveal more choices)
```

