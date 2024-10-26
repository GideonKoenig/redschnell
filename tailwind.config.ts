import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import AnimtePlugin from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                text: {
                    normal: "rgb(0 0 0)",
                    muted: "rgb(190 192 196)",
                },
                menu: {
                    main: "rgb(255 255 255)",
                    light: "rgb(245 247 251)",
                    hover: "rgb(230 232 236)",
                    dark: "rgb(120 122 126)",
                },
                accent: {
                    main: "rgb(37 99 235)",
                    dark: "rgb(30 58 138)",
                    light: "rgb(59 130 246)",
                },
                dark: {
                    text: {
                        normal: "rgb(240 250 255)",
                        muted: "rgb(175 182 187)",
                    },
                    menu: {
                        main: "rgb(33 36 37)",
                        light: "rgb(55 60 62)",
                        hover: "rgb(71 77 79)",
                        dark: "rgb(20 23 25)",
                    },
                    accent: {
                        main: "rgb(37 99 235)",
                        dark: "rgb(30 58 138)",
                        light: "rgb(59 130 246)",
                    },
                },
            },
        },
    },
    plugins: [AnimtePlugin],
} satisfies Config;
