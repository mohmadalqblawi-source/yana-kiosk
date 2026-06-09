import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncCategoriesFromProducts } from '@/lib/categories'

export async function GET() {
  try {
    await syncCategoriesFromProducts()
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
