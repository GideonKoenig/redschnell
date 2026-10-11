"use client";

import { LogOut, Undo2, Users } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { UserAvatar } from "~/components/auth/user-avatar";
import { Button } from "~/components/ui/button";
import { authClient, switchAccount } from "~/lib/auth-client";
import { type User } from "~/lib/auth-server";

/** Bottom row of the sidebar. During surrogation it shows the target user and returns to the admin's account. */
export function AccountBar(props: { user: User; surrogate: boolean }) {
    const [isPending, startTransition] = useTransition();

    const returnToAccount = () =>
        startTransition(async () => {
            const { error } = await authClient.admin.stopImpersonating();
            if (error) {
                toast.error(
                    error.message ?? "Could not return to your account",
                );
                return;
            }
            switchAccount();
        });

    const signOut = () =>
        startTransition(async () => {
            const { error } = await authClient.signOut();
            if (error) {
                toast.error(error.message ?? "Could not sign out");
                return;
            }
            switchAccount();
        });

    if (props.surrogate) {
        return (
            <button
                onClick={returnToAccount}
                disabled={isPending}
                title="Return to my account"
                className="flex h-12 items-center gap-2 rounded-b-lg border-t border-surrogate/40 bg-surrogate-muted px-3 text-left text-sm font-medium text-surrogate hover:bg-surrogate/15 disabled:opacity-50"
            >
                <UserAvatar name={props.user.name} image={props.user.image} />
                <span className="min-w-0 grow truncate">{props.user.name}</span>
                <Undo2 className="size-4 shrink-0" />
            </button>
        );
    }

    return (
        <div className="flex h-12 items-center gap-2 border-t border-border px-3">
            <UserAvatar name={props.user.name} image={props.user.image} />
            <span className="min-w-0 grow truncate text-sm text-text">
                {props.user.name}
            </span>
            {props.user.role === "admin" && (
                <Button size="icon-sm" variant="ghost" title="Users" asChild>
                    <Link href="/app/admin">
                        <Users />
                    </Link>
                </Button>
            )}
            <Button
                size="icon-sm"
                variant="ghost"
                title="Sign out"
                onClick={signOut}
                disabled={isPending}
            >
                <LogOut />
            </Button>
        </div>
    );
}
