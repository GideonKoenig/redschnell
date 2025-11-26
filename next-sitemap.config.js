/** @type {import('next-sitemap').IConfig} */
export default {
    siteUrl: "https://redschnell.gko.gg",
    generateRobotsTxt: true,
    generateIndexSitemap: true,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                disallow: [],
            },
        ],
    },
};
