import { NextResponse } from "next/server"

export async function GET() {
  // In a real implementation, this would generate a PDF or fetch it from storage
  // For now, we'll just return a mock response

  return NextResponse.json({
    success: true,
    downloadUrl: "/sample-will.pdf", // This would be a real URL in production
    message: "Sample will PDF is ready for download",
  })
}
