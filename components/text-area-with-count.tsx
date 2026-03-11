"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Textarea, TextareaProps } from "@/components/ui/textarea"

interface TextAreaWithCountProps extends TextareaProps {
  maxLength: number
}

export default function TextAreaWithCount({ maxLength, value: externalValue, onChange, ...props }: Readonly<TextAreaWithCountProps>) {
  const normalizeValue = (value: TextareaProps["value"]) => {
    if (typeof value === "string") {
      return value
    }
    if (typeof value === "number") {
      return String(value)
    }
    if (Array.isArray(value)) {
      return value.join("")
    }
    return ""
  }

  const [value, setValue] = React.useState(() => normalizeValue(externalValue))

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value
    setValue(newValue)
    // Call the form's onChange handler if provided
    if (onChange) {
      event.target.value = newValue
      onChange(event)
    }
  }

  return (
    <div className="grid w-full gap-2">
      <Label>Your Notes</Label>
      <Textarea
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
      <div className="text-sm text-muted-foreground text-right">
        {value.length}/{maxLength} characters
      </div>
    </div>
  )
}
