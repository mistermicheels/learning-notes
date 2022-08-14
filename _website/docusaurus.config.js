// @ts-check

const path = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'learning-notes',
  tagline: 'Notes regarding things I have learned',
  url: 'https://learning-notes.mistermicheels.com',
  baseUrl: '/',
  onBrokenLinks: 'ignore', // broken links are checked using other scripts
  onBrokenMarkdownLinks: 'ignore', // broken links are checked using other scripts
  favicon: 'favicon.ico',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'learning-notes',
        logo: {
          alt: 'mistermicheels logo',
          src: 'img/mistermicheels.svg',
        },
        items: [
          {
            href: 'https://github.com/mistermicheels/learning-notes',
            label: 'GitHub',
            position: 'left',
          },
          {
            href: 'https://twitter.com/mistermicheels',
            label: 'Twitter',
            position: 'left',
          },
          {
            href: 'https://github.com/mistermicheels/learning-notes',
            position: 'right',
            className: 'header-github-link navbar__item navbar__link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `This work is licensed under a <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow noopener noreferrer">Creative Commons Attribution 4.0 International
        License <svg class="embedded-fa-icon"><use href="#external-link-alt"></use></svg></a>. Website built with Docusaurus.`,
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/oceanicNext'),
        additionalLanguages: ["java"]
      },
      algolia: {
        appId: '38H0OSE8H7',
        apiKey: '1119242d2ba32e7ccfd08f8ae82b3efe',
        indexName: 'mistermicheels_learning-notes',
        contextualSearch: false
      },
    }),
  
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    path.resolve(__dirname, './extended-favicon-plugin'),
    path.resolve(__dirname, './embedded-font-awesome-icons-plugin'),
    path.resolve(__dirname, './goatcounter-plugin'),
  ],
};

module.exports = config;
