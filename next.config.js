import { withPlausibleProxy } from "next-plausible";

await import("./src/env.js");

/** @type {import('next').NextConfig} */
const config = {
    reactCompiler: true,
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
};

export default withPlausibleProxy({
    src: "https://plausible.gko.gg/js/pa-Vj9FwXfsMAGe5WSM-lzKs.js",
})(config);
