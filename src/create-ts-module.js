const execa = require("execa");
const fs = require("fs-extra");
const globby = require("globby");
const path = require("path");
const readPkg = require("read-pkg");
const writePkg = require("write-pkg");

const devDependencies = [
  "@babel/cli",
  "@babel/core",
  "@babel/plugin-proposal-object-rest-spread",
  "@babel/plugin-transform-runtime",
  "@babel/preset-env",
  "@babel/runtime",
  "@types/node",
  "ava",
  "esm",
  "rimraf",
  "ts-node",
  "tslint",
  "typescript"
];

const isWin = process.platform === "win32";

const npmBinRegExp = isWin
  ? /[\\/]np[mx](\.cmd)?$/
  : /\/np[mx]$/;

const npmJsRegExp = isWin
  ? /[\\/]node_modules[\\/]npm[\\/]bin[\\/]np[mx]-cli\.js$/
  : /\/node_modules\/npm\/bin\/np[mx]-cli\.js$/;

exports.install = async function install(cwd) {
  const bin = await findBin();
  await initPackage(bin, cwd);
  await installDependencies(devDependencies, bin, cwd, true);
  await writePackageScripts(cwd);
  await initFiles(cwd);
}

async function checkBin(bin) {
  return !execa.sync(bin, ["-v"], {
    reject: false,
  }).failed;
}

async function findBin() {
  const { env } = process;

  let bin = "yarn";

  if (npmJsRegExp.test(env.NPM_CLI_JS) ||
    npmJsRegExp.test(env.NPX_CLI_JS) ||
    npmBinRegExp.test(env._)) {
    bin = "npm";
  }

  if (!await checkBin(bin)) {
    bin = bin === "yarn" ? "npm" : "yarn";

    if (!await checkBin(bin)) {
      throw new Error("No package manager found.");
    }
  }

  return bin;
}

async function initPackage(bin, cwd) {
  const initArgs = process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("-"));

  const binArgs = [
    "init",
    ...initArgs,
  ];

  await execa(bin, binArgs, { cwd, stdio: "inherit" });
}

async function installDependencies(deps, bin, cwd, isDev = false) {
  if (deps.length <= 0) {
    return;
  }

  const args = bin === "yarn"
    ? ["add", isDev && "--dev", ...deps]
    : ["i", isDev ? "--save-dev" : "--save", ...deps];
  await execa(
    bin,
    args,
    { cwd, stdio: "inherit" },
  );
}

async function writePackageScripts(cwd) {
  const pkg = await readPkg(cwd);
  await writePkg(cwd, {
    ...pkg,
    _id: undefined,
    readme: undefined,
    peerDependencies: {
      "@babel/runtime": pkg.devDependencies["@babel/runtime"]
    },
    main: "js/index.js",
    types: "es/index.d.ts",
    module: "es/index.js",
    scripts: {
      ...pkg.scripts,
      clean: "rimraf ./es ./js",
      tslint: "tslint -p tsconfig.json",
      tsc: "tsc",
      babel: "babel --source-maps -d js es",
      compile: "npm run tsc && npm run babel",
      test: "ava",
      watch: "ava -w",
      prepublish: "npm run clean && npm run tslint && npm run test && npm compile"
    },
    ava: {
      extensions: [
        "ts"
      ],
      files: [
        "./ts/**/*.test.ts"
      ],
      require: [
        "esm",
        "ts-node/register"
      ]
    }
  });
}

async function initFiles(cwd) {
  await copyFiles(
    "**/*",
    path.join(__dirname, "../template"),
    cwd,
  );
}

async function copyFiles(files, from, to) {
  const expandedFiles = await globby(files, { cwd: from });

  await Promise.all(expandedFiles.map(async (file) => {
    await fs.mkdirp(path.dirname(path.join(to, file)));
    await fs.copy(path.join(from, file), path.join(to, file.replace("TEMPLATE", "")));
  }));
}
