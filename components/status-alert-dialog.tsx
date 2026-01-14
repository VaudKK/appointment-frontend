"use client"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type AlertType = "success" | "error" | "info"

interface StatusAlertDialogProps {
    isOpen: boolean
    onClose: () => void
    type: AlertType
    title: string
    message: string
    actionLabel?: string
    onAction?: () => void
}

export function StatusAlertDialog({
                                      isOpen,
                                      onClose,
                                      type,
                                      title,
                                      message,
                                      actionLabel = "Close",
                                      onAction,
                                  }: StatusAlertDialogProps) {
    const getIconAndColors = () => {
        switch (type) {
            case "success":
                return {
                    icon: CheckCircle2,
                    bgClass: "bg-green-50 dark:bg-green-950",
                    textClass: "text-green-600 dark:text-green-400",
                    borderClass: "border-green-200 dark:border-green-800",
                }
            case "error":
                return {
                    icon: XCircle,
                    bgClass: "bg-red-50 dark:bg-red-950",
                    textClass: "text-red-600 dark:text-red-400",
                    borderClass: "border-red-200 dark:border-red-800",
                }
            case "info":
                return {
                    icon: AlertCircle,
                    bgClass: "bg-blue-50 dark:bg-blue-950",
                    textClass: "text-blue-600 dark:text-blue-400",
                    borderClass: "border-blue-200 dark:border-blue-800",
                }
        }
    }

    const { icon: Icon, bgClass, textClass, borderClass } = getIconAndColors()

    const handleAction = () => {
        if (onAction) {
            onAction()
        }
        onClose()
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className={`border-2`}>
                <div className="flex items-start gap-4">
                    <Icon className={`h-6 w-6 mt-0.5 shrink-0 ${textClass}`} />
                    <div className="flex-1">
                        <AlertDialogHeader className="text-left">
                            <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
                            <AlertDialogDescription className="mt-2 text-base">{message}</AlertDialogDescription>
                        </AlertDialogHeader>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        onClick={handleAction}
                        variant={type === "error" ? "destructive" : "default"}
                        className="w-full sm:w-auto"
                    >
                        {actionLabel}
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
