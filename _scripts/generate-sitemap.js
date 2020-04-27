// we generate the sitemap ourselves as Docusaurus currently doesn't do it
// run this after the Docusaurus build so it doesn't get overwritten

const { SitemapStream, streamToPromise } = require('sitemap');
const path = require("path");
const fsExtra = require("fs-extra");

execute();

async function execute() {
    try {
        console.log("Generating sitemap");
        await generateSitemap();
        console.log("Finished generating sitemap");
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

async function generateSitemap() {
    const allPageSuffixes = getAllPageSuffixes();
    const sitemapBuffer = await getSitemap(allPageSuffixes);
    const sitemap = sitemapBuffer.toString();
    const sitemapPath = path.join(process.cwd(), "_website", "build", "sitemap.xml");
    fsExtra.outputFileSync(sitemapPath, sitemap, { encoding: "utf-8" });

    const robotsTxtPath = path.join(process.cwd(), "_website", "build", "robots.txt");
    const robotsTxtContents = "Sitemap: https://learning-notes.mistermicheels.com/sitemap.xml";
    fsExtra.outputFileSync(robotsTxtPath, robotsTxtContents, { encoding: "utf-8" });
}

function getAllPageSuffixes() {
    // we generated this file ourselves in write-website-data
    const sidebars = require("../_website/sidebars");
    
    const sidebarItems = sidebars.docs;

    const allDocIds = getDocIds(sidebarItems);
    return ["", "404.html", ...allDocIds];
}

function getDocIds(sidebarItems) {
    const docIds = [];

    for (const item of sidebarItems) {
        if (typeof item === "string") {
            docIds.push(item);
        } else {
            docIds.push(...getDocIds(item.items));
        }
    }

    return docIds;
}

async function getSitemap(allPageSuffixes) {
    const smStream = new SitemapStream({ hostname: 'https://learning-notes.mistermicheels.com/' });

    for (const pageSuffix of allPageSuffixes) {
        smStream.write({ url: `/${pageSuffix}`});
    }

    smStream.end();

    return streamToPromise(smStream);
}
