"use client";

import Link from "next/link";
import { signOut, useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function LoginButton() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <Button variant="ghost" size="sm" disabled>
                Loading...
            </Button>
        );
    }

    if (session) {
        const firstLetter = session.user.name.slice(0, 1).toUpperCase();
        const secondLetter = session.user.name.slice(1, 2).toLowerCase();
        const initials = firstLetter + secondLetter;

        return (
            <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => signOut()}
            >
                <Avatar className="size-6">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback className="text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                Sign out
            </Button>
        );
    }

    return (
        <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
        </Button>
    );
}
