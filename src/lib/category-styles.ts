import {
  UtensilsCrossed,
  Wine,
  Cigarette,
  Pill,
  Snowflake,
  Droplets,
  ShoppingBag,
  Candy,
  Beer,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export interface CategoryStyle {
  icon: LucideIcon
  color: string
}

const PALETTE = [
  'from-emerald-500 to-emerald-600',
  'from-blue-500 to-blue-600',
  'from-red-500 to-red-600',
  'from-purple-500 to-purple-600',
  'from-amber-500 to-amber-600',
  'from-cyan-500 to-cyan-600',
  'from-sky-400 to-sky-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
]

/** Icon + gradient per category name (keyword match, then palette fallback). */
export function getCategoryStyle(name: string, index = 0): CategoryStyle {
  const c = name.toLowerCase()

  if (/lebensmittel|essen|snack|süß|salzig|kaugummi|kinder|schokolade|chips/.test(c)) {
    return { icon: UtensilsCrossed, color: 'from-emerald-500 to-emerald-600' }
  }
  if (/getränk|drink|saft|cola|energy|milch|soft|wein|sekt|spirituosen|kasten/.test(c)) {
    return { icon: Wine, color: 'from-blue-500 to-blue-600' }
  }
  if (/wasser/.test(c)) {
    return { icon: Droplets, color: 'from-cyan-500 to-cyan-600' }
  }
  if (/bier/.test(c)) {
    return { icon: Beer, color: 'from-yellow-500 to-amber-600' }
  }
  if (/shisha|wasserpfeife/.test(c)) {
    return { icon: Cigarette, color: 'from-amber-500 to-amber-600' }
  }
  if (/vape|e-zigarette|nikotin/.test(c)) {
    return { icon: Cigarette, color: 'from-cyan-500 to-cyan-600' }
  }
  if (/rauch|zigarette|tabak|feuerzeug|papers|drehtabak/.test(c)) {
    return { icon: Cigarette, color: 'from-red-500 to-red-600' }
  }
  if (/eis|speiseeis|eiscreme/.test(c)) {
    return { icon: Snowflake, color: 'from-sky-400 to-sky-600' }
  }
  if (/drogerie/.test(c)) {
    return { icon: Pill, color: 'from-purple-500 to-purple-600' }
  }
  if (/süß|candy|gummi|bonbon/.test(c)) {
    return { icon: Candy, color: 'from-pink-500 to-rose-600' }
  }
  if (/energy|red bull|monster/.test(c)) {
    return { icon: Sparkles, color: 'from-violet-500 to-purple-600' }
  }

  return { icon: ShoppingBag, color: PALETTE[index % PALETTE.length] }
}
