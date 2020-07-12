# start-kits
this project is to collect starter-kit for various front-end development

this is the base folder for a starter-kit

# Get Started
It is annoying to read a bunch of dependencies in a single `package.json`, so I separate them into 3 part at least.

1. the root `package.json`, linters resided, all your code should be formatted with tools within it.
1. the `package.json` in `tools`, I put `build tools` in, alias `devDenepencies`, if there are other tools, put them in.
1. the `package.json` in `src`, mostly `business logic` resided in, alias `dependencies`。
1. `package.json`s in `framework` or `theme` folders, who are neither `build tools` or `business logic`. If they share the same dependencies with `business logic`, you may mix them in `src` folder.

yes, all these make this project look like a mono repo.
the best practice is to pack your `build tools` into a private npm package, the same goes to `framework` and `theme`, only left `business logic` in the project. However, you may do not have the `write` access to a private npm server in your company. so be it.

# Project structure
```
├─dist                      // complied targets
├─docs                      // documents
├─mock                      // mocked data
├─public                    // public files, like index.html or robots.txt
├─src                       // business logic
│  ├─framework              // you framework, who will invoke other 
│  ├─locals                 // international assets
│  ├─themes                 // themes, like dark mode
└─tools                     // build tools
```
