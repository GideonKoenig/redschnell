/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ["prettier-plugin-tailwindcss"],
    tailwindStylesheet: "./src/styles/globals.css",
    tabWidth: 4,
    printWidth: 80,
};

export default config;
