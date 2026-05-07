import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12)
  
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@yanakiosk.de' },
    update: { password: hashedPassword },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@yanakiosk.de',
      password: hashedPassword,
      name: 'Admin',
    },
  })
  console.log('Admin created')

  // Create categories
  const categories = ['Food', 'Drinks', 'Snacks', 'Household', 'Personal Care', 'Bakery']
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('Categories created')

  // Check if products already exist
  const existingCount = await prisma.product.count()
  if (existingCount > 0) {
    console.log(`Products already exist (${existingCount}), skipping product seeding`)
    return
  }

  // Create products
  const products = [
    {
      name: 'Vollkornbrot',
      description: 'Traditionelles deutsches Vollkornbrot, frisch gebacken. 500g.',
      priceNet: 2.80,
      vatRate: 7,
      category: 'Bakery',
      image: 'https://images.unsplash.com/photo-1598373182133-52452f1c3e4a?w=400&h=400&fit=crop',
      stock: 50,
      featured: true,
    },
    {
      name: 'Milch 3.5%',
      description: 'Frische Vollmilch von regionalen Bauern. 1 Liter.',
      priceNet: 1.20,
      vatRate: 7,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
      stock: 100,
      featured: true,
    },
    {
      name: 'Cola Classic',
      description: 'Erfrischende Cola, gekühlt. 0.33l Dose.',
      priceNet: 1.50,
      vatRate: 19,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
      stock: 200,
      featured: true,
    },
    {
      name: 'Kartoffelchips Paprika',
      description: 'Knusprige Kartoffelchips mit Paprika-Geschmack. 150g.',
      priceNet: 1.80,
      vatRate: 7,
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop',
      stock: 80,
      featured: true,
    },
    {
      name: 'Mineralwasser Medium',
      description: 'Natürliches Mineralwasser mit wenig Kohlensäure. 0.75l.',
      priceNet: 0.80,
      vatRate: 7,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1565709465515-144f0d10a53d?w=400&h=400&fit=crop',
      stock: 150,
      featured: true,
    },
    {
      name: 'Orangensaft',
      description: 'Frisch gepresster Orangensaft, 100% Frucht. 1 Liter.',
      priceNet: 2.50,
      vatRate: 7,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
      stock: 60,
      featured: false,
    },
    {
      name: 'Bier Pils',
      description: 'Klassisches Pilsener Bier, traditionell gebraut. 0.5l Flasche.',
      priceNet: 1.20,
      vatRate: 19,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop',
      stock: 250,
      featured: false,
    },
    {
      name: 'Butter Croissant',
      description: 'Französisches Buttercroissant, zart und buttrig.',
      priceNet: 1.50,
      vatRate: 7,
      category: 'Bakery',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
      stock: 40,
      featured: true,
    },
    {
      name: 'Nudeln Spaghetti',
      description: 'Italienische Hartweizengrieß-Nudeln. 500g.',
      priceNet: 1.10,
      vatRate: 7,
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop',
      stock: 120,
      featured: false,
    },
    {
      name: 'Dosenpfirsiche',
      description: 'Süße Pfirsichhälften in leichter Sirup. 4er-Pack.',
      priceNet: 1.90,
      vatRate: 7,
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1553272725-086100aecf5e?w=400&h=400&fit=crop',
      stock: 75,
      featured: false,
    },
    {
      name: 'Geschirrspülmittel',
      description: 'Konzentriertes Spülmittel, frischer Duft. 500ml.',
      priceNet: 2.30,
      vatRate: 19,
      category: 'Household',
      image: 'https://images.unsplash.com/photo-1623260484651-232355e8370a?w=400&h=400&fit=crop',
      stock: 45,
      featured: false,
    },
    {
      name: 'Zahnpasta',
      description: 'Zahnpasta mit Fluorid, Kräuterfrisch. 75ml.',
      priceNet: 1.60,
      vatRate: 19,
      category: 'Personal Care',
      image: 'https://images.unsplash.com/photo-1558191053-9c54c4d0a6e1?w=400&h=400&fit=crop',
      stock: 90,
      featured: false,
    },
    {
      name: 'Schokolade Vollmilch',
      description: 'Feinste Vollmilchschokolade mit Haselnüssen. 100g.',
      priceNet: 1.40,
      vatRate: 7,
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop',
      stock: 100,
      featured: true,
    },
    {
      name: 'Energy Drink',
      description: 'Anregender Energy Drink, zuckerfrei. 0.5l Dose.',
      priceNet: 2.00,
      vatRate: 19,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop',
      stock: 180,
      featured: false,
    },
    {
      name: 'Reis Langkorn',
      description: 'Feiner Langkornreis aus Thailand. 1kg.',
      priceNet: 2.20,
      vatRate: 7,
      category: 'Food',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      stock: 85,
      featured: false,
    },
    {
      name: 'Toilettenpapier',
      description: 'Weiches Toilettenpapier, 3-lagig. 8 Rollen.',
      priceNet: 3.50,
      vatRate: 19,
      category: 'Household',
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop',
      stock: 60,
      featured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log(`${products.length} products created`)

  // Create store settings
  await prisma.storeSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'YaNa Kiosk',
      address: 'Berliner Str. 42, 10115 Berlin',
      phone: '+49 30 123456789',
      email: 'info@yanakiosk.de',
    },
  })
  console.log('Store settings created')

  console.log('\n✅ Database seeded successfully!')
  console.log('Admin login:')
  console.log('  Email: admin@yanakiosk.de')
  console.log('  Password: Admin123!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
