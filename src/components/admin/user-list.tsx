"use client";

import { Loader2, Search } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { BackLink } from "~/components/app/back-link";
import { UserAvatar } from "~/components/auth/user-avatar";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { authClient, switchAccount } from "~/lib/auth-client";
import { api } from "~/trpc/react";

/** All users, filtered by name, email or ID. Admins can switch into any non-admin account. */
export function UserList() {
    const [search, setSearch] = useState("");
    const [isPending, startTransition] = useTransition();
    const { data: users, isLoading } = api.admin.users.useQuery();

    const query = search.trim().toLowerCase();
    const matches = users?.filter((user) =>
        [user.name, user.email, user.id].some((value) =>
            value?.toLowerCase().includes(query),
        ),
    );

    const surrogate = (userId: string) =>
        startTransition(async () => {
            const { error } = await authClient.admin.impersonateUser({
                userId,
            });
            if (error) {
                toast.error(error.message ?? "Could not switch accounts");
                return;
            }
            switchAccount();
        });

    return (
        <div className="flex h-full flex-col">
            <header className="flex items-center gap-3 border-b border-border p-4">
                <BackLink />
                <h2 className="text-lg font-semibold text-text">Users</h2>
                <label className="ml-auto flex h-8 w-64 min-w-0 items-center gap-2 rounded-md border border-border px-2 focus-within:ring-[3px] focus-within:ring-accent/50">
                    <Search className="size-4 shrink-0 text-text-muted" />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Name, email or ID"
                        aria-label="Search users"
                        className="min-w-0 grow bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
                    />
                </label>
            </header>

            <ScrollArea className="min-h-0 grow">
                {isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="size-5 animate-spin text-text-muted" />
                    </div>
                )}

                {matches?.length === 0 && (
                    <p className="py-8 text-center text-sm text-text-muted">
                        No users found.
                    </p>
                )}

                <ul className="flex flex-col gap-1 p-2">
                    {matches?.map((user) => (
                        <li
                            key={user.id}
                            className="flex items-center gap-3 rounded-md p-2 hover:bg-bg-muted"
                        >
                            <UserAvatar
                                name={user.name}
                                image={user.image}
                                className="size-8"
                            />
                            <div className="min-w-0 grow">
                                <p className="truncate text-sm font-medium text-text">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-text-muted">
                                    {user.email}
                                </p>
                            </div>
                            {user.role !== "admin" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isPending}
                                    onClick={() => surrogate(user.id)}
                                >
                                    Surrogate
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </div>
    );
}
