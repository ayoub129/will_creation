import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, pdfUrl } = body;

  if (!email || !pdfUrl) {
    return new Response(JSON.stringify({ message: "Missing email or URL" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My Easy Will" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Will is Ready",
      html: `
        <p>Hello,</p>
        <p>Your will has been successfully generated. You can download it using the link below:</p>
        <p><a href="${pdfUrl}" target="_blank">${pdfUrl}</a></p>
        <p>Kind regards,<br/>My Easy Will</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Email sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
