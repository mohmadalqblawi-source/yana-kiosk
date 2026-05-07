const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

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

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error seeding:', e)
    prisma.$disconnect()
    process.exit(1)
  })
