import { ScrollArea } from "~/components/ui/scroll-area";
import { TabsContent } from "~/components/ui/tabs";
import { db } from "~/server/db";
import { UploadProgressList } from "~/uploadthing/upload-progress-list";

export async function Sidebar() {
    const files = await db.query.files.findMany();
    const chats = await db.query.chats.findMany();

    return (
        <div className="h-full w-[22rem] rounded-lg border border-menu-hover bg-menu-main shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
            <ScrollArea className="h-[calc(100vh-6.5rem)]">
                <UploadProgressList />
                <TabsContent value="files">
                    <div className="flex w-full flex-col gap-2 p-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                data-state={index}
                                className="cursor-pointer rounded-lg p-2 hover:bg-menu-light data-[state=1]:bg-menu-light dark:hover:bg-dark-menu-light dark:data-[state=1]:bg-dark-menu-light"
                            >
                                <p className="truncate text-sm">{file.name}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="chats">
                    <div className="flex w-full flex-col gap-2 p-2">
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
                </TabsContent>
            </ScrollArea>
        </div>
    );
}
