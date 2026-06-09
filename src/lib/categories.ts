import { prisma } from '@/lib/prisma'
import { suggestCategoryKeys, SNACK_CATEGORY_PRESETS, isValidIconKey, isValidColorKey, DEFAULT_ICON_KEY, DEFAULT_COLOR_KEY } from '@/lib/category-styles'

function normalizeCategoryData(name: string, icon?: string, color?: string) {
  const suggested = suggestCategoryKeys(name)
  return {
    name: name.trim(),
    icon: icon && isValidIconKey(icon) ? icon : suggested.icon,
    color: color && isValidColorKey(color) ? color : suggested.color,
  }
}

/** Ensure standard snack categories exist in the database. */
export async function ensureDefaultCategories() {
  await Promise.all(
    SNACK_CATEGORY_PRESETS.map((preset) =>
      prisma.category.upsert({
        where: { name: preset.name },
        update: {},
        create: { name: preset.name, icon: preset.icon, color: preset.color },
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
    names.map((name) => {
      const { icon, color } = suggestCategoryKeys(name)
      return prisma.category.upsert({
        where: { name },
        update: {},
        create: { name, icon, color },
      })
    })
  )
}

export { normalizeCategoryData, DEFAULT_ICON_KEY, DEFAULT_COLOR_KEY }

/** Jugendschutz: nicotine / tobacco related category names. */
export function isAgeRestrictedCategory(name: string): boolean {
  const c = name.toLowerCase()
  return /rauch|shisha|vape|zigarette|tabak|e-zigarette|nikotin|drehtabak|wasserpfeife/.test(c)
}
