module.exports = {
  siteMetadata: {
    title: `react-laag`,
    description: `Hook for positioning tooltips & popovers`,
    author: `Erik Verweij`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./favicon/android-chrome-512x512.png",

        icons: {
          android: true,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: true,
          yandex: false,
          windows: false
        }
      }
    }
  ]
};
