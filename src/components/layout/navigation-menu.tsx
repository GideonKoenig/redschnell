import Link from "next/link";
import { AudioLines } from "lucide-react";
import { cn } from "~/lib/utils";
import { type ReactNode } from "react";
import { LoginButton } from "~/components/auth/login-button";
import { Button } from "~/components/ui/button";

export function NavigationBar(props: { className?: string }) {
    return (
        <nav className={cn("w-full border-b border-border", props.className)}>
            {/* px-3 offsets the buttons' own padding, so labels line up with the px-6 page content. */}
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-1 px-3">
                <NavBarLink href="/" className="font-semibold">
                    <AudioLines className="size-5 text-accent" />
                    RedSchnell
                </NavBarLink>

                <NavBarLink href="/app" className="text-text-muted">
                    App
                </NavBarLink>

                <div className="grow" />

                <LoginButton />
            </div>
        </nav>
    );
}

function NavBarLink(props: {
    children?: ReactNode;
    className?: string;
    href: string;
}) {
    return (
        <Button variant="ghost" size="sm" className={props.className} asChild>
            <Link href={props.href}>{props.children}</Link>
        </Button>
    );
}
