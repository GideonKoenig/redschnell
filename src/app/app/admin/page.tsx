import { notFound } from "next/navigation";
import { UserList } from "~/components/admin/user-list";
import { getUser } from "~/lib/auth-server";

export default async function AdminPage() {
    const user = await getUser();
    if (user?.role !== "admin") notFound();

    return <UserList />;
}
