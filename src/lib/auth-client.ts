"use client";

import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { useEffect } from "react";
import type { auth } from "~/lib/auth-server";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { signIn, signOut, useSession } = authClient;

/** Reloads this tab and every other open app tab after the session changed accounts. */
export function switchAccount() {
    accountChannel().postMessage(null);
    reloadApp();
}

/** Reloads this tab when another tab switches accounts. */
export function useReloadOnAccountSwitch() {
    useEffect(() => {
        const channel = accountChannel();
        channel.onmessage = reloadApp;
        return () => {
            channel.onmessage = null;
        };
    }, []);
}

export function useUser() {
    const { data: session } = useSession();
    return session?.user ?? null;
}

// All tabs share the session cookie, so switching accounts in one tab switches every tab.
// Sender and listener share one channel because a channel never receives its own messages, so the sending tab reloads only once.
let channel: BroadcastChannel | undefined;
function accountChannel() {
    return (channel ??= new BroadcastChannel("account-switch"));
}

// A full page load drops all client state, such as cached queries and running uploads.
function reloadApp() {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- a router push would keep client state
    window.location.assign("/app");
}
