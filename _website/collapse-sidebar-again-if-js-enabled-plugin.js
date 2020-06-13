module.exports = function (_context, _options) {
  return {
    name: "expand-menu-if-js-disabled-plugin",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              type: "text/javascript",
            },
            // JS creating style element restoring original Docusaurus sidebar collapse behavior (slightly more specific selectors)
            innerHTML: `const style = document.createElement("style");	
            style.type = "text/css";	
            style.textContent = ".menu .menu__list .menu__list-item.menu__list-item--collapsed .menu__list{height:0;overflow:hidden}.menu .menu__list .menu__link.menu__link--sublist:after{visibility:visible}.menu .menu__list .menu__list-item.menu__list-item--collapsed .menu__link--sublist:after{visibility:visible}";
            document.getElementsByTagName("head")[0].appendChild(style);`
          },
        ],
      };
    },
  };
};
