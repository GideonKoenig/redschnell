import { withPlausibleProxy } from "next-plausible";

await import("./src/env.js");

/** @type {import('next').NextConfig} */
const config = {
    headers: async () => [
        {
            source: "/((?!api).*)",
            headers: [
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                {
                    key: "Cross-Origin-Embedder-Policy",
                    value: "credentialless",
                },
            ],
        },
    ],
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
        };
        return config;
    },
};

export default withPlausibleProxy({
    customDomain: "https://plausible.gko.gg",
})(config);
