import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Gateweaver",
  tagline: "An open-source, lightweight API Gateway built on Express.js",
  favicon: "img/logo.png",

  // Set the production url of your site here
  url: "https://gateweaver.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "gateweaver", // Usually your GitHub org/user name.
  projectName: "gateweaver", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/gateweaver/gateweaver/tree/main/packages/docs",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Gateweaver",
      logo: {
        alt: "Gateweaver Logo",
        src: "img/logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Docs",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/gateweaver/gateweaver",
          position: "right",
          className: "header-github-link",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs/getting-started",
            },
            {
              label: "Configuration",
              to: "/docs/category/configuration",
            },
            {
              label: "CLI Reference",
              to: "/docs/cli",
            },
            {
              label: "Deployment",
              to: "/docs/deployment",
            },
          ],
        },
        // {
        //   title: "Community",
        //   items: [
        //     {
        //       label: "Stack Overflow",
        //       href: "https://stackoverflow.com/questions/tagged/gateweaver",
        //     },
        //     {
        //       label: "Discord",
        //       href: "https://discordapp.com/invite/gateweaver",
        //     },
        //     {
        //       label: "Twitter",
        //       href: "https://twitter.com/gateweaver",
        //     },
        //   ],
        // },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/gateweaver/gateweaver",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Gateweaver. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
