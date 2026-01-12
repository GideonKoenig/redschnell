import { NavigationBar } from "~/components/layout/navigation-menu";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function NavbarLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ScrollArea className="h-dvh w-full">
            <div className="flex h-full min-h-dvh flex-col">
                <NavigationBar className="bg-bg-surface" />
                <div className="flex min-h-0 grow flex-col">{children}</div>
            </div>
        </ScrollArea>
    );
}
