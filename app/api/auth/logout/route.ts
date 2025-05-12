import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear session cookie
    cookies().set({
      name: "session_id",
      value: "",
      expires: new Date(0),
      path: "/",
    })

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}
