const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const sampleProducts = [
  // --- ESSEN / FOOD ---
  { name: 'Snickers Riegel', description: 'Erdnuss-Nougat-Karamell Schokoriegel 50g', priceNet: 0.99, vatRate: 7, category: 'Schokoladenriegel', image: 'https://images.unsplash.com/photo-1622306724547-0c249c1bb08a?w=400&h=400&fit=crop', stock: 50, featured: true },
  { name: 'Mars Riegel', description: 'Milchschokolade mit Nougatfüllung 51g', priceNet: 0.99, vatRate: 7, category: 'Schokoladenriegel', image: 'https://images.unsplash.com/photo-1622306724547-0c249c1bb08a?w=400&h=400&fit=crop', stock: 45, featured: true },
  { name: 'KitKat', description: 'Knusprige Waffel in Milchschokolade 41,5g', priceNet: 0.89, vatRate: 7, category: 'Schokoladenriegel', image: 'https://images.unsplash.com/photo-1622306724547-0c249c1bb08a?w=400&h=400&fit=crop', stock: 60, featured: false },
  { name: 'Haribo Goldbären', description: 'Fruchtgummi Original 200g Beutel', priceNet: 1.89, vatRate: 7, category: 'Sweets & Snacks', image: 'https://images.unsplash.com/photo-1581798459219-318e76ae3c6b?w=400&h=400&fit=crop', stock: 30, featured: true },
  { name: 'Pringles Original', description: 'Kartoffelchips in der Dose 165g', priceNet: 2.49, vatRate: 7, category: 'Chips', image: 'https://images.unsplash.com/photo-1621447504864-d8686a778c89?w=400&h=400&fit=crop', stock: 25, featured: false },
  { name: 'Lorenz Erdnüsse', description: 'Geröstete und gesalzene Erdnüsse 150g', priceNet: 1.69, vatRate: 7, category: 'Sweets & Snacks', image: 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=400&h=400&fit=crop', stock: 35, featured: false },
  { name: 'Kinder Riegel', description: 'Milchcreme Riegel mit Vollmilchschokolade 2er Pack', priceNet: 1.29, vatRate: 7, category: 'Schokoladenriegel', image: 'https://images.unsplash.com/photo-1622306724547-0c249c1bb08a?w=400&h=400&fit=crop', stock: 40, featured: true },
  { name: 'Wrigley‘s Kaugummi', description: 'Extra Professional Kaugummi 30 Stück', priceNet: 1.99, vatRate: 19, category: 'Kaugummi', image: 'https://images.unsplash.com/photo-1581798459219-318e76ae3c6b?w=400&h=400&fit=crop', stock: 20, featured: false },

  // --- TRINKEN / DRINKS ---
  { name: 'Coca-Cola 0,5L', description: 'Erfrischungsgetränk Classic 500ml PET-Flasche', priceNet: 1.49, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 100, featured: true },
  { name: 'Fanta Orange 0,5L', description: 'Orangenlimonade 500ml PET-Flasche', priceNet: 1.49, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 80, featured: false },
  { name: 'Sprite 0,5L', description: 'Zitronenlimonade 500ml PET-Flasche', priceNet: 1.49, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 75, featured: false },
  { name: 'Monster Energy Original', description: 'Energy Drink 500ml Dose', priceNet: 1.99, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1622482060317-60a4ab85b005?w=400&h=400&fit=crop', stock: 40, featured: true },
  { name: 'Red Bull 250ml', description: 'Energy Drink 250ml Dose', priceNet: 2.29, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1622482060317-60a4ab85b005?w=400&h=400&fit=crop', stock: 50, featured: true },
  { name: 'Becks Bier 0,5L', description: 'Pils 500ml Dose 4,9% Vol.', priceNet: 1.29, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608270586620-5a7e0e1a3991?w=400&h=400&fit=crop', stock: 60, featured: false },
  { name: 'Wasser Still 0,5L', description: 'Natürliches Mineralwasser 500ml PET', priceNet: 0.69, vatRate: 7, category: 'Wasser', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 120, featured: false },
  { name: 'Wasser Classic 0,75L', description: 'Sprudelwasser 750ml Glasflasche', priceNet: 1.19, vatRate: 7, category: 'Wasser', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 90, featured: false },
]

async function main() {
  // Create admin
  const existing = await prisma.admin.findUnique({ where: { email: 'admin@yanakiosk.de' } })
  if (existing) {
    console.log('Admin already exists:', existing.email)
  } else {
    const hash = await bcrypt.hash('Admin123!', 10)
    const admin = await prisma.admin.create({
      data: { email: 'admin@yanakiosk.de', password: hash, name: 'Admin' },
    })
    console.log('✅ Admin created:', admin.email)
  }

  // Create store settings
  const existingSettings = await prisma.storeSetting.findUnique({ where: { id: 'default' } })
  if (!existingSettings) {
    await prisma.storeSetting.create({
      data: {
        id: 'default',
        name: 'YaNa Kiosk',
        address: 'Barsbütteler Hof 2c, 22885 Barsbüttel',
        phone: '01604873902',
        email: 'yana-kiosk@web.de',
      },
    })
    console.log('✅ Store settings created')
  } else {
    console.log('Store settings already exist')
  }

  // Create sample products
  const existingCount = await prisma.product.count()
  if (existingCount === 0) {
    for (const p of sampleProducts) {
      await prisma.product.create({ data: p })
    }
    console.log(`✅ ${sampleProducts.length} sample products created`)
  } else {
    console.log(`ℹ️  ${existingCount} products already exist, skipping seed`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error seeding:', e)
    prisma.$disconnect()
    process.exit(1)
  })
