"use client";

import Link from "next/link";
import { signOut, useSession } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { UserAvatar } from "~/components/auth/user-avatar";

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
        return (
            <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => signOut()}
            >
                <UserAvatar
                    name={session.user.name}
                    image={session.user.image}
                />
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
