import React from 'react'
import {AlertCircle} from "lucide-react";

interface FetchErrorProps{
    message: string
}

const FetchError = ({message}:FetchErrorProps) => {
    return (
        <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{message}</p>
        </div>
    )
}
export default FetchError
