import type React from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "My Easy Will - Create Your Will Online",
  description: "Create a legally binding will online in minutes with My Easy Will.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
             <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
