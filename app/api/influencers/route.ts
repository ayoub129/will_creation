import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real implementation, this would be a database
const influencers = []
const applications = []

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Check if user is admin
    const sessionId = cookies().get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, this would check if the user is an admin

    if (status) {
      const filteredInfluencers = influencers.filter((influencer) => influencer.status === status)
      return NextResponse.json({ influencers: filteredInfluencers })
    }

    return NextResponse.json({ influencers })
  } catch (error) {
    console.error("Error getting influencers:", error)
    return NextResponse.json({ error: "Failed to get influencers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Create a new application
    const newApplication = {
      id: `app_${Date.now()}`,
      name: data.name,
      email: data.email,
      dateApplied: new Date().toISOString(),
      ...data,
    }

    applications.push(newApplication)

    return NextResponse.json({ application: newApplication })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
