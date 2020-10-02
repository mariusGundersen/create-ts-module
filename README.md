# create-ts-module

A package initialization template for [`typescript`](https://github.com/Microsoft/TypeScript) modules.

```sh
mkdir my-module-name
cd my-module-name
npm init ts-module -y
```

This initializer is specifically designed to make TypeScript modules for npm installation. When you publish a module made with create-ts-module it will follow the [TypeScript publishing recommendations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) and the [pkg.module recommendation](https://github.com/rollup/rollup/wiki/pkg.module) by adding `"types": "es/index.d.ts"` and `"module": "es/index.js"` in the `package.json` file.

## build scripts

The generated module does not rely on any large build tool, rather it uses npm scripts. Try running `npm run` in your cli to see what is available to do. Here is a short summary:

- `npm run clean`: clean the output folders `./es` and `./js`.
- `npm run tslint`: lint the ts files
- `npm run tsc`: compile the TypeScript in `./ts` into ES2015 in the `./es` folder.
- `npm run babel`: compile the ES2015 in the `./es` into JavaScript in the `./js` folder.
- `npm run compile`: run both the tsc and the babel steps.
- `npm run test`: run unit tests.
- `npm run watch`: continuously run unit tests.

## dev-dependencies

The generated package will have few dev-dependencies:

- [`typescript`](https://www.npmjs.com/package/typescript): Used to compile TypeScript to EcmaScript 2015
- [`@babel/*`](https://www.npmjs.com/package/@babel/cli): A bunch of modules used to compile EcmaScript 2015 to JavaScript
- [`ava`](https://www.npmjs.com/package/ava): A good and simple test runner

There are some other dependencies which are needed just to get this all to work.

## peer-dependencies

There is one peer dependency, `@babel/runtime`, which is needed for running the JavaScript output. It is set as a peer dependency to minimize the output file size. If you use a bundler like webpack then you probably have this already.

## Inspirations

- [`create-typescript`](https://github.com/LoicMahieu/create-typescript)
- [`create-esm`](https://github.com/standard-things/create-esm)
- [`iarna-create-npm`](https://github.com/iarna/iarna-create-npm)
