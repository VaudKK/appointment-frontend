"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {useMutation} from "@tanstack/react-query";
import {sendOTP, verifyOTP} from "@/lib/api/booking";

interface OTPVerificationProps {
    phoneNumber: string
    onVerified: () => void
}

export function OTPVerification({ phoneNumber, onVerified }: OTPVerificationProps) {
    const [otp, setOtp] = useState("");
    const [otpSent,setOtpSent] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(300);// 5 minutes
    const [isExpired, setIsExpired] = useState(false);

    const sendOtpMutation = useMutation({
        mutationFn: (msisdn: string) => sendOTP(msisdn),
        onError: (error) => {
            setError(error.message)
            setOtpSent(false)
            setIsVerifying(false)
        },
        onSuccess: (data) => {
            setOtpSent(true)
            setSessionId(data.sessionId)
        }
    })

    const sendOtp = () => {
        sendOtpMutation.mutate(phoneNumber);
    };


    useEffect(() => {
        if (!otpSent){
            sendOtp();
        }

        if (otpSent){
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsExpired(true)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [otpSent])


    const verifyOtpMutation = useMutation({
        mutationFn: () => verifyOTP(sessionId,otp),
        onError: (error) => {
            setError(error.message)
            setOtpSent(false)
        },
        onSuccess: () => {
            setIsVerifying(false)
            onVerified()
        }
    })

    const handleVerify = async () => {
        setError("")
        setIsVerifying(true)
        verifyOtpMutation.mutate()
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Verify Your Phone Number</h3>
                <p className="text-sm text-muted-foreground">
                    We&apos;ve sent a 6-digit OTP to <span className="font-medium">{phoneNumber}</span>
                </p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isExpired && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>OTP has expired. Please request a new one.</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    disabled={isExpired}
                />
            </div>

            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Code expires in {formatTime(timeLeft)}</span>
                <Button variant="ghost" size="sm" disabled={!isExpired}>
                    {isExpired ? "Expired" : "Resend OTP"}
                </Button>
            </div>

            <Button onClick={handleVerify} className="w-full" disabled={isVerifying || isExpired || otp.length !== 6}>
                {isVerifying ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                    </>
                ) : (
                    "Verify & Complete Booking"
                )}
            </Button>
        </div>
    )
}
