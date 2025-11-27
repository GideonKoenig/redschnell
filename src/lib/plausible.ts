import { env } from "~/env";
import { tryCatch } from "~/lib/try-catch";

const APP_URL = env.NEXT_PUBLIC_APP_URL;
const PLAUSIBLE_DOMAIN = new URL(APP_URL).hostname;
const PLAUSIBLE_API_URL = "https://plausible.gko.gg/api/event";

type PlausibleEvent = {
    name: string;
    props?: Record<string, string>;
};

export async function trackEvent({ name, props }: PlausibleEvent) {
    await tryCatch(
        fetch(PLAUSIBLE_API_URL, {
            method: "POST",
            headers: {
                "User-Agent": "RedSchnell/1.0",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                url: APP_URL,
                domain: PLAUSIBLE_DOMAIN,
                props,
            }),
        }),
    );
}
