module.exports = function(_context, _options) {
    return {
      name: 'font-awesome-plugin',
      injectHtmlTags() {
        return {
          headTags: [
            {
              tagName: 'link',
              attributes: {
                rel: 'stylesheet',
                href: '/lib/fontawesome-free-5.13.0-web/css/all.min.css',
              },
            },
          ]
        };
      },
    };
  };