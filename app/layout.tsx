import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import {Navbar} from "@/components/nav-bar";
import {Providers} from "@/app/providers";


export const metadata: Metadata = {
  title: "KwaWakati",
  description: "Appointment Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body className="min-h-screen bg-background text-foreground">
              <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {/*<Navbar/>*/}
                  <Providers>
                      {children}
                  </Providers>
              </main>
          </body>
      </html>
  );
}
