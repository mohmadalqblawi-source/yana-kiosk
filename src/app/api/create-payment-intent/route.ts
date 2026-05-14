import { NextRequest, NextResponse } from 'next/server'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Call Stripe API directly to create a payment intent
    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: 'eur',
        automatic_payment_methods: '{"enabled":true}',
      }),
    })

    const data = await stripeRes.json()

    if (!stripeRes.ok) {
      console.error('Stripe error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'Payment failed' },
        { status: stripeRes.status }
      )
    }

    return NextResponse.json({
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
