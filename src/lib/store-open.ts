import { prisma } from '@/lib/prisma'

/** Shop accepts orders when open; missing settings row defaults to open. */
export async function isStoreOpen(): Promise<boolean> {
  const row = await prisma.storeSetting.findUnique({
    where: { id: 'default' },
    select: { isOpen: true },
  })
  if (!row) return true
  return row.isOpen
}
