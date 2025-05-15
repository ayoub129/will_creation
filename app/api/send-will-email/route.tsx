// app/api/send-will-email/route.ts
import { NextRequest } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { WillDocument } from "@/components/pdf/WillDocument"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, willData } = body

  if (!email || !willData) {
    return new Response(JSON.stringify({ message: "Missing email or will data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const pdfBuffer = await renderToBuffer(<WillDocument will={willData} />)

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
      subject: "Your Last Will and Testament",
      text: "Please find your will attached as a PDF.",
      attachments: [
        {
          filename: "my-will.pdf",
          content: pdfBuffer,
        },
      ],
    })

    return new Response(JSON.stringify({ message: "Email sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Email sending failed:", error)
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
