module.exports = function (_context, _options) {
    return {
      name: "goatcounter-plugin",
      injectHtmlTags() {
        return {
          postBodyTags: [
            {
              tagName: "script",
              attributes: {
                type: "text/javascript",
              },
              innerHTML: `window.goatcounter = { no_events: true };

              window.addEventListener("click", event => {
                  if (!window.goatcounter.count) {
                    // GoatCounter not loaded yet
                    return;
                  }

                  if (!event.target) {
                    return;
                  }

                  const href = event.target.getAttribute("href");

                  if (!href || href.startsWith("http") || href.startsWith("#")) {
                    // no link, external link or link within current note
                    return;
                  }

                  // without setTimeout, we track new path but old title when moving between notes
                  setTimeout(() => {
                    window.goatcounter.count();
                  });
              })`,
            },
            {
              tagName: "script",
              attributes: {
                "data-goatcounter": "https://learning-notes.goatcounter.com/count",
                async: true,
                src: "//gc.zgo.at/count.js"
              },
            },
          ],
        };
      },
    };
  };
  