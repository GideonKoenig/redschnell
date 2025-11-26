import { NavigationBar } from "~/components/layout/navigation-menu";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function NavbarLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ScrollArea className="h-dvh w-full">
            <div className="flex h-full min-h-dvh flex-col">
                <NavigationBar className="bg-bg-surface" />
                <div className="min-h-0 grow">{children}</div>
            </div>
        </ScrollArea>
    );
}
