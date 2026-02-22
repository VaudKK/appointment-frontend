"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function getBaseUrl(): string {
    if (typeof window === "undefined") {
        return "";
    }

    return window.location.origin;
}

export default function SettingsPage() {
    const { data: session } = authClient.useSession();
    const [isCopying, setIsCopying] = useState(false);

    const storeSlug = session?.user.organizationSlug?.trim() ?? "";

    const storeHomeUrl = useMemo(() => {
        if (!storeSlug) {
            return "";
        }
        return `${getBaseUrl()}/store/${storeSlug}/home`;
    }, [storeSlug]);

    const storeServicesUrl = useMemo(() => {
        if (!storeSlug) {
            return "";
        }
        return `${getBaseUrl()}/store/${storeSlug}/services`;
    }, [storeSlug]);

    const copyStoreUrl = async (url: string) => {
        if (!url || isCopying) {
            return;
        }

        try {
            setIsCopying(true);
            await navigator.clipboard.writeText(url);
            toast.success("Store URL copied");
        } catch {
            toast.error("Failed to copy store URL");
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Share your store link with customers.</p>
            </div>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Store URL
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!storeSlug ? (
                        <p className="text-sm text-muted-foreground">
                            No store slug was found for this account. Please contact support to set your store slug.
                        </p>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">Home URL</p>
                                <div className="flex gap-2">
                                    <Input value={storeHomeUrl} readOnly />
                                    <Button type="button" variant="outline" onClick={() => copyStoreUrl(storeHomeUrl)} disabled={isCopying}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" asChild>
                                        <Link href={`/store/${storeSlug}/home`} target="_blank">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">Services URL</p>
                                <div className="flex gap-2">
                                    <Input value={storeServicesUrl} readOnly />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => copyStoreUrl(storeServicesUrl)}
                                        disabled={isCopying}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button type="button" asChild>
                                        <Link href={`/store/${storeSlug}/services`} target="_blank">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
