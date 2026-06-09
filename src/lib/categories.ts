import { prisma } from '@/lib/prisma'

const DEFAULT_CATEGORY_NAMES = ['Süße Snacks', 'Salzige Snacks']

/** Ensure standard snack categories exist in the database. */
export async function ensureDefaultCategories() {
  await Promise.all(
    DEFAULT_CATEGORY_NAMES.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )
}

/** Import product categories + ensure snack defaults exist. */
export async function syncCategoriesFromProducts() {
  await ensureDefaultCategories()

  const products = await prisma.product.findMany({ select: { category: true } })
  const names = [...new Set(products.map((p) => p.category).filter(Boolean))]

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
