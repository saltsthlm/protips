JavaScript is a functional language. It means that functions are at the core of what we program. We can see that in the case of [callbacks](callingBack.md), where we pass functions as parameters.

```javascript
function doWorkAndCallBack(data, callback) {
  // does a lot of work, using the data variable

  // no really - A LOT. OF. WORK

  // and then finally
  callback('I am done!');
}
```

Very often these callback functions are written "inline", meaning in the place we call `doWorkAndCallBack`, like this for example:

```javascript
doWorkAndCallBack('a string of data', function (status) {
  console.log(status);
});
```

Not seldom we will call callback functions inside the callback function and then get a callback-function that we need to call in order to ... it can become pretty messy. Fast.

And when the last 7 lines of your code file look like this:

```
            });
          });
        });
      });
    });
  });
});
```

... it's easy to get lost.

## The tip

One simple trick that helped me in my early days (and still do) is to write the function calls in steps. Like this:

I say to myself: "Ok - we are going to call doWorkAndCallBack"
And then write this

```javascript
doWorkAndCallBack();
```

"It takes two parameters, data and a callback function"

```javascript
doWorkAndCallBack('', function (){});
```

"And that callback function will give me a status of some kind. Better add that parameter."

```javascript
doWorkAndCallBack('', function (status){});
```


I then, and here is the magic part, position myself between the `{` and `}` and hit ENTER. TA-DA!


```javascript
doWorkAndCallBack('', function (status){

});
```

And now I can start to fill out the inside of the callback, what is going to happen once we get back here
