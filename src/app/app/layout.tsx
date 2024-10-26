import { ActionBar } from "~/app/app/_components/action-bar";
import { ThemeToggle } from "~/components/theme-toggle";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UploadModal } from "~/app/app/_components/upload-modal";
import { db } from "~/server/db";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const files = await db.query.files.findMany();
    const chats = await db.query.chats.findMany();

    return (
        <>
            <ThemeToggle className="absolute left-0 top-0" />
            <UploadModal />
            <Tabs defaultValue="files" className="w-full">
                <main className="grid h-screen w-screen grid-cols-[22rem_auto] gap-4 bg-menu-main p-4 dark:bg-dark-menu-main">
                    <div className="rounded-lg border border-menu-hover bg-menu-light p-1 shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
                        <TabsList className="h-full w-full bg-menu-light p-0">
                            <TabsTrigger value="files">Your files</TabsTrigger>
                            <TabsTrigger value="chats">Your chats</TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="flex w-full flex-row items-center gap-2 rounded-lg border border-menu-hover bg-menu-main p-2 shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
                        <ActionBar />
                    </div>
                    <div className="h-full w-[22rem] rounded-lg border border-menu-hover bg-menu-main shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
                        <TabsContent value="files">
                            <ScrollArea className="h-[calc(100vh-6.5rem)]">
                                <div className="flex w-full flex-col gap-2 p-4">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            data-state={index}
                                            className="cursor-pointer rounded-lg p-2 hover:bg-menu-light data-[state=1]:bg-menu-light dark:hover:bg-dark-menu-light dark:data-[state=1]:bg-dark-menu-light"
                                        >
                                            {file.name}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="chats">
                            <ScrollArea className="h-[calc(100vh-6.5rem)]">
                                <div className="flex w-full flex-col gap-2 p-4">
                                    {chats.map((chat, index) => (
                                        <div
                                            key={index}
                                            data-state={index}
                                            className="cursor-pointer rounded-lg p-2 hover:bg-menu-light data-[state=1]:bg-menu-light dark:hover:bg-dark-menu-light dark:data-[state=1]:bg-dark-menu-light"
                                        >
                                            {chat.name}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </div>

                    <div className="w-full flex-grow rounded-lg border border-menu-hover bg-menu-main p-4 shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
                        {children}
                    </div>
                </main>
            </Tabs>
        </>
    );
}
