import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "~/components/control/theme-provider";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "RedSchnell",
    description:
        "RedSchnell allows you to quickly create transcriptions from your audio and video files and search for information within them.",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/favicon.ico",
                href: "/favicon.ico",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/favicon-dark.ico",
                href: "/favicon-dark.ico",
            },
        ],
    },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const theme = cookies().get("theme");

    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <head>
                <PlausibleProvider domain="redschnell.gko.gg" selfHosted />
            </head>

            <body className="h-screen w-screen">
                <ThemeProvider ssrValue={theme?.value}>
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
