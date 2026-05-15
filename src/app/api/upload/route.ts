import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Try Vercel Blob first, fallback to base64 data URL
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN

    if (blobToken) {
      const { put } = await import('@vercel/blob')
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: file.type,
      })

      return NextResponse.json({ url: blob.url })
    }

    // Fallback: return base64 data URL
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
