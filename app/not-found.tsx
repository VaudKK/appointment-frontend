import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-4">
                <p className="text-sm font-medium text-primary">404</p>
                <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
                <p className="text-muted-foreground">
                    The page you are looking for does not exist or may have been moved.
                </p>
                <Link href="/" className="inline-block">
                    <Button size="lg">Back to Home</Button>
                </Link>
            </div>
        </main>
    );
}
