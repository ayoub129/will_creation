// File: /app/api/wills/save/route.ts

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { willData, userId } = body

    if (!willData || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const { data, error } = await supabase.from("wills").insert([
      {
        user_id: userId,
        data: willData,
      },
    ])

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Failed to save will" }, { status: 500 })
  }
}
