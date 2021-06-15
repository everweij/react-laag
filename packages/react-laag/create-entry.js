const fs = require("fs");
const path = require("path");

const content = `
if (process.env.NODE_ENV === "production") {
  module.exports = require("./react-laag.cjs.production.min.js");
} else {
  module.exports = require("./react-laag.cjs.development.js");
}
`.trim();

fs.writeFileSync(path.join(__dirname, "dist", "index.js"), content, {
  encoding: "utf-8"
});
