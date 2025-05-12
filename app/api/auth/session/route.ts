import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ user: null })
    }

    // Fetch user from your custom `users` table
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (error) {
      console.error("User fetch error:", error.message)
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ message: "An error occurred checking session" }, { status: 500 })
  }
}
