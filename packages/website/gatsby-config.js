module.exports = {
  siteMetadata: {
    title: `react-laag`,
    description: `Hooks for positioning tooltips & popovers`,
    author: `Erik Verweij`,
    siteUrl: "https://www.react-laag.com",
    keywords: [
      "react",
      "hook",
      "layer",
      "tooltip",
      "popover",
      "dropdown",
      "menu"
    ],
    image: "/logo.svg"
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
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-149386814-1",
        head: true,
        anonymize: false
      }
    },
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://www.react-laag.com",
        sitemap: "https://www.react-laag.com/sitemap.xml",
        policy: [{ userAgent: "*" }]
      }
    }
  ]
};
