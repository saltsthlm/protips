**This site is deprecated and all the content has moved to [AppliedTechnology](https://appliedtechnology.github.io/protips/)**

# Dotfiles on our computers

Yes! Finally someone (thank you, Charlotte) asked me on how I setup your computers.

Luckily I'm ready for the question (was kinda hoping that you would ask for a lecture during the bootcamp but we ran out of time).

First of all, I have configured all your computers the same way, in a idiomatic but generally good starting-point approach.

I've accomplished that with something refered to as dotfiles and you can read more about that [concept here](https://zachholman.com/2010/08/dotfiles-are-meant-to-be-forked/)  and even more to [learn here](https://dotfiles.github.io/)

Dotfiles are just a github repository with setup and configuration scripts that you all can run at your leisure to keep your computers updated. That means that you all have a copy of the dotfiles on your computers.

It's is at:

```bash
cd ~/.dotfiles
```

The [actual repository is here](https://github.com/saltsthlm/jsfullstackdev-dotfiles). Which also contains a ReadMe that describes what is installed and [how it works](https://github.com/saltsthlm/jsfullstackdev-dotfiles/blob/master/README.md)

## How did Marcus do it?

You can read about the process and how I configured your computers [here](http://www.marcusoft.net/2018/08/what-i-learned-when-installing-developer-computers-in-hours.html)

## Make it your own

In this post one thing that could be useful to know is how to setup a computer from scratch. That can be useful to install any new computer you work with:

1. Fork the repository
2. Install the computer as normal, to just get started
3. Open a terminal and run the following [commands](https://github.com/saltsthlm/jsfullstackdev-dotfiles/blob/master/script/automationAug18.sh)

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

git clone https://github.com/saltsthlm/jsfullstackdev-dotfiles.git ~/.dotfiles

bash ~/.dotfiles/script/bootstrap

sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

That should bring your computer up to the state it was in here at the school. It's a good starting point.

Now you can change the scripts (it's really simple stuff, but requires that you read them) to suit your need and preferences. For example, we have been using Visual Studio code - you might want to have Atom or Sublime. No problem.

1. Head to `Brewfile` in your repository

2. Add a `cask 'atom'` or `cask sublime-text` to the Brewfile

3. Save and re-run the `dot` command the

