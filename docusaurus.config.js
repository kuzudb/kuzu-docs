// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const math = require("remark-math");
const katex = require("rehype-katex");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Kùzu",
  tagline:
    "Kùzu is an in-process property graph database management system built for query speed and scalability.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.kuzudb.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "kuzudb", // Usually your GitHub org/user name.
  projectName: "kuzu-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "https://kuzudb.com/img/logo-u-with-orange-tick.jpg",
      navbar: {
        logo: {
          alt: "Kùzu",
          src: "img/kuzu-logo.png",
          srcDark: "img/kuzu-logo-inverse.png",
          href: "https://kuzudb.com/",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docSidebar",
            position: "left",
            label: "Docs",
          },
          { href: "//blog.kuzudb.com", label: "Blog", position: "left" },
          {
            type: "html",
            position: "right",
            value: `
            <a href="https://github.com/kuzudb/kuzu" class="navbar__link navbar__link--social">
              <i class="fa-brands fa-github fa-xl"></i>
            </a>
            `,
          },
          {
            type: "html",
            position: "right",
            value: `
            <a href="https://discord.gg/jw7xN2ZhJB" class="navbar__link navbar__link--social">
              <i class="fa-brands fa-discord fa-xl"></i>
            </a>
            `,
          },
          {
            type: "html",
            position: "right",
            value: `
            <a href="https://twitter.com/kuzudb" class="navbar__link navbar__link--social">
              <i class="fa-brands fa-twitter fa-xl"></i>
            </a>
            `,
          },
          {
            type: "html",
            position: "right",
            value: `
            <a href="https://www.youtube.com/@KuzuDB" class="navbar__link navbar__link--social">
              <i class="fa-brands fa-youtube fa-xl"></i>
            </a>
            `,
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Slack",
                href: "https://join.slack.com/t/kuzudb/shared_invite/zt-1w0thj6s7-0bLaU8Sb~4fDMKJ~oejG_g",
              },

              {
                label: "Twitter",
                href: "https://twitter.com/kuzudb",
              },
              {
                label: "YouTube",
                href: "https://www.youtube.com/@KuzuDB",
              },
              {
                label: "Bilibili",
                href: "https://space.bilibili.com/410352593",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                href: "//blog.kuzudb.com",
              },
              {
                label: "GitHub",
                href: "https://github.com/kuzudb/kuzu",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Kùzu Team. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java", "rust"],
      },
      metadata: [
        {
          name: "og:locale",
          content: "en_US",
        },
        {
          name: "og:type",
          content: "article",
        },
        {
          name: "og:site_name",
          content: "Kùzu",
        },
        {
          name: "og:image",
          content: "https://kuzudb.com/img/logo-u-with-orange-tick.jpg",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:site",
          content: "@kuzudb",
        },
        {
          name: "twitter:creator",
          content: "@kuzudb",
        },
        {
          name: "twitter:image",
          content: "https://kuzudb.com/img/logo-u-with-orange-tick.jpg",
        },
      ],
      // algolia: {
      //   appId: "XV0PE3XW33",
      //   apiKey: "4bfd55d3ab2a3f3a4ee8a806d6bf8099",
      //   indexName: "kuzudb",
      //   contextualSearch: true,
      // },
    }),
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
    {
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      type: "text/css",
      integrity:
        "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==",
      crossorigin: "anonymous",
      referrerpolicy: "no-referrer",
    },
  ],
};
module.exports = config;
