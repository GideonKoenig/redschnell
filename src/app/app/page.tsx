import { NavigationBar } from "~/components/ui/navigation-menu";

export default async function App() {
    return (
        <main className="flex h-full w-full flex-col">
            <NavigationBar className="bg-menu-main dark:bg-dark-menu-main" />
            Application
        </main>
    );
}
