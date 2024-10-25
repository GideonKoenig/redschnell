"use client";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function LoginButton(props: { session: Session | null }) {
    if (props.session) {
        return (
            <Button variant="ghost" onMouseDown={() => signOut()}>
                Sign out
            </Button>
        );
    }
    return (
        <Button
            variant="ghost"
            className="h-12 px-4"
            onMouseDown={() => signIn()}
        >
            Sign in
        </Button>
    );
}
