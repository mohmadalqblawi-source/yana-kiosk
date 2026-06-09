import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { syncCategoriesFromProducts, normalizeCategoryData } from '@/lib/categories'
import { isValidIconKey, isValidColorKey } from '@/lib/category-styles'

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await syncCategoriesFromProducts()
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('[admin/categories GET]', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, icon, color } = await request.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const data = normalizeCategoryData(name, icon, color)
    const category = await prisma.category.create({ data })
    return NextResponse.json(category, { status: 201 })
  } catch (error: unknown) {
    const msg = String(error)
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Diese Kategorie existiert bereits' }, { status: 409 })
    }
    console.error('[admin/categories POST]', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, name, icon, color } = await request.json()
    if (!id || !name?.trim()) {
      return NextResponse.json({ error: 'id and name are required' }, { status: 400 })
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Kategorie nicht gefunden' }, { status: 404 })
    }

    const trimmed = name.trim()
    const updateData: { name: string; icon?: string; color?: string } = { name: trimmed }
    if (icon !== undefined && isValidIconKey(icon)) updateData.icon = icon
    if (color !== undefined && isValidColorKey(color)) updateData.color = color

    const category = await prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: updateData,
      })
      if (existing.name !== trimmed) {
        await tx.product.updateMany({
          where: { category: existing.name },
          data: { category: trimmed },
        })
      }
      return updated
    })

    return NextResponse.json(category)
  } catch (error: unknown) {
    const msg = String(error)
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Diese Kategorie existiert bereits' }, { status: 409 })
    }
    console.error('[admin/categories PUT]', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, icon, color } = await request.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const data: { icon?: string; color?: string } = {}
    if (icon !== undefined && isValidIconKey(icon)) data.icon = icon
    if (color !== undefined && isValidColorKey(color)) data.color = color
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'icon or color required' }, { status: 400 })
    }

    const category = await prisma.category.update({ where: { id }, data })
    return NextResponse.json(category)
  } catch (error) {
    console.error('[admin/categories PATCH]', error)
    return NextResponse.json({ error: 'Failed to update category style' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) {
      return NextResponse.json({ error: 'Kategorie nicht gefunden' }, { status: 404 })
    }

    const productCount = await prisma.product.count({
      where: { category: category.name },
    })
    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Kategorie wird von ${productCount} Produkt(en) verwendet und kann nicht gelöscht werden.`,
        },
        { status: 409 }
      )
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[admin/categories DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
