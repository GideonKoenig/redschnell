import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { NextSSRPlugin as UTNextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { TRPCReactProvider } from "~/trpc/react";
import PlausibleProvider from "next-plausible";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";

export const metadata: Metadata = {
    title: "RedSchnell",
    description:
        "RedSchnell allows you to quickly create transcriptions from your audio and video files and search for information within them.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <head>
                <PlausibleProvider domain="redschnell.gko.gg" selfHosted />
            </head>
            <body className="bg-bg-base text-text h-screen w-screen">
                <UTNextSSRPlugin
                    routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <TRPCReactProvider>{children}</TRPCReactProvider>
            </body>
        </html>
    );
}
