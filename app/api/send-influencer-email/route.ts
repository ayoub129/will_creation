import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { email, name, status } = await req.json()

  if (!email || !name || !status) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  }

  const website = process.env.NEXT_PUBLIC_APP_URL || "https://makewillonline.com"
  const authLink = `${website}/auth?redirect=%2Fdashboard%2Finfluencer`

  const subject =
    status === "approved"
      ? "You're Approved as a My Easy Will Influencer! 🎉"
      : "Your Influencer Application Was Rejected"

  const message =
    status === "approved"
      ? `Hi ${name},

We're excited to let you know that your application to join the My Easy Will influencer program has been **approved**!

To get started, please register on our platform using the **same email** you applied with:

👉 ${authLink}

Once logged in, you'll get access to your dashboard, referral link, and earnings tracking.

Welcome aboard!

– The My Easy Will Team`
      : `Hi ${name},

Thank you for applying to become an influencer for My Easy Will.

Unfortunately, your application has been **rejected** at this time.

We appreciate your interest and encourage you to reapply in the future.

– The My Easy Will Team`

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"My Easy Will" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    })

    return NextResponse.json({ message: "Email sent successfully" })
  } catch (error: any) {
    console.error("Error sending influencer email:", error)
    return NextResponse.json({ error: "Failed to send email", detail: error.message }, { status: 500 })
  }
}
