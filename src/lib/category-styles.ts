import {
  UtensilsCrossed,
  Wine,
  Cigarette,
  Pill,
  Snowflake,
  Droplets,
  ShoppingBag,
  Candy,
  Cookie,
  Beer,
  Sparkles,
  Coffee,
  Apple,
  Pizza,
  Tag,
  Zap,
  Flame,
  CakeSlice,
  Popcorn,
  CupSoda,
  Citrus,
  Package,
  FlameKindling,
  BottleWine,
  Martini,
  CloudFog,
  PillBottle,
  type LucideIcon,
} from 'lucide-react'

export interface CategoryStyle {
  icon: LucideIcon
  color: string
}

export const DEFAULT_ICON_KEY = 'shopping-bag'
export const DEFAULT_COLOR_KEY = 'emerald'

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'shopping-bag': ShoppingBag,
  utensils: UtensilsCrossed,
  wine: Wine,
  cigarette: Cigarette,
  pill: Pill,
  snowflake: Snowflake,
  droplets: Droplets,
  candy: Candy,
  cookie: Cookie,
  beer: Beer,
  sparkles: Sparkles,
  coffee: Coffee,
  apple: Apple,
  pizza: Pizza,
  tag: Tag,
  zap: Zap,
  flame: Flame,
  'cake-slice': CakeSlice,
  popcorn: Popcorn,
  'cup-soda': CupSoda,
  citrus: Citrus,
  package: Package,
  'flame-kindling': FlameKindling,
  'bottle-wine': BottleWine,
  martini: Martini,
  'cloud-fog': CloudFog,
  'pill-bottle': PillBottle,
}

export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICONS) as (keyof typeof CATEGORY_ICONS)[]

export const CATEGORY_COLORS: Record<string, string> = {
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-blue-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  amber: 'from-amber-500 to-amber-600',
  cyan: 'from-cyan-500 to-cyan-600',
  sky: 'from-sky-400 to-sky-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
  indigo: 'from-indigo-500 to-indigo-600',
  violet: 'from-violet-500 to-purple-600',
  yellow: 'from-yellow-500 to-amber-600',
  rose: 'from-rose-500 to-pink-600',
  teal: 'from-teal-500 to-teal-600',
  gray: 'from-gray-500 to-gray-600',
}

export const CATEGORY_COLOR_OPTIONS = Object.keys(CATEGORY_COLORS)

export const CATEGORY_ICON_LABELS: Record<string, string> = {
  'shopping-bag': 'Tasche',
  utensils: 'Essen',
  wine: 'Wein',
  cigarette: 'Zigaretten',
  pill: 'Medizin',
  snowflake: 'Eistee',
  droplets: 'Wasser',
  candy: 'Süßes',
  cookie: 'Snacks',
  beer: 'Bier',
  sparkles: 'Special',
  coffee: 'Kaffee',
  apple: 'Obst',
  pizza: 'Pizza',
  tag: 'Sonstiges',
  zap: 'Energy',
  flame: 'Feuer',
  'cake-slice': 'Schokolade',
  popcorn: 'Chips',
  'cup-soda': 'Softdrinks',
  citrus: 'Saft',
  package: 'Rauchbedarf',
  'flame-kindling': 'Shishakohle',
  'bottle-wine': 'Sekt',
  martini: 'Spirituosen',
  'cloud-fog': 'Vapes',
  'pill-bottle': 'Drogerie',
}

export const CATEGORY_COLOR_LABELS: Record<string, string> = {
  emerald: 'Grün',
  blue: 'Blau',
  red: 'Rot',
  purple: 'Lila',
  amber: 'Bernstein',
  cyan: 'Türkis',
  sky: 'Himmelblau',
  orange: 'Orange',
  pink: 'Rosa',
  indigo: 'Indigo',
  violet: 'Violett',
  yellow: 'Gelb',
  rose: 'Rose',
  teal: 'Petrol',
  gray: 'Grau',
}

