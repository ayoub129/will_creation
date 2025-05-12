"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ReferralRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const referral = params.referral as string

  useEffect(() => {
    if (referral) {
      localStorage.setItem("referral_code", referral)
      router.push("/") // Redirect to homepage
    }
  }, [referral, router])
}
