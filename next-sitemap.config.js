/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
    siteUrl: "https://redschnell.gko.gg",
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                disallow: [],
            },
        ],
    },
};

export default sitemapConfig;
