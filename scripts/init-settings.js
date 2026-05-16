const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.storeSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'YaNa Kiosk',
      address: 'Barsbütteler Hof 2c, 22885 Barsbüttel',
      phone: '040 6704066',
      email: 'yana-kiosk@web.de',
      isOpen: true,
    },
  })
  console.log('StoreSetting:', JSON.stringify(result, null, 2))
}

main()
  .catch(e => { console.error('ERROR:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
