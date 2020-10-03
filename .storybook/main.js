module.exports = {
  stories: ["../stories/**/*.stories.(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
          options: {
            transpileOnly: true
          }
        }
      ]
    });

    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  }
};