export function getCategoryIconLabel(key: string): string {
  return CATEGORY_ICON_LABELS[key] ?? key
}

export function getCategoryColorLabel(key: string): string {
  return CATEGORY_COLOR_LABELS[key] ?? key
}

/** Kiosk category presets — unique verified lucide icons per category. */
export const ADMIN_CATEGORY_PRESETS = [
  { name: 'Schokolade', icon: 'cake-slice', color: 'rose' },
  { name: 'Chips', icon: 'popcorn', color: 'orange' },
  { name: 'Softdrinks', icon: 'cup-soda', color: 'cyan' },
  { name: 'Energy Drinks', icon: 'zap', color: 'yellow' },
  { name: 'Wein', icon: 'wine', color: 'purple' },
  { name: 'Saft', icon: 'citrus', color: 'orange' },
  { name: 'Eistea', icon: 'snowflake', color: 'sky' },
  { name: 'Zigaretten', icon: 'cigarette', color: 'red' },
  { name: 'Rauchbedarf', icon: 'package', color: 'gray' },
  { name: 'Shishakohle', icon: 'flame-kindling', color: 'amber' },
  { name: 'Sekt', icon: 'bottle-wine', color: 'yellow' },
  { name: 'Spirituosen', icon: 'martini', color: 'indigo' },
  { name: 'Vapes', icon: 'cloud-fog', color: 'teal' },
  { name: 'Drogerie', icon: 'pill-bottle', color: 'purple' },
  { name: 'Süße Snacks', icon: 'candy', color: 'emerald' },
  { name: 'Salzige Snacks', icon: 'cookie', color: 'amber' },
] as const

export type AdminCategoryPreset = (typeof ADMIN_CATEGORY_PRESETS)[number]

/** @deprecated Use ADMIN_CATEGORY_PRESETS */
export const SNACK_CATEGORY_PRESETS = ADMIN_CATEGORY_PRESETS.filter(
  (p) => p.name === 'Süße Snacks' || p.name === 'Salzige Snacks'
)

export function isValidIconKey(key: string): boolean {
  return key in CATEGORY_ICONS
}

export function isValidColorKey(key: string): boolean {
  return key in CATEGORY_COLORS
}

