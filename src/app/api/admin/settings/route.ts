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
          isOpen: true,
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
    console.error('[settings PUT] Unauthorized — token missing or invalid')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('[settings PUT] body received:', JSON.stringify(body))

    const settings = await prisma.storeSetting.upsert({
      where: { id: 'default' },
      update: {
        ...(typeof body.name === 'string' && { name: body.name }),
        ...(typeof body.address === 'string' && { address: body.address }),
        ...(typeof body.phone === 'string' && { phone: body.phone }),
        ...(typeof body.email === 'string' && { email: body.email }),
        ...(typeof body.isOpen === 'boolean' && { isOpen: body.isOpen }),
      },
      create: {
        id: 'default',
        name: body.name || process.env.NEXT_PUBLIC_STORE_NAME || 'YaNa Kiosk',
        address: body.address || process.env.NEXT_PUBLIC_STORE_ADDRESS || '',
        phone: body.phone || process.env.NEXT_PUBLIC_STORE_PHONE || '',
        email: body.email || process.env.NEXT_PUBLIC_STORE_EMAIL || '',
        isOpen: typeof body.isOpen === 'boolean' ? body.isOpen : true,
      },
    })

    console.log('[settings PUT] saved isOpen =', settings.isOpen)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('[settings PUT] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings', detail: String(error) },
      { status: 500 }
    )
  }
}
