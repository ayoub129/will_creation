import React from "react"
import { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"
import { renderToBuffer } from "@react-pdf/renderer"
import { WillDocument } from "@/components/pdf/WillDocument"

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, willData } = req.body
  if (!email || !willData) {
    return res.status(400).json({ message: "Missing email or will data" })
  }

  try {
    // ✅ Generate a Node.js-compatible Buffer
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

    return res.status(200).json({ message: "Email sent" })
  } catch (error: any) {
    console.error("Email sending failed:", error)
    return res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}