function normalizeCategoryName(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

/** Suggest icon + color keys from category name (for new categories). */
export function suggestCategoryKeys(name: string): { icon: string; color: string } {
  const c = normalizeCategoryName(name)

  const preset = ADMIN_CATEGORY_PRESETS.find((p) => normalizeCategoryName(p.name) === c)
  if (preset) return { icon: preset.icon, color: preset.color }

  if (/salzige\s*snack/.test(c) || (c.includes('salzig') && c.includes('snack'))) {
    return { icon: 'cookie', color: 'amber' }
  }
  if (/susse\s*snack|süße\s*snack/.test(c) || (c.includes('susse') && c.includes('snack'))) {
    return { icon: 'candy', color: 'emerald' }
  }
  if (/schokolade|praline|nougat/.test(c)) {
    return { icon: 'cake-slice', color: 'rose' }
  }
  if (/chip|crisp/.test(c)) {
    return { icon: 'popcorn', color: 'orange' }
  }
  if (/energy|energydrink/.test(c)) {
    return { icon: 'zap', color: 'yellow' }
  }
  if (/softdrink|soft\s*drink|cola|limo|fanta|sprite/.test(c)) {
    return { icon: 'cup-soda', color: 'cyan' }
  }
  if (/eistee|eistea|ice\s*tea/.test(c)) {
    return { icon: 'snowflake', color: 'sky' }
  }
  if (/spirituosen|schnaps|vodka|whisky|rum/.test(c)) {
    return { icon: 'martini', color: 'indigo' }
  }
  if (/sekt|prosecco|champagner/.test(c)) {
    return { icon: 'bottle-wine', color: 'yellow' }
  }
  if (/wein/.test(c)) {
    return { icon: 'wine', color: 'purple' }
  }
  if (/saft|nektar/.test(c)) {
    return { icon: 'citrus', color: 'orange' }
  }
  if (/shishakohle|kohle/.test(c)) {
    return { icon: 'flame-kindling', color: 'amber' }
  }
  if (/rauchbedarf|tabak|drehtabak|papers|feuerzeug/.test(c)) {
    return { icon: 'package', color: 'gray' }
  }
  if (/vape|e-zigarette|nikotin/.test(c)) {
    return { icon: 'cloud-fog', color: 'teal' }
  }
  if (/zigarette/.test(c)) {
    return { icon: 'cigarette', color: 'red' }
  }
  if (/drogerie/.test(c)) {
    return { icon: 'pill-bottle', color: 'purple' }
  }
  if (/snack|bonbon|gummi/.test(c)) {
    return { icon: 'candy', color: 'emerald' }
  }
  if (/getränk|getranke|drink|milch|kasten/.test(c)) {
    return { icon: 'cup-soda', color: 'blue' }
  }
  if (/wasser/.test(c)) {
    return { icon: 'droplets', color: 'cyan' }
  }
  if (/bier/.test(c)) {
    return { icon: 'beer', color: 'yellow' }
  }
  if (/kaffee|coffee/.test(c)) {
    return { icon: 'coffee', color: 'amber' }
  }
  if (/shisha|wasserpfeife/.test(c)) {
    return { icon: 'flame-kindling', color: 'amber' }
  }
  if (/rauch/.test(c)) {
    return { icon: 'cigarette', color: 'red' }
  }
  if (/eis|speiseeis|eiscreme/.test(c)) {
    return { icon: 'snowflake', color: 'sky' }
  }
  if (/lebensmittel|essen|kaugummi|kinder|pizza/.test(c)) {
    return { icon: 'utensils', color: 'emerald' }
  }
  if (/obst|apfel/.test(c)) {
    return { icon: 'apple', color: 'emerald' }
  }

  return { icon: DEFAULT_ICON_KEY, color: DEFAULT_COLOR_KEY }
}

/** Build name → category metadata map for product cards. */
export function buildCategoryLookup(
  categories: { name: string; icon?: string | null; color?: string | null }[]
): Record<string, { name: string; icon?: string | null; color?: string | null }> {
  return Object.fromEntries(categories.map((c) => [c.name, c]))
}

export function resolveProductCategoryStyle(
  categoryName: string,
  lookup?: Record<string, { icon?: string | null; color?: string | null }>
): CategoryStyle {
  const meta = lookup?.[categoryName]
  return resolveCategoryStyle({
    name: categoryName,
    icon: meta?.icon,
    color: meta?.color,
  })
}

/** Resolve icon component + gradient from stored keys (with name-based fallback). */
export function resolveCategoryStyle(
  cat: { name: string; icon?: string | null; color?: string | null },
  _index = 0
): CategoryStyle {
  const suggested = suggestCategoryKeys(cat.name)
  const hasCustomIcon = Boolean(cat.icon && isValidIconKey(cat.icon) && cat.icon !== DEFAULT_ICON_KEY)
  const hasCustomColor = Boolean(cat.color && isValidColorKey(cat.color) && cat.color !== DEFAULT_COLOR_KEY)
  const iconKey = hasCustomIcon ? cat.icon! : suggested.icon
  const colorKey = hasCustomColor ? cat.color! : suggested.color

  const icon = CATEGORY_ICONS[iconKey]
  if (!icon) {
    console.warn(`[category-styles] Unknown icon key "${iconKey}" for "${cat.name}", using shopping-bag`)
  }

  return {
    icon: icon ?? ShoppingBag,
    color: CATEGORY_COLORS[colorKey] ?? CATEGORY_COLORS.emerald,
  }
}

/** @deprecated Use resolveCategoryStyle with full category object */
export function getCategoryStyle(name: string, index = 0): CategoryStyle {
  return resolveCategoryStyle({ name }, index)
}
