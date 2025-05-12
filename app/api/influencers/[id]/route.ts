import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real implementation, this would be a database
const influencers = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if user is admin or the influencer themselves
    const sessionId = cookies().get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, this would check if the user is an admin or the influencer

    const influencer = influencers.find((inf) => inf.id === id)

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 })
    }

    return NextResponse.json({ influencer })
  } catch (error) {
    console.error("Error getting influencer:", error)
    return NextResponse.json({ error: "Failed to get influencer" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()

    // Check if user is admin
    const sessionId = cookies().get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, this would check if the user is an admin

    const influencerIndex = influencers.findIndex((inf) => inf.id === id)

    if (influencerIndex === -1) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 })
    }

    // Update the influencer
    const updatedInfluencer = {
      ...influencers[influencerIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    influencers[influencerIndex] = updatedInfluencer

    return NextResponse.json({ influencer: updatedInfluencer })
  } catch (error) {
    console.error("Error updating influencer:", error)
    return NextResponse.json({ error: "Failed to update influencer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if user is admin
    const sessionId = cookies().get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, this would check if the user is an admin

    const influencerIndex = influencers.findIndex((inf) => inf.id === id)

    if (influencerIndex === -1) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 })
    }

    // Remove the influencer
    influencers.splice(influencerIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting influencer:", error)
    return NextResponse.json({ error: "Failed to delete influencer" }, { status: 500 })
  }
}
