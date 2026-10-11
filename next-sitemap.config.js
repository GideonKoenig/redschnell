/** @type {import('next-sitemap').IConfig} */
const config = {
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

export default config;
