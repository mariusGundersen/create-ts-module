# create-ts-module

A package initialization template for [`typescript`](https://github.com/Microsoft/TypeScript) modules.

```sh
npm init ts-module -y
```

This initializer is specifically designed to make TypeScript modules for npm installation. When you publish a module made with create-ts-module it will follow the [TypeScript publishing recommendations](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) and the [pkg.module recommendation](https://github.com/rollup/rollup/wiki/pkg.module) by adding `"types": "es/index.d.ts"` and `"module": "es/index.js"` in the `package.json` file.

## Inspirations

- [`create-typescript`](https://github.com/LoicMahieu/create-typescript)
- [`create-esm`](https://github.com/standard-things/create-esm)
- [`iarna-create-npm`](https://github.com/iarna/iarna-create-npm)
