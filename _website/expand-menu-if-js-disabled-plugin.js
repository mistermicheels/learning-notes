module.exports = function (_context, _options) {
  return {
    name: 'expand-menu-if-js-disabled-plugin',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'stylesheet',
              href: '/css/show-collapsed-menu-items.css',
            },
          },
          {
            tagName: 'script',
            attributes: {
              src: '/js/hide-collapsed-menu-items.js',
            },
          },
        ],
      };
    },
  };
};
