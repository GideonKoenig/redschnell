import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

/** Leads back to the source list on phones, where the sidebar is hidden on every page but /app. */
export function BackLink() {
    return (
        <Button
            size="icon-sm"
            variant="ghost"
            title="Back to sources"
            className="md:hidden"
            asChild
        >
            <Link href="/app">
                <ArrowLeft />
            </Link>
        </Button>
    );
}
