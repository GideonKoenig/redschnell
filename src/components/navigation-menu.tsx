import Link from "next/link";
import Icon from "assets/ear.svg";
import DarkIcon from "assets/ear-dark.svg";
import { ThemeToggle } from "~/components/theme-toggle";
import { cn } from "~/components/utils";
import { LoginButton } from "~/components/login-button";
import { getServerAuthSession } from "~/server/auth";
import { type ReactNode } from "react";

export async function NavigationBar(props: { className?: string }) {
    const session = await getServerAuthSession();
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center gap-4 border-t-[6px] border-accent-light p-2 dark:border-dark-accent-light",
                props.className,
            )}
        >
            <NavBarLink href="/">
                <Icon className="inline-block h-10 w-10 dark:hidden" />
                <DarkIcon className="hidden h-10 w-10 dark:inline-block" />
                <p>RedSchnell</p>
            </NavBarLink>

            <NavBarSpacer size={7} />

            <NavBarLink href="/app">
                <p>App</p>
            </NavBarLink>

            <NavBarLink href="/pricing">
                <p>Pricing</p>
            </NavBarLink>

            <NavBarSpacer />

            <ThemeToggle />

            <LoginButton session={session} />
        </div>
    );
}

function NavBarSpacer(props: { size?: number }) {
    return (
        <div
            className={!props.size ? "flex-grow" : ""}
            style={{ width: `${props.size}rem` }}
        />
    );
}

export function NavBarLink(props: {
    children?: ReactNode;
    className?: string;
    href: string;
}) {
    return (
        <Link
            className={cn(
                "flex h-12 flex-row items-center rounded px-4 hover:bg-menu-hover dark:hover:bg-dark-menu-hover",
                props.className,
            )}
            href={props.href}
        >
            {props.children}
        </Link>
    );
}
