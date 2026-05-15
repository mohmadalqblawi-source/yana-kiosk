import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, customerAddress, shippingMethod, items } = body

    const shipMethod = shippingMethod || 'pickup'
    const shippingCost = shipMethod === 'pickup' ? 0 : shipMethod === 'delivery' ? 3.00 : 4.90

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer info and items are required' },
        { status: 400 }
      )
    }

    const orderItems = items.map((item: { productId: string; productName: string; priceNet: number; vatRate: number; quantity: number }) => ({
      productId: item.productId,
      productName: item.productName,
      priceNet: item.priceNet,
      vatRate: item.vatRate,
      quantity: item.quantity,
    }))

    const totalNet = orderItems.reduce(
      (sum: number, item: { priceNet: number; quantity: number }) => sum + item.priceNet * item.quantity,
      0
    )

    const totalVat = orderItems.reduce(
      (sum: number, item: { priceNet: number; vatRate: number; quantity: number }) =>
        sum + item.priceNet * (item.vatRate / 100) * item.quantity,
      0
    )

    const totalGross = totalNet + totalVat + shippingCost

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        shippingMethod: shipMethod,
        shippingCost,
        items: {
          create: orderItems,
        },
        totalNet,
        totalVat,
        totalGross,
        status: 'pending',
      },
      include: { items: true },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
