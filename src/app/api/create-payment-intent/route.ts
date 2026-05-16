import { NextRequest, NextResponse } from 'next/server'
import { isStoreOpen } from '@/lib/store-open'

export async function POST(request: NextRequest) {
  try {
    if (!(await isStoreOpen())) {
      return NextResponse.json(
        { error: 'Der Shop ist derzeit geschlossen. Zahlungen sind nicht möglich.' },
        { status: 403 }
      )
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      console.error('STRIPE ERROR: STRIPE_SECRET_KEY is not set in environment')
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

    const amountInCents = Math.round(amount * 100)

    // Use URLSearchParams properly — automatic_payment_methods must be sent as a string
    const formBody = new URLSearchParams()
    formBody.append('amount', amountInCents.toString())
    formBody.append('currency', 'eur')
    formBody.append('automatic_payment_methods[enabled]', 'true')

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    })

    const data = await stripeRes.json()

    if (!stripeRes.ok) {
      console.error('Stripe API error:', JSON.stringify(data))
      return NextResponse.json(
        { error: data.error?.message || 'Payment failed' },
        { status: stripeRes.status }
      )
    }

    console.log('Stripe payment intent created:', data.id)

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
