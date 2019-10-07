process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
  config.set({
    frameworks: ["mocha"],

    files: [
      {
        pattern: "src/**/*.spec.tsx",
        watched: false
      }
    ],

    preprocessors: {
      "src/**/*.spec.tsx": ["webpack", "sourcemap"]
    },

    reporters: ["mocha", "coverage-istanbul"],

    coverageIstanbulReporter: {
      reports: ["html"],
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      instrumentation: {
        "default-excludes": true,
        excludes: ["**/src/tests/**"]
      }
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.(ts|tsx)$/,
            use: {
              loader: "istanbul-instrumenter-loader",
              options: { esModules: true }
            },
            enforce: "post",
            exclude: [/node_modules/, /\.spec.tsx/]
          }
        ]
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
      }
    },

    browsers: ["ChromeHeadless"],

    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: ["--remote-debugging-port=9333"]
      }
    }
  });
};
