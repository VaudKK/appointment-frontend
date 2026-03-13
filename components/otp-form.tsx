"use client"

import {Card, CardContent, CardTitle} from "@/components/ui/card"
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {useMutation} from "@tanstack/react-query";
import {sendOTP, verifyOTP} from "@/lib/api/booking";
import {AlertCircle} from "lucide-react";

interface OtpProps {
    subject: string
    onOtpVerified: () => void
}

export default function OtpForm({subject,onOtpVerified}: OtpProps) {

    const [value, setValue] = React.useState("")
    const [timeLeft, setTimeLeft] = useState(30)
    const [sessionId, setSessionId] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [loading,setIsLoading] = useState(false)

    const normalizePhoneNumber = (input: string) => input.replace(/\s+/g, "");

    const isValidPhoneNumber = (input: string) => /^\+254[17]\d{8}$/.test(input);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    useEffect(() => {
        const normalized = normalizePhoneNumber(subject)

        if (!isValidPhoneNumber(normalized)) {
            setError("Phone number must be in format +2541XXXXXXXX or +2547XXXXXXXX.")
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        sendOtpMutation.mutate(normalized)
    }, [])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const sendOtpMutation = useMutation({
        mutationFn: (msisdn: string) => sendOTP(msisdn,"sms"),
        onError: (error) => {
            setError(error.message)
            setIsLoading(false)
        },
        onSuccess: (data) => {
            setSessionId(data.sessionId)
            setIsLoading(false)
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: () => verifyOTP(sessionId,value),
        onError: (error) => {
            setError(error.message)
            setIsVerifying(false)
        },
        onSuccess: (data) => {
            setIsVerifying(false)
            onOtpVerified()
        }
    })

    const handleResend = () => {
        setTimeLeft(60)
    }

    const handleVerify = (value: string) => {
        setValue(value)
        if(value.length === 6){
            setIsVerifying(true)
            verifyOtpMutation.mutate()
        }
    }

    if (loading){
        return (
            <div className="flex justify-center items-center min-h-screen py-8">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary"></div>
            </div>
        )
    }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h3 className="mt-2 text-center text-lg font-bold dark:text-foreground text-primary">
            An OTP has been sent to your email
          </h3>
        </div>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardTitle className={"text-center"}>Verify Your Account</CardTitle>
          <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className='space-y-3'>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <InputOTP maxLength={6}
                            value={value}
                            onChange={(value) => handleVerify(value)}>
                      <InputOTPGroup className='gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                      </InputOTPGroup>
                  </InputOTP>
              </div>
              {isVerifying && (
                  <div className="flex mt-4 justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
              )}
              {error && error.length > 0 && (
                  <div className="flex mt-4 mb-4 gap-3 p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{error}</p>
                  </div>
              )}
              <div className="text-center text-sm mt-4">
                  <p className='text-muted-foreground text-sm'>
                      {timeLeft > 0 ? (
                          `Resend OTP in ${formatTime(timeLeft)}`
                      ) : (
                          <a
                              href='#'
                              onClick={e => {
                                  e.preventDefault()
                                  handleResend()
                              }}
                              className='hover:text-primary underline'
                          >
                              Resend code
                          </a>
                      )}
                  </p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
