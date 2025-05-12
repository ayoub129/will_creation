"use client"

import type React from "react"
import { SiteFooter } from "@/components/site-footer"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FooterWrapper />
    </>
  )
}

// Client component to handle pathname check
function FooterWrapper() {
  const pathname = usePathname()
  const showFooter = !pathname?.startsWith("/create-will") && !pathname?.startsWith("/auth")

  return showFooter ? <SiteFooter /> : null
}
