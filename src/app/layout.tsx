import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import PlausibleProvider from "next-plausible";

export const metadata: Metadata = {
    title: "RedSchnell",
    description:
        "RedSchnell allows you to quickly create transcriptions from your audio and video files and search for information within them.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <head>
                <PlausibleProvider domain="redschnell.gko.gg" selfHosted />
            </head>
            <body className="bg-menu-main text-text-normal h-screen w-screen">
                <TRPCReactProvider>{children}</TRPCReactProvider>
            </body>
        </html>
    );
}
