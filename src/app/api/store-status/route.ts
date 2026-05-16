import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** Public: whether the shop currently accepts orders. */
export async function GET() {
  try {
    const row = await prisma.storeSetting.findUnique({
      where: { id: 'default' },
      select: { isOpen: true },
    })
    return NextResponse.json({ isOpen: row?.isOpen !== false })
  } catch (error) {
    console.error('store-status GET:', error)
    return NextResponse.json({ isOpen: true })
  }
}
