/**
 * One-time migration: consolidate old categories → new ones in production DB.
 *
 * OLD (to remove):  Schokoladenriegel, Sweets & Snacks, Chips, Fruchtgummi & Lakritz
 * NEW (to add):     Süße Snacks, Salzige Snacks
 *
 * Mapping:
 *   Schokoladenriegel    → Süße Snacks
 *   Sweets & Snacks      → Süße Snacks
 *   Fruchtgummi & Lakritz → Süße Snacks
 *   Chips                → Salzige Snacks
 *
 * Run: node scripts/migrate-categories.js
 */
try { require('dotenv').config(); } catch { /* dotenv optional */ }
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REMAP = {
  'Schokoladenriegel':     'Süße Snacks',
  'Sweets & Snacks':       'Süße Snacks',
  'Fruchtgummi & Lakritz': 'Süße Snacks',
  'Chips':                 'Salzige Snacks',
};

async function main() {
  // 1. Ensure target categories exist
  const targets = [...new Set(Object.values(REMAP))];
  for (const name of targets) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
    console.log(`✓ Category ensured: ${name}`);
  }

  // 2. Re-assign products from old → new categories
  for (const [oldCat, newCat] of Object.entries(REMAP)) {
    const result = await prisma.product.updateMany({
      where:  { category: oldCat },
      data:   { category: newCat },
    });
    console.log(`✓ Moved ${result.count} products: "${oldCat}" → "${newCat}"`);
  }

  // 3. Delete the old (now empty) categories
  for (const oldCat of Object.keys(REMAP)) {
    try {
      await prisma.category.delete({ where: { name: oldCat } });
      console.log(`✓ Deleted category: ${oldCat}`);
    } catch {
      console.log(`  (skip) Category not found in DB: ${oldCat}`);
    }
  }

  console.log('\n✅ Migration complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
