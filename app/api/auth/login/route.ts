import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

// In a real app, this would be a database query
// For demo purposes, we're using the same in-memory store
// This is just a reference to the same array used in register route
import { users } from "../register/route"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    const sessionId = uuidv4()
    const sessionExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Set session cookie
    cookies().set({
      name: "session_id",
      value: sessionId,
      httpOnly: true,
      expires: sessionExpiry,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}
