import { ScrollArea } from "~/components/ui/scroll-area";

export default async function App() {
    const dummyEntry = {
        name: "Name of a file that can be long",
    };
    const dummyEntries = new Array(40).fill(
        dummyEntry,
    ) as (typeof dummyEntry)[];

    return (
        <main className="flex h-screen w-screen flex-row gap-4 bg-menu-main p-4 dark:bg-dark-menu-main">
            <div className="h-full w-96 rounded-lg border border-menu-light bg-menu-main dark:border-dark-menu-light dark:bg-dark-menu-main">
                <ScrollArea className="h-[calc(100vh-2rem)]">
                    <div className="flex w-full flex-col gap-2 p-4">
                        {dummyEntries.map((entry, index) => (
                            <div
                                key={index}
                                data-state={index}
                                className="cursor-pointer rounded-lg p-2 hover:bg-menu-light data-[state=1]:bg-menu-light dark:hover:bg-dark-menu-light dark:data-[state=1]:bg-dark-menu-light"
                            >
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="flex h-full flex-grow flex-col gap-4">
                <div className="h-32 w-full rounded-lg border border-menu-light bg-menu-main p-4 dark:border-dark-menu-light dark:bg-dark-menu-main">
                    header
                </div>
                <div className="w-full flex-grow rounded-lg border border-menu-light bg-menu-main p-4 dark:border-dark-menu-light dark:bg-dark-menu-main">
                    content
                </div>
            </div>
        </main>
    );
}
