// we generate the sitemap ourselves as Docusaurus currently doesn't do it
// run this after the Docusaurus build so it doesn't get overwritten

const { SitemapStream, streamToPromise } = require("sitemap");
const path = require("path");
const fsExtra = require("fs-extra");
const frontMatter = require("front-matter");

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

    return getDocIds(sidebarItems);
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

    smStream.write({ url: `/`});

    for (const pageSuffix of allPageSuffixes) {
        // the slash at the end is important, links without the slash at the end get redirected
        smStream.write({ url: `/${pageSuffix}/`, lastmod: getLastModifiedString(pageSuffix) });        
    }

    smStream.end();

    return streamToPromise(smStream);
}

function getLastModifiedString(pageSuffix) {
    const filePath = path.join(process.cwd(), "_website", "docs", pageSuffix + ".md")
    const contents = fsExtra.readFileSync(filePath, { encoding: "utf-8" });
    const parsedFrontMatter = frontMatter(contents);

    if (!parsedFrontMatter.attributes.last_modified) {
        return undefined;
    }

    return new Date(parsedFrontMatter.attributes.last_modified).toISOString();
}
