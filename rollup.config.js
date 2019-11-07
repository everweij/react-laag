// import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

function getBabelConfig({ useESModules }, targets) {
  return {
    babelrc: false,
    runtimeHelpers: true,
    presets: [
      ["@babel/preset-env", { loose: true, modules: false, targets }],
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: [
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-class-properties",
      ["@babel/transform-runtime", { regenerator: false, useESModules }]
    ],
    extensions
  };
}

const input = "src/index.tsx";

export default [
  {
    input,
    output: {
      file: pkg.module,
      format: "esm",
      exports: "named",
      sourcemap: true
    },

    plugins: [
      external(),
      babel(
        getBabelConfig(
          { useESModules: true },
          ">1%, not dead, not ie 11, not op_mini all"
        )
      ),
      resolve({ extensions })
    ]
  },
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    plugins: [
      external(),
      commonjs(),
      babel(
        getBabelConfig(
          { useESModules: false },
          ">1%, not dead, not ie 11, not op_mini all"
        )
      ),
      resolve({ extensions })
    ]
  }
];
