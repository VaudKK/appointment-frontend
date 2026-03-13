"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { fetchMpesaCredentials, MpesaCredentials, registerMpesaCredentials } from "@/lib/api/mpesa";

function getBaseUrl(): string {
    if (typeof window === "undefined") {
        return "";
    }

    return window.location.origin;
}

export default function SettingsPage() {
    const { data: session } = authClient.useSession();
    const [isCopying, setIsCopying] = useState(false);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [isLoadingMpesa, setIsLoadingMpesa] = useState(true);
    const [isSavingMpesa, setIsSavingMpesa] = useState(false);
    const [mpesaCredentials, setMpesaCredentials] = useState<MpesaCredentials>({
        consumerKey: "",
        consumerSecret: "",
        shortCode: "",
        initiatorName: "",
        initiatorPassword: "",
    });
    const [showCredentials, setShowCredentials] = useState<Record<keyof MpesaCredentials, boolean>>({
        consumerKey: false,
        consumerSecret: false,
        shortCode: false,
        initiatorName: false,
        initiatorPassword: false,
    });

    const storeSlug = session?.user.organizationSlug?.trim() ?? "";
    const organizationId = session?.user.organizationId?.trim() ?? "";

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

    useEffect(() => {
        authClient.token().then((tokenPayload) => {
            setToken(tokenPayload.data?.token);
        });
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }

        const loadCredentials = async () => {
            try {
                setIsLoadingMpesa(true);
                const data = await fetchMpesaCredentials(token);
                setMpesaCredentials(data);
            } catch {
                toast.error("Failed to load Mpesa credentials");
            } finally {
                setIsLoadingMpesa(false);
            }
        };

        loadCredentials();
    }, [token]);


    const updateCredentialField = (field: keyof MpesaCredentials, value: string) => {
        setMpesaCredentials((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const toggleCredentialVisibility = (field: keyof MpesaCredentials) => {
        setShowCredentials((current) => ({
            ...current,
            [field]: !current[field],
        }));
    };

    const saveMpesaCredentials = async () => {
        if (!token || isSavingMpesa) {
            return;
        }

        try {
            setIsSavingMpesa(true);
            await registerMpesaCredentials(token, organizationId, mpesaCredentials);
            toast.success("Mpesa credentials saved");
        } catch {
            toast.error("Failed to save Mpesa credentials");
        } finally {
            setIsSavingMpesa(false);
        }
    };


    const credentialFields: Array<{
        key: keyof MpesaCredentials;
        label: string;
        placeholder: string;
    }> = [
        { key: "consumerKey", label: "ConsumerKey", placeholder: "Enter ConsumerKey" },
        { key: "consumerSecret", label: "ConsumerSecret", placeholder: "Enter ConsumerSecret" },
        { key: "shortCode", label: "ShortCode", placeholder: "Enter ShortCode" },
        { key: "initiatorName", label: "InitiatorName", placeholder: "Enter InitiatorName" },
        { key: "initiatorPassword", label: "InitiatorPassword", placeholder: "Enter InitiatorPassword" },
    ];

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

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-lg">Mpesa Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingMpesa ? (
                        <p className="text-sm text-muted-foreground">Loading credentials...</p>
                    ) : (
                        <>
                            {credentialFields.map((field) => {
                                const isVisible = showCredentials[field.key];
                                return (
                                    <div className="space-y-2" key={field.key}>
                                        <p className="text-sm font-medium text-foreground">{field.label}</p>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => toggleCredentialVisibility(field.key)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                aria-label={`${isVisible ? "Hide" : "Show"} ${field.label}`}
                                            >
                                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            <Input
                                                type={isVisible ? "text" : "password"}
                                                value={mpesaCredentials[field.key]}
                                                onChange={(e) => updateCredentialField(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="pl-10"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <div>
                                <Button type="button" onClick={saveMpesaCredentials} disabled={!token || !organizationId || isSavingMpesa}>
                                    {isSavingMpesa ? "Saving..." : "Save Credentials"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
