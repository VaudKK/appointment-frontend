import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardShell from "@/components/admin-dashboard-shell";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authResult = await authorizeAdminRequest(await headers());
    if (!authResult.authorized) {
        redirect("/admin/me/signin");
    }

    return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
