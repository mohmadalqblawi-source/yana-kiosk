import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('[admin/categories GET]', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name } = await request.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const category = await prisma.category.create({
      data: { name: name.trim() },
    })
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
    const { id, name } = await request.json()
    if (!id || !name?.trim()) {
      return NextResponse.json({ error: 'id and name are required' }, { status: 400 })
    }
    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
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

export async function DELETE(request: NextRequest) {
  const admin = requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[admin/categories DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
