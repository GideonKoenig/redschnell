/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
    siteUrl: "https://redschnell.gko.gg",
    generateRobotsTxt: true,
    generateIndexSitemap: true,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                disallow: ["/app/"],
            },
        ],
    },
};

export default sitemapConfig;
