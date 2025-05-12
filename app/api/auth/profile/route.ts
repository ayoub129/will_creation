import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real app, this would be a database query
// For demo purposes, we're using the same in-memory store
import { users } from "../register/route"

export async function PUT(request: Request) {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would look up the user associated with the session
    // For demo purposes, we'll just update the first user (if any exist)
    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const userData = await request.json()
    const user = users[0]

    // Update user data
    Object.assign(user, userData)

    // Return updated user (excluding password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "An error occurred updating profile" }, { status: 500 })
  }
}
