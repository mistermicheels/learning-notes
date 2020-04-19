module.exports = function(_context, _options) {
    return {
      name: 'extended-favicon-plugin',
      injectHtmlTags() {
        return {
          headTags: [
            {
              tagName: 'link',
              attributes: {
                rel: 'apple-touch-icon',
                sizes: "180x180",
                href: '/img/apple-touch-icon.png',
              },
            },
            {
              tagName: 'link',
              attributes: {
                rel: 'icon',
                sizes: '32x32',
                href: '/img/favicon-32x32.png',
              },
            },
            {
              tagName: 'link',
              attributes: {
                rel: 'icon',
                sizes: '16x16',
                href: '/img/favicon-16x16.png',
              },
            },
            {
              tagName: 'link',
              attributes: {
                rel: 'manifest',
                href: '/site.webmanifest',
              },
            },
            {
              tagName: 'meta',
              attributes: {
                name: 'msapplication-TileColor',
                content: '#000000',
              },
            },
            {
              tagName: 'meta',
              attributes: {
                name: 'theme-color',
                content: '#ffffff',
              },
            },
          ]
        };
      },
    };
  };