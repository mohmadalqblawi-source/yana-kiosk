export function calculateVAT(priceNet: number, vatRate: number): { net: number; vat: number; gross: number } {
  const net = priceNet
  const vat = net * (vatRate / 100)
  const gross = net + vat
  return {
    net: roundTo(net),
    vat: roundTo(vat),
    gross: roundTo(gross),
  }
}

export function roundTo(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export function getVatLabel(vatRate: number): string {
  return vatRate === 7 ? '7% (ermäßigt)' : '19% (normal)'
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
