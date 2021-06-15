process.env.NODE_ENV = "test";

/** @type {import("@web/test-runner").TestRunnerConfig } */
module.exports = {
  plugins: [require("@snowpack/web-test-runner-plugin")()],
  testRunnerHtml: testFramework =>
    `<html>
      <head>
        <style>
          body { margin: 0; }
        </style>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`
};
