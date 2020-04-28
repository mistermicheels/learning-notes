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
                
                // using cdnjs means it's very likely that the user already has this (and the fonts) cached
                // since the files they serve never change, they can instruct the browser to cache them as long as possible

                // on Netlify, even if the user visited our site before, the browser would need to check the ETag with the server
                // see https://www.netlify.com/blog/2017/02/23/better-living-through-caching/

                href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css',
              },
            },
          ]
        };
      },
    };
  };