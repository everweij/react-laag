const path = require("path");
const { terser } = require("rollup-plugin-terser");
const { DEFAULT_EXTENSIONS: DEFAULT_BABEL_EXTENSIONS } = require("@babel/core");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const { default: resolve } = require("@rollup/plugin-node-resolve");
const sourceMaps = require("rollup-plugin-sourcemaps");
const typescript = require("rollup-plugin-typescript2");
const { babel } = require("@rollup/plugin-babel");
const ts = require("typescript");

const tsConfigPath = path.join(__dirname, "tsconfig.json");
const tsconfigJSON = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;

const tsCompilerOptions = ts.parseJsonConfigFileContent(
  tsconfigJSON,
  ts.sys,
  "./"
).options;

const isExternal = id => !id.startsWith(".") && !path.isAbsolute(id);

const getOutputName = (format, minify, env) =>
  [
    path.join(__dirname, "dist", "react-laag"),
    format,
    env,
    minify ? "min" : "",
    "js"
  ]
    .filter(Boolean)
    .join(".");

const outputBase = {
  freeze: false,
  esModule: Boolean(tsCompilerOptions?.esModuleInterop),
  name: "react-laag",
  sourcemap: true,
  globals: { react: "React" },
  exports: "named"
};

/** @type {import("rollup").RollupOptions } */
const options = {
  input: path.join(__dirname, "src", "index.ts"),

  external: id =>
    id.startsWith("regenerator-runtime") ? false : isExternal(id),

  treeshake: {
    propertyReadSideEffects: false
  },

  output: [
    {
      file: getOutputName("cjs", true, "production"),
      format: "cjs",
      ...outputBase,
      plugins: [
        replace({
          "process.env.NODE_ENV": "production",
          preventAssignment: true
        }),
        terser({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10
          },
          ecma: 5,
          toplevel: true,
          warnings: true
        })
      ]
    },
    {
      file: getOutputName("cjs", false, "development"),
      format: "cjs",
      ...outputBase,
      plugins: [
        replace({
          "process.env.NODE_ENV": "development",
          preventAssignment: true
        })
      ]
    },
    {
      file: getOutputName("esm", false, "production"),
      format: "esm",
      ...outputBase,
      plugins: [
        replace({
          "process.env.NODE_ENV": "production",
          preventAssignment: true
        })
      ]
    }
  ],

  plugins: [
    resolve({
      mainFields: ["module", "main", "browser"]
    }),
    commonjs({
      include: /\/regenerator-runtime\//
    }),
    typescript({
      typescript: ts,
      tsconfig: tsConfigPath,
      tsconfigDefaults: {
        exclude: [
          "**/*.spec.ts",
          "**/*.test.ts",
          "**/*.spec.tsx",
          "**/*.test.tsx",
          "node_modules",
          "dist"
        ],
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          jsx: "react"
        }
      },
      tsconfigOverride: {
        compilerOptions: {
          target: "esnext"
        }
      },
      check: true,
      useTsconfigDeclarationDir: Boolean(tsCompilerOptions?.declarationDir)
    }),
    babel({
      extensions: [...DEFAULT_BABEL_EXTENSIONS, "ts", "tsx"],
      exclude: "node_modules/**",
      plugins: [
        "babel-plugin-macros",
        "babel-plugin-annotate-pure-calls",
        "babel-plugin-dev-expression",
        ["babel-plugin-polyfill-regenerator", { method: "usage-pure" }],
        ["@babel/plugin-proposal-class-properties", { loose: true }]
      ],
      presets: [["@babel/preset-env", { modules: false, loose: true }]],
      babelHelpers: "bundled"
    }),
    sourceMaps()
  ]
};

module.exports = options;
