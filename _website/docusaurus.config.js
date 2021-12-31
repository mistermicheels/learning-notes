const path = require('path');

module.exports = {
  title: 'learning-notes',
  tagline: 'Notes regarding things I have learned',
  url: 'https://learning-notes.mistermicheels.com',
  baseUrl: '/',
  favicon: 'favicon.ico',
  organizationName: 'mistermicheels',
  projectName: 'learning-notes',
  themeConfig: {
    navbar: {
      title: 'learning-notes',
      logo: {
        alt: 'mistermicheels logo',
        src: 'img/mistermicheels.svg',
      },
      links: [
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
      copyright: `This work is licensed under a <a href="http://creativecommons.org/licenses/by/4.0/" rel="nofollow">Creative Commons Attribution 4.0 International
License</a>.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/oceanicNext'),
    },
    disableDarkMode: false,
    algolia: {
      appId: '38H0OSE8H7',
      apiKey: '1119242d2ba32e7ccfd08f8ae82b3efe',
      indexName: 'mistermicheels_learning-notes',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    path.resolve(__dirname, './extended-favicon-plugin'),
    path.resolve(__dirname, './embedded-font-awesome-icons-plugin'),
    path.resolve(__dirname, './collapse-sidebar-again-if-js-enabled-plugin'),
    path.resolve(__dirname, './goatcounter-plugin'),
  ],
};
