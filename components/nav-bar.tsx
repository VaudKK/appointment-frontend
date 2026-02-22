"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface NavbarProps {
    storeSlug?: string;
}

export function Navbar({ storeSlug }: NavbarProps) {
    const homeHref = storeSlug ? `/store/${storeSlug}/home` : "/";
    const servicesHref = storeSlug ? `/store/${storeSlug}/services` : "/services";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href={homeHref} className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">KwaWakati</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href={homeHref} className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href={servicesHref} className="text-sm font-medium hover:text-primary transition-colors">
                            Services
                        </Link>
                        {/*<div className="flex items-center gap-3 ml-4">*/}
                        {/*    <Button variant="ghost" size="sm">*/}
                        {/*        Log In*/}
                        {/*    </Button>*/}
                        {/*    <Button size="sm">Sign Up</Button>*/}
                        {/*</div>*/}
                    </nav>

                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href={homeHref} className="text-lg font-medium hover:text-primary transition-colors">
                                    Home
                                </Link>
                                <Link href={servicesHref} className="text-lg font-medium hover:text-primary transition-colors">
                                    Services
                                </Link>
                                <div className="flex flex-col gap-3 mt-4">
                                    <Button variant="outline" className="w-full bg-transparent">
                                        Log In
                                    </Button>
                                    <Button className="w-full">Sign Up</Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
