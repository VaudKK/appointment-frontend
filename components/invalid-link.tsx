import React from 'react'
import {AlertCircle} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

interface VerificationProps {
    title: string
    message: string
}

const InvalidLink = ({title, message}: VerificationProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center justify-center gap-6 px-4 text-center max-w-md">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">
                        {message}
                    </p>
                </div>

                <Link href="/admin/me/signin" className="w-full">
                    <Button className="w-full" size="lg">
                        Back to Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}
export default InvalidLink
