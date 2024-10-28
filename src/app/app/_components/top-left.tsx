import { PanelRightOpen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CollapsibleTrigger } from "~/components/ui/collapsible";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";

export function SidebarHeader() {
    return (
        <div className="h-14 rounded-lg border border-menu-hover bg-menu-light p-1 shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
            <TabsList className="h-full w-full bg-menu-light p-0">
                <TabsTrigger value="files">Your files</TabsTrigger>
                <TabsTrigger value="chats">Your chats</TabsTrigger>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost">
                        <PanelRightOpen />
                    </Button>
                </CollapsibleTrigger>
            </TabsList>
        </div>
    );
}
