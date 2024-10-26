import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { TRPCReactProvider } from "~/trpc/react";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "~/app/_components/theme-provider";
import { cookies } from "next/headers";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import { getServerAuthSession } from "~/server/auth";
import SessionProvider from "~/app/_components/session-provider";

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

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const theme = cookies().get("theme");
    const session = await getServerAuthSession();

    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <head>
                <PlausibleProvider domain="redschnell.gko.gg" selfHosted />
            </head>

            <body className="h-screen w-screen">
                <NextSSRPlugin
                    routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <SessionProvider session={session}>
                    <ThemeProvider ssrValue={theme?.value}>
                        <TRPCReactProvider>{children}</TRPCReactProvider>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
