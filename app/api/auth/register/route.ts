import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock database for users (in a real app, this would be a database)
const users = []

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Check if user already exists (case insensitive email check)
    const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
    }

    // Add user to "database"
    users.push(newUser)

    // Create session
    const sessionId = `session_${Date.now()}`

    // Set session cookie
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Store user in session (in a real app, this would be in a database or Redis)
    cookies().set("user_id", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      message: "Registration successful",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

export { users }
