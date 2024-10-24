import { ScrollArea } from "~/components/ui/scroll-area";

export default async function App() {
    const dummyEntry = {
        name: "Name of a file that can be long",
    };
    const dummyEntries = new Array(20).fill(dummyEntry);

    return (
        <main className="flex h-screen w-screen flex-row gap-4 bg-menu-dark p-4 dark:bg-dark-menu-dark">
            <div className="h-full w-96 rounded-lg bg-menu-light dark:bg-dark-menu-light">
                <ScrollArea className="h-[calc(100vh-2rem)]">
                    <div className="flex w-full flex-col gap-2 p-4">
                        {dummyEntries.map((entry, index) => (
                            <div
                                key={index}
                                className="rounded-lg bg-menu-main p-2 dark:bg-dark-menu-main"
                            >
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="flex h-full flex-grow flex-col gap-4">
                <div className="h-32 w-full rounded-lg bg-menu-light p-4 dark:bg-dark-menu-light">
                    header
                </div>
                <div className="w-full flex-grow rounded-lg bg-menu-light p-4 dark:bg-dark-menu-light">
                    content
                </div>
            </div>
        </main>
    );
}
