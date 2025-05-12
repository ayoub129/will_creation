import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Mock user database for demonstration
const users = new Map()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isPreview = searchParams.get("preview") === "true"

    // In a real implementation, this would handle the OAuth flow with Google
    // For demonstration, we'll create a mock user

    // Generate a random email to simulate different users
    const randomId = Math.floor(Math.random() * 1000)
    const email = isPreview ? `user${randomId}@example.com` : "demo@example.com"

    // Check if this user already exists
    let user = Array.from(users.values()).find((u) => u.email === email)
    let isNewUser = false

    if (!user) {
      // Create a new user
      user = {
        id: uuidv4(),
        name: `Demo User ${randomId}`,
        email,
        createdAt: new Date().toISOString(),
        provider: "google",
      }
      users.set(user.id, user)
      isNewUser = true
    }

    // Set a session cookie
    try {
      cookies().set("session", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    } catch (error) {
      console.error("Failed to set cookie:", error)
    }

    if (isPreview) {
      // For preview/testing, return the user data
      return NextResponse.json({ user, isNewUser })
    } else {
      // In production, redirect to the appropriate page
      const redirectUrl = isNewUser ? "/create-will" : "/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
