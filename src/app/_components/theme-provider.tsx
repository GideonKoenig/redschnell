"use client";

import { ThemeProvider as NextThemesProvider, useTheme as nextUseTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { createContext, useContext, type ReactNode } from "react";
import { setCookie } from "cookies-next";

const StorageKey = "theme";
const DefaultValue = "system";

const NextThemeSSRContext = createContext<string>(DefaultValue);
function NextThemeSSRProvider(props: { children: ReactNode; value: string | undefined }) {
    return (
        <NextThemeSSRContext.Provider value={props.value ?? DefaultValue}>
            {props.children}
        </NextThemeSSRContext.Provider>
    );
}

function useTheme() {
    const { themes, forcedTheme, setTheme, theme, resolvedTheme, systemTheme } = nextUseTheme();
    const ssrContext = useContext(NextThemeSSRContext);

    const customSetTheme = (value: string) => {
        const resolvedTheme = value === "system" ? systemTheme : value;
        setCookie(StorageKey, resolvedTheme);
        setTheme(value);
    };

    const customTheme = () => {
        if (typeof window === "undefined") return ssrContext;

        return theme;
    };

    return {
        themes,
        forcedTheme,
        setTheme: customSetTheme,
        theme: customTheme,
        resolvedTheme,
        systemTheme,
    };
}

function ThemeProvider({
    children,
    ssrValue,
    ...props
}: ThemeProviderProps & { ssrValue: string | undefined }) {
    return (
        <NextThemeSSRProvider value={ssrValue}>
            <NextThemesProvider
                attribute="class"
                defaultTheme={DefaultValue}
                enableSystem
                disableTransitionOnChange
                storageKey={StorageKey}
                {...props}
            >
                {children}
            </NextThemesProvider>
        </NextThemeSSRProvider>
    );
}

export { useTheme, ThemeProvider };
