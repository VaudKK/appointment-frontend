import type { ReactNode } from "react"
import { CustomerFooter } from "@/components/customer-footer"

interface StoreLayoutProps {
  children: ReactNode
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
      <CustomerFooter />
    </div>
  )
}
