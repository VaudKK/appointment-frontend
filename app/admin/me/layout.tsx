import {Providers} from "@/app/providers";
import React from "react";

export default function MeLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-background text-foreground">
            <span className="text-2xl font-bold text-primary">KwaWakati</span>
            <Providers>{children}</Providers>
        </section>
    );
}
