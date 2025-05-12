import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real implementation, this would be a database
const applications = []
const influencers = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if user is admin
    const sessionId = cookies().get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, this would check if the user is an admin

    const application = applications.find((app) => app.id === id)

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error getting application:", error)
    return NextResponse.json({ error: "Failed to get application" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status, notes } = await request.json()

    // Check if user is admin
    const sessionId = cookies().get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, this would check if the user is an admin

    const applicationIndex = applications.findIndex((app) => app.id === id)

    if (applicationIndex === -1) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Update application status
    applications[applicationIndex].status = status
    applications[applicationIndex].notes = notes || applications[applicationIndex].notes

    // If approved, create an influencer account
    if (status === "approved") {
      const application = applications[applicationIndex]

      // Check if influencer already exists
      const existingInfluencer = influencers.find((inf) => inf.email === application.email)

      if (!existingInfluencer) {
        // Create new influencer
        const newInfluencer = {
          id: `inf_${Date.now()}`,
          name: application.name,
          email: application.email,
          socialMedia: application.socialMedia,
          referralCode: generateReferralCode(application.name),
          applicationId: id,
          createdAt: new Date().toISOString(),
          stats: {
            visits: 0,
            signups: 0,
            completedWills: 0,
            earnings: 0,
          },
        }

        influencers.push(newInfluencer)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status}`,
    })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

// Helper function to generate a referral code
function generateReferralCode(name: string): string {
  const prefix = name.slice(0, 3).toLowerCase()
  const randomString = Math.random().toString(36).substring(2, 7)
  return `${prefix}-${randomString}`
}
