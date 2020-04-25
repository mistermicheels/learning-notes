const path = require('path');

module.exports = {
  title: 'learning-notes (mistermicheels)',
  tagline: 'A collection of my notes regarding things I have learned over the years',
  url: 'https://learning-notes.mistermicheels.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'mistermicheels',
  projectName: 'learning-notes',
  themeConfig: {
    navbar: {
      title: 'learning-notes (mistermicheels)',
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
          label: 'github.com/mistermicheels/learning-notes',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `This work is licensed under a <a href="http://creativecommons.org/licenses/by/4.0/" rel="nofollow">Creative Commons Attribution 4.0 International
License</a>.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'), // syntax highlighting
    },
    disableDarkMode: true,
    gtag: {
      trackingID: 'UA-130247825-2',
      anonymizeIP: true,
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
  plugins: [path.resolve(__dirname, './extended-favicon-plugin')],
};
