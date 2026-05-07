import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let settings = await prisma.storeSetting.findUnique({
      where: { id: 'default' },
    })

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          id: 'default',
          name: process.env.NEXT_PUBLIC_STORE_NAME || 'YaNa Kiosk',
          address: process.env.NEXT_PUBLIC_STORE_ADDRESS || '',
          phone: process.env.NEXT_PUBLIC_STORE_PHONE || '',
          email: process.env.NEXT_PUBLIC_STORE_EMAIL || '',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const settings = await prisma.storeSetting.upsert({
      where: { id: 'default' },
      update: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
      },
      create: {
        id: 'default',
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
