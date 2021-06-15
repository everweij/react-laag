module.exports = {
  stories: ["./stories/**/*.stories.@(tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-postcss"],
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: "./tsconfig.json"
    },
    reactDocgen: false
  },
  features: {
    postcss: false
  }
};
