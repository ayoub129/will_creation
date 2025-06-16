import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
apiVersion: "2025-04-30.basil",
})

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()

    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in pence
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        product: "My Easy Will",
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating payment intent:", error instanceof Error ? error.message : error)
    console.error("Stripe error:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
