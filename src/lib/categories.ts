import { prisma } from '@/lib/prisma'

/** Import distinct product category names into Category table when empty. */
export async function syncCategoriesFromProducts() {
  const existing = await prisma.category.count()
  if (existing > 0) return

  const products = await prisma.product.findMany({ select: { category: true } })
  const names = [...new Set(products.map((p) => p.category).filter(Boolean))]
  if (names.length === 0) return

  await Promise.all(
    names.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )
}

/** Jugendschutz: nicotine / tobacco related category names. */
export function isAgeRestrictedCategory(name: string): boolean {
  const c = name.toLowerCase()
  return /rauch|shisha|vape|zigarette|tabak|e-zigarette|nikotin|drehtabak|wasserpfeife/.test(c)
}
