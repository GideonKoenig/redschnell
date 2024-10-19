import { HydrateClient } from "~/trpc/server";

export default async function Home() {
    return (
        <HydrateClient>
            <main className="bg-menu-main">RedSchnell</main>
        </HydrateClient>
    );
}
