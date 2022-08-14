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
                href: '/apple-touch-icon.png',
              },
            },
            {
              tagName: 'link',
              attributes: {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: '/favicon-32x32.png',
              },
            },
            {
              tagName: 'link',
              attributes: {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: '/favicon-16x16.png',
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
              tagName: 'link',
              attributes: {
                rel: 'mask-icon',
                href: '/safari-pinned-tab.svg',
                color: '#000000',
              },
            },
            {
              tagName: 'meta',
              attributes: {
                name: 'msapplication-TileColor',
                content: '#2b5797',
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