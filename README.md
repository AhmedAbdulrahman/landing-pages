## This project show cases animations for modules.

The approch is to use as little Javascript as possible an dfocus on Css animations.
Most animations is applied when a modules is in viewport. For this the css class `observed` is applies. For some modules is class only needs to be applied once. 

### Technologies used

- Scss
- Html (copies from telenor.dk source code).
- Micro Javascript library [splitting](https://www.npmjs.com/package/splitting/v/1.0.6).

```
  "dependencies": {
    "splitting": "^1.0.6"
  }

```

### Prerequisite to run the project: 
- Node version 14.17.1

## Getting started 

`npm install`
`npm run start`

## Deploy

`npm run build`

Outputs the content to the `dist` folder, which can be deployed to a server.

TODO: Fix fonts.
Fix so that the font when deploying is matching fonts when building locally.



