import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real implementation, this would be a database
const referrals = []

export async function POST(request: Request) {
  try {
    const { referralCode } = await request.json()

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 })
    }

    // Store the referral code in a cookie for attribution
    cookies().set("referral_code", referralCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking referral:", error)
    return NextResponse.json({ error: "Failed to track referral" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const referralCode = cookies().get("referral_code")?.value

    return NextResponse.json({ referralCode })
  } catch (error) {
    console.error("Error getting referral:", error)
    return NextResponse.json({ error: "Failed to get referral" }, { status: 500 })
  }
}
