**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# Copy and pasting in the terminal

A very short, but super-handy tip, came to mind today.

## Pasting stuff into a new file
Let's say that you are, as I am right now, reading a tutorial. It says something like: `Create file with this content` and then list 260 lines of HTML and CSS.
Now you have to copy that code, create file with Visual Studio code by right-clicking and selecting New file..., name the file and then paste that code in there, format it, and save the file.

Yeah, if you were a loser not using the terminal that is

With the handy `pbpaste` command you can do all of that in one go. Do this

```bash
pbpaste > index.html
```

This will create a file called `index.html` and put whatever you have on your clipboard (Command+C'ed) in that file. Easy, fast, fun.

Please note that, in true bash way, no questions will be asked. Whatever `index.html` contained before you ran this command is now gone. No undo to be done.

## Copying stuff from a file
You might have the opposite situation where you have created amazing code, as I have not right now, and want to share it to the world.

You can get stuff into your clipboard, without opening the file, selecting the code and Command+C the whole thing.

```bash
pbcopy < index.html
```

Done!

The content of `index.html` is now on your clipboard to be pasted in that blog post you were writing.

## Bonus - create an empty file

Another thing that is suprisingly handy is to just create an empty file. This is done with `touch`

```bash
touch index.html
```

A good thing with `touch` is that it will create the file if it doesn't exists, but not overwrite it with an empty file if it **does** exists.