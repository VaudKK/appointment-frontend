"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, Calendar, CalendarDays, Wrench, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            label: "Bookings",
            href: "/admin/dashboard/bookings",
            icon: Calendar,
        },
        {
            label: "Calendar View",
            href: "/admin/dashboard/calendar",
            icon: CalendarDays,
        },
        {
            label: "Services",
            href: "/admin/dashboard/services",
            icon: Wrench,
        },
        {
            label: "Settings",
            href: "/admin/dashboard/settings",
            icon: Settings,
        },
    ];

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/admin/me/signin");
                },
            },
        });
    };

    return (
        <section className="flex h-screen bg-background">
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-20",
                )}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-6 h-6 text-sidebar-primary" />
                            <span className="font-semibold text-sidebar-foreground">Admin</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-sidebar-accent rounded-md transition-colors"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5 text-sidebar-foreground" />
                        ) : (
                            <Menu className="w-5 h-5 text-sidebar-foreground" />
                        )}
                    </button>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 transition-colors",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        !sidebarOpen && "justify-center",
                                    )}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-2 border-t border-sidebar-border">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors",
                            !sidebarOpen && "justify-center",
                        )}
                        onClick={logout}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Log Out</span>}
                    </Button>
                </div>
            </aside>

            <div className={cn("flex-1 transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
                <div className="h-full overflow-auto">{children}</div>
            </div>
        </section>
    );
}
