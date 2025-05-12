import { NextResponse } from "next/server"

// In a real app, this would be a database query
// For demo purposes, we're using the same in-memory store
import { users } from "../register/route"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = users.find((u) => u.email === email)

    // For security reasons, always return success even if user doesn't exist
    // This prevents email enumeration attacks

    // In a real app, you would:
    // 1. Generate a secure token
    // 2. Store it with an expiry time
    // 3. Send an email with a reset link containing the token

    return NextResponse.json({
      message: "If an account exists with this email, password reset instructions will be sent",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ message: "An error occurred during password reset" }, { status: 500 })
  }
}
