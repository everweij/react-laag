const path = require("path");

/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    titlePostfix: "- react-laag",
    author: "react-laag",
    description:
      "Primitive to build things like tooltips, dropdown menu's and pop-overs",
    siteUrl: "https://www.react-laag.com",
    keywords: ["react", "layer", "tooltip", "popover", "dropdown", "menu"],
    image: "/logo.png"
  },
  plugins: [
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",

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
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".mdx"],
        gatsbyRemarkPlugins: [
          "gatsby-remark-prismjs",
          "gatsby-remark-embedder"
        ],
        remarkPlugins: [require("remark-slug")]
      }
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-149386814-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        // Setting this parameter is optional
        anonymize: false
        // Setting this parameter is also optional
      }
    },
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://www.react-laag.com",
        sitemap: "https://www.react-laag.com/sitemap.xml",
        policy: [{ userAgent: "*", allow: "/" }]
      }
    }
  ]
};
