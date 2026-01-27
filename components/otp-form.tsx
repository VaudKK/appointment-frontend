"use client"

import { Card, CardContent } from "@/components/ui/card"
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";



export default function OtpForm() {

    const [value, setValue] = React.useState("")
    const [timeLeft, setTimeLeft] = useState(30)

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleResend = () => {
        setTimeLeft(60)
    }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h3 className="mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
            Verify Your Account
          </h3>
        </div>

        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className='space-y-3'>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <InputOTP maxLength={6}
                            value={value}
                            onChange={(value) => setValue(value)}>
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