module.exports = {
  stories: ["./stories/**/*.stories.@(tsx|mdx)"],
  addons: ["@storybook/addon-docs"],
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: "./tsconfig.json"
    },
    reactDocgen: false
  }
};
