import React from 'react'
import {CheckCircle} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import InvalidLink from "@/components/invalid-link";

const VerificationPage = ({searchParams}: {searchParams: {error?: string}}) => {

    if (searchParams?.error){
        return (
            <InvalidLink title={"Invalid Verification Link"} message={"This email verificaton link has expired or is invalid."}/>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center justify-center gap-6 px-4 text-center max-w-md">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Email Verified</h1>
                    <p className="text-muted-foreground">
                        Your email has been successfully verified. You can now log in to your account.
                    </p>
                </div>

                <Link href="/admin/me/signin" className="w-full">
                    <Button className="w-full" size="lg">
                        Go to Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}
export default VerificationPage
