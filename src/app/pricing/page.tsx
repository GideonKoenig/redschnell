import { NavigationBar } from "~/components/navigation-menu";

export default async function Pricing() {
    return (
        <main className="flex h-full w-full flex-col">
            <NavigationBar className="bg-menu-main dark:bg-dark-menu-main" />
            Pricing
        </main>
    );
}
