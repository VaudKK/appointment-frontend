import Link from "next/link"

export function CustomerFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© 2026 KwaWakati. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/terms-of-use" className="hover:text-foreground">
            Terms of use
          </Link>
          <Link href="/privacy-policy" className="hover:text-foreground">
            Privacy policy
          </Link>
          <Link href="/store-owner-agreement" className="hover:text-foreground">
            Store owner agreement
          </Link>
        </div>
      </div>
    </footer>
  )
}
