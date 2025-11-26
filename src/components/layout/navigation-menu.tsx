import Link from "next/link";
import { AudioLines } from "lucide-react";
import { cn } from "~/lib/utils";
import { type ReactNode } from "react";
import { LoginButton } from "~/components/auth/login-button";

export function NavigationBar(props: { className?: string }) {
    return (
        <nav
            className={cn(
                "border-accent flex w-full flex-row items-center border-t-4 px-2",
                props.className,
            )}
        >
            <NavBarLink href="/" className="gap-2 font-semibold">
                <AudioLines className="size-5" />
                RedSchnell
            </NavBarLink>

            <NavBarLink href="/app">App</NavBarLink>

            <div className="grow" />

            <LoginButton />
        </nav>
    );
}

function NavBarLink(props: {
    children?: ReactNode;
    className?: string;
    href: string;
}) {
    return (
        <Link
            className={cn(
                "hover:bg-bg-muted flex h-10 flex-row items-center rounded-md px-3 text-sm",
                props.className,
            )}
            href={props.href}
        >
            {props.children}
        </Link>
    );
}
