import { redirect } from "next/navigation";
import { DropZoneProvider } from "~/components/providers/drop-zone-provider";
import { UploadProgressProvider } from "~/components/providers/upload-progress-provider";
import { Toaster } from "~/components/ui/sonner";
import { getSession } from "~/lib/auth-server";
import { AppShell } from "~/components/app/app-shell";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();
    if (!session) redirect("/sign-in");

    return (
            <UploadProgressProvider>
            <DropZoneProvider>
                <AppShell>{children}</AppShell>
                <Toaster position="bottom-right" />
            </DropZoneProvider>
            </UploadProgressProvider>
    );
}
