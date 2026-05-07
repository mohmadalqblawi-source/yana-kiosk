const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log('Total products in DB:', count);
  
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });
  console.log('Categories:', categories.map(c => c.category).join(', '));
  
  const first5 = await prisma.product.findMany({ take: 5 });
  console.log('First 5 products:', first5.map(p => p.name).join(', '));
  
  await prisma.$disconnect();
}

main().catch(console.error);
