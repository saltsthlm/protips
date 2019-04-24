# 10 tricks I wish I knew before starting using the terminal for the first time

As you probably noticed by now, we are doing a lot of work in the terminal, using bash commands to work with code in different ways. This can be pretty daunting to start with but by knowing just a few simple commands you will get a hang of it fast. 

## How do I start the thing? 

The simplest way to start the terminal is to hit `⌘+Space` and then type `terminal` and hit enter. 

This will open a terminal window and show you something cryptical like: 

```bash
Last login: Tue Apr 23 14:25:37 on ttys003
Now using node v11.9.0 (npm v6.5.0)

🔋  1:52 in marcus/ 
› 
```

There's quite a lot of things going on here, but let's focus on the last couple of lines

* The last line is where you will see your cursor and where you enter the commands, aka The Prompt
* The line above tells us where we are `marcus/` means that I'm in a folder called `marcus`, my user home folder. 

We are now ready to write some commands

## The commands

### Navigating

`pwd` - **where am I**. `pwd` means present working directory and tells you where you are. By entering this command you will see the full path to your current location `/Users/marcus` for example

`ls` - **what files and directories are in here** `ls` means list and lists all the files and folders in the current directory. Try it now in your user home folder and you will see a long list of files and folders

`cd` - **go into directory** - `cd` stands for *change directory* and change the present working directory to the one indicated. For example `cd Projects` will put me in the `Projects` directory (`pwd` will then respond `/Users/marcus/Projects`).

`cd ..` - **go back up one level** - this command will change the present working directory to one level up. For example if I'm in `/Users/marcus/Projects` and go `cd ..` I will end up in `/Users/marcus/` . 
This can be used in several levels `cd ../../../` takes me up three levels.  

`cd ~` - **go to the user home folder** using the `~` in a path means that I go to the user home folder. `cd ~/Projects` will move my present working directory to the `/Users/marcus/Projects` regardless of where I was before this command. 

### File manipulation

Most of the work we do in the terminal is handling files or folders. Let's start with files. 

`touch` - **create a file** touch creates a file (or updates the latest updated date, if the file already exists). `touch kalle.txt` will create an empty text file called `kalle.txt` 

`cp` - **copy a file** copies a file to a location. `cp kalle.txt ~` means that you will make a copy of the file `kalle.txt` in the user home folder `~`. There will be two copies of `kalle.txt` after running this command

`mv` - **move a file** moves a file to a location. `mv kalle.txt ~` means that you will move the file `kalle.txt` to the user home folder `~`. There will only be one copies of `kalle.txt` after running this command. 

`rm` - **remove a file** - deletes the file, no questions asked. `rm kalle.txt` will permanently delete the file. No trashcan or undo. 

### Directory manipulation

Files exist in folders and quite common is that we are manipulating the folders too. 

`mkdir` - **create a directory**, well this just creates a directory with the given name `mkdir kalle` will create a directory called `kalle`. If you `cd kalle` and then `ls` you will see that the directory is empty. 

`rmdir` - **delete the directory**. Just delete it, without putting into trash. No undo either. You can't delete your present working directory.  So if my `pwd` is `/User/Marcus/kalle` i cannot write `rmdir .` To remove `kalle` I have to `cd ..` and then go `rmdir kalle`. 

A special case is when you want to delete a directory that is not empty, that contains files and potentially other folders. In order to delete that you will have to write `rm -rf kalle`. Beware - this will remove all the files and folders without asking any questions. `rm -rf ~` will remove everything at your user home directory and cause irreparable problems, for example.

## Flags

The `-rf` part of the `rm -rf kalle` command is an example of a couple of flags. Flags are ways to pass more specific information to the command you are running. In the `rm -rf kalle` case it means:

* `-r` - recursive
* `-f` - force (don't ask questions)

So the flags can be written `-r -f` or `-rf` it doesn't matter. 

Sometimes flags takes parameters. For example `git commit -m "Apa banan citron"` which tells `git commit` that we want a commit message that is "Apa banan citron". 

## Special characters

There are some special characters that are very useful to know what they mean:

| Character | Means                                                        |
| --------- | ------------------------------------------------------------ |
| `~`       | User home directory. `cd ~` will take you to the user home directory |
| `.`       | Current directory. `ls .` will list the content of the current directory |
| `..`      | Parent directory. `cd ..` will move the present working directory to the parent of the current working directory. Up one level |

## Documentation

An underused feature of bash is that it has built-in documentation. So if you don't know the flags or what a command does you can always read the documentation by going `man {name of command}`, for example, `man rm` to read excellent documentation of the `rm` command. 

## Stop a running process

If you start a program and need to end it you might need to interrupt the process. This is done by hitting CTRL+C. 

