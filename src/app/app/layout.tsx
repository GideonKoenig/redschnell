import { ActionBar } from "~/app/app/_components/top-right";
import { ThemeToggle } from "~/components/theme-toggle";
import { Tabs } from "~/components/ui/tabs";
import { UploadModal } from "~/app/app/_components/upload-modal";
import { Collapsible, CollapsibleContent } from "~/components/ui/collapsible";
import { UploadProgressProvider } from "~/uploadthing/upload-progress-provider";
import { SidebarHeader } from "~/app/app/_components/top-left";
import { Sidebar } from "~/app/app/_components/bottom-left";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <ThemeToggle className="absolute left-0 top-0" />
            <UploadProgressProvider>
                <UploadModal />
                <Tabs defaultValue="files" className="w-full">
                    <Collapsible defaultOpen asChild>
                        <main className="grid h-screen w-screen grid-cols-[22rem_auto] gap-4 bg-menu-main p-4 data-[state=closed]:grid-cols-1 dark:bg-dark-menu-main">
                            <CollapsibleContent asChild>
                                <SidebarHeader />
                            </CollapsibleContent>

                            <ActionBar />

                            <CollapsibleContent>
                                <Sidebar />
                            </CollapsibleContent>

                            <div className="h-[calc(100vh-6.5rem)] w-full rounded-lg border border-menu-hover bg-menu-main p-4 shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
                                {children}
                            </div>
                        </main>
                    </Collapsible>
                </Tabs>
            </UploadProgressProvider>
        </>
    );
}
