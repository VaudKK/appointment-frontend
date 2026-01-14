import {Providers} from "@/app/providers";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-background text-foreground">
            <Providers>{children}</Providers>
        </section>
    );
}
