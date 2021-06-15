/** @type {import("snowpack").SnowpackUserConfig } */
const config = {
  mount: {
    sandbox: "/",
    src: "/src"
  },
  packageOptions: {
    external: ["/__web-dev-server__web-socket.js"]
  },
  workspaceRoot: "../../"
};

if (process.env.NODE_ENV === "test") {
  config.mount.tests = "/";
} else {
  config.plugins = [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript"
  ];
}

module.exports = config;
