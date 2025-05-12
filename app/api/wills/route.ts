import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real app, this would be in a database
const wills = []

export async function GET(request: Request) {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // In a real app, this would filter by user ID
    // For demo purposes, we'll just return all wills
    return NextResponse.json({ wills })
  } catch (error) {
    console.error("Error fetching wills:", error)
    return NextResponse.json({ message: "Failed to fetch wills" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const willData = await request.json()

    // In a real app, this would save to a database with user ID
    // For demo purposes, we'll just add to the array
    const newWill = {
      id: `will_${Date.now()}`,
      ...willData,
      userId: "user_id_would_come_from_session",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    wills.push(newWill)

    return NextResponse.json({ will: newWill })
  } catch (error) {
    console.error("Error creating will:", error)
    return NextResponse.json({ message: "Failed to create will" }, { status: 500 })
  }
}
