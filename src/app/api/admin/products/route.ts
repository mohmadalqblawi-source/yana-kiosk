import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

function netFromBrutto(brutto: number, vatRate: number): number {
  return brutto / (1 + vatRate / 100)
}

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { name, description, priceBrutto, vatRate, category, image, featured } = body

    const vatRateNum = parseInt(vatRate)
    const priceNet = netFromBrutto(parseFloat(priceBrutto), vatRateNum)

    const product = await prisma.product.create({
      data: {
        name,
        description,
        priceNet,
        vatRate: vatRateNum,
        category,
        image: image || '',
        stock: 999,
        featured: featured || false,
        isActive: true,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, name, description, priceBrutto, vatRate, category, image, featured } = body

    const vatRateNum = parseInt(vatRate)
    const priceNet = netFromBrutto(parseFloat(priceBrutto), vatRateNum)

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        priceNet,
        vatRate: vatRateNum,
        category,
        image: image || '',
        featured: featured || false,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

/** Toggle isActive for a product */
export async function PATCH(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, isActive } = await request.json()
    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'id and isActive required' }, { status: 400 })
    }
    const product = await prisma.product.update({
      where: { id },
      data: { isActive },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to toggle product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 })

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
