const compiler = require("@ampproject/rollup-plugin-closure-compiler");
/**
 * In order to get the smallest bundle size possible in production
 * terser gets swapped for closure compiler
 */
module.exports = {
  rollup(config) {
    const terserIndex = config.plugins.findIndex(
      plugin => plugin.name === "terser"
    );
    if (terserIndex > -1) {
      config.plugins.splice(
        terserIndex,
        1,
        compiler({
          compilation_level: "ADVANCED",
          externs: "externs.js"
        })
      );
    }

    return config;
  }
};
