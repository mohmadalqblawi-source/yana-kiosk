const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('=== YaNa Kiosk Barsbttel - Database Seeding ===\n');

  // Admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12);
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@yanakiosk.de' },
    update: { password: hashedPassword },
    create: { email: process.env.ADMIN_EMAIL || 'admin@yanakiosk.de', password: hashedPassword, name: 'Admin' },
  });
  console.log('? Admin created');

  // Categories
  const catNames = [
    'Se Snacks','Salzige Snacks',
    'Softdrinks','Energy Drinks','Eistee','Spirituosen','Spirituosen-Mix',
    'Bier','Sekt','Wein','Saft','Milch','Wasser',
    'Kaugummi','Kinderartikel','Getrnkekisten','Lebensmittel','Rauchbedarf','Drogerie'
  ];
  for (const name of catNames) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('? ' + catNames.length + ' categories created');

  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log('? Products already exist (' + existingCount + '), skipping...');
    await prisma.storeSetting.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        name: process.env.NEXT_PUBLIC_STORE_NAME || 'YaNa Kiosk',
        address: process.env.NEXT_PUBLIC_STORE_ADDRESS || '',
        phone: process.env.NEXT_PUBLIC_STORE_PHONE || '',
        email: process.env.NEXT_PUBLIC_STORE_EMAIL || '',
        isOpen: true,
      },
    });
    return;
  }

  const products = [
    // Se Snacks  Schokoriegel (7% VAT)
    { name: 'Snickers 50g', description: 'Schokoladenriegel mit Erdnuss und Karamell.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 100, featured: true },
    { name: 'Twix 50g', description: 'Knuspriger Keksriegel mit Karamell.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 100, featured: true },
    { name: 'Milky Way 43g', description: 'Luftiger Milchschokoladenriegel.', priceNet: 2.76, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Ferrero Kinder Bueno 43g', description: 'Zarter Haselnussriegel.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 90, featured: true },
    { name: 'Ferrero Kinder Bueno White 43g', description: 'Wei?er Haselnussriegel.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 75, featured: false },
    { name: 'Mars 51g', description: 'Schokoladenriegel mit Karamell-Nougat.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 100, featured: true },
    { name: 'Bounty 57g', description: 'Kokosriegel mit Milchschokolade.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Daim 28g', description: 'Mandel-Krokant-Riegel.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1627308595220-5a1f14c2b8c6?w=400&h=400&fit=crop', stock: 85, featured: false },
    // Sweets & Snacks (7% VAT - food)
    { name: 'Nutella Biscuits 304g', description: 'Knusprige Kekse mit Nutella Creme.', priceNet: 6.50, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 40, featured: false },
    { name: 'Pipapo Naturell 100g', description: 'Sonnenblumenkerne naturbelassen.', priceNet: 3.74, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Pipapo Salz 100g', description: 'Sonnenblumenkerne gesalzen.', priceNet: 3.74, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Pipapo Sweet Popcorn 100g', description: 'Sonnenblumenkerne mit Popcorn Geschmack.', priceNet: 3.74, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 40, featured: false },
    { name: 'Ricola Kr?uter Original 75g', description: 'Kr?uterbonbons aus Schweizer Alpenkr?utern.', priceNet: 3.74, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Nic Nac\'s 110g', description: 'Erdn?sse im knusprigen Teigmantel.', priceNet: 4.63, vatRate: 19, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 45, featured: false },
    { name: 'Nutella Biscuits 41,4g', description: 'Mini Kekse mit Nutella, praktisch f?r unterwegs.', priceNet: 2.76, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'Ritter Sport Voll-Nuss', description: 'Vollmilchschokolade mit ganzen Haseln?ssen.', priceNet: 3.27, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop', stock: 60, featured: true },
    { name: 'Schoko Toffees 325g', description: 'Sahrige Schoko-Toffees.', priceNet: 5.14, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 30, featured: false },
    { name: 'Smarties Hexagon 38g', description: 'Bunte Zuckerperlen mit Schokolade.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Tic Tac Fresh Mint 18g', description: 'Erfrischende Minz-Dragees.', priceNet: 2.06, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 90, featured: false },
    { name: 'Toffifee 125g', description: 'Karamell mit Nougat-Creme und Haselnuss.', priceNet: 4.21, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Wick Zitrone 46g', description: 'Bonbons mit Zitronengeschmack und Vitaminen.', priceNet: 3.27, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Raffaello 150g', description: 'Kokos-Mandel-Kugeln.', priceNet: 7.01, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 35, featured: true },
    { name: 'Ritter Sport Edel Vollmilch', description: 'Klassische Vollmilchschokolade.', priceNet: 3.27, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop', stock: 65, featured: false },
    { name: 'Ritter Sport Ganze Mandel', description: 'Vollmilchschokolade mit Mandeln.', priceNet: 3.27, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop', stock: 55, featured: false },
    { name: 'Ritter Sport Joghurt', description: 'Joghurtschokolade.', priceNet: 3.27, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop', stock: 55, featured: false },
    { name: 'Leibniz Original 200g', description: 'Klassische Butterkekse.', priceNet: 3.55, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'M&M\'s Peanut 150g', description: 'Erdn?sse in buntem Schokoladenmantel.', priceNet: 4.21, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 60, featured: true },
    { name: 'Mentos Erdbeer-Mix 37,5g', description: 'Fruchtige Kaubonbons Erdbeer-Mix.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 90, featured: false },
    { name: 'Mentos Mint 38g', description: 'Erfrischende Mint Kaubonbons.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 90, featured: false },
    // More Sweets & Snacks
    { name: 'Bifi 22,5g', description: 'Snack-Wurststick.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Butter Toffee', description: 'Sahnige Butter-Toffees.', priceNet: 3.69, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 45, featured: false },
    { name: 'Celebrations 186g', description: 'Verschiedene Schokoladen-Sorten im Mix.', priceNet: 9.30, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop', stock: 25, featured: false },
    { name: 'Dextro Energy Classic 46g', description: 'Traubenzucker f?r schnelle Energie.', priceNet: 2.34, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 100, featured: false },
    { name: 'Fischerman\'s Friend Lemon', description: 'Extra starke Minzbonbons Zitrone.', priceNet: 2.62, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'Fischerman\'s Friend Mint', description: 'Extra starke Minzbonbons Minze.', priceNet: 2.62, vatRate: 7, category: 'Se Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'Kinder ?berraschung', description: '?berraschungsei mit Spielzeug.', priceNet: 2.34, vatRate: 7, category: 'Kinderartikel', image: 'https://images.unsplash.com/photo-1615238359019-12e3b6d3b4e5?w=400&h=400&fit=crop', stock: 60, featured: true },

    // Salzige Snacks  Chips (7% VAT)
    { name: 'Pom-B?r Original 100g', description: 'Kartoffelsnacks in B?renform.', priceNet: 4.21, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Pringles Cheese & Onion 165g', description: 'Kartoffelchips mit K?se-Zwiebel-Geschmack.', priceNet: 4.49, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 80, featured: true },
    { name: 'Pringles Classic Paprika 165g', description: 'Kartoffelchips mit Paprika-Geschmack.', priceNet: 4.49, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 80, featured: true },
    { name: 'Lay\'s aus dem Ofen Cheese & Onion 100g', description: 'Ofen-gebackene Chips.', priceNet: 4.21, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 55, featured: false },
    { name: 'Lay\'s gesalzen 150g', description: 'Klassisch gesalzene Kartoffelchips.', priceNet: 4.67, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'Pringles Sweet Paprika 165g', description: 'S??liche Paprika Chips.', priceNet: 4.49, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 65, featured: false },
    { name: 'Takis Blue Heat 92,3g', description: 'Extrem w?rzige Tortilla-Chips.', priceNet: 6.50, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 40, featured: false },
    { name: 'Pringles Original 165g', description: 'Original Kartoffelchips.', priceNet: 4.49, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Funny-Frisch Oriental 150g', description: 'W?rzige Chips mit orientalischem Geschmack.', priceNet: 4.21, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Funny-Frisch Ungarisch 150g', description: 'Chips mit ungarischem W?rzgeschmack.', priceNet: 4.21, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Funny-Frisch Gesalzen 150g', description: 'Klassisch gesalzene Chips.', priceNet: 4.21, vatRate: 7, category: 'Salzige Snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop', stock: 60, featured: false },
    // Se Snacks  Fruchtgummi (7% VAT)
    { name: 'Haribo Goldb?ren 175g', description: 'Klassische Goldb?ren Fruchtgummi.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 100, featured: true },
    { name: 'Haribo Happy Cola 175g', description: 'Cola-Flaschen Fruchtgummi.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Haribo Phantasia 175g', description: 'Bunte Fruchtgummi-Mischung.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 75, featured: false },
    { name: 'Haribo Pfirsiche 175g', description: 'Pfirsich-Fruchtgummi mit Zucker.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'Haribo Lakritz Schnecken', description: 'Lakritz-Schnecken.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Haribo Rainbow Sauer 175g', description: 'Saure Regenbogen-Fruchtgummi.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'Nimm2 Lachgummi Softies Frucht Mix 225g', description: 'Weiche Fruchtgummis mit Vitaminen.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Bubble Fizz 1kg', description: 'Brause-Fruchtgummi im Gro?pack.', priceNet: 23.32, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 15, featured: false },
    { name: 'Haribo Balla-Balla 175g', description: 'Schaumzucker-Fruchtgummi.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 65, featured: false },
    { name: 'Haribo Bunte T?te 175g', description: 'Bunte Fruchtgummi-Mischung.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 80, featured: true },
    { name: 'Haribo Konfekt 175g', description: 'Feine Fruchtgummi-Konfekt Mischung.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 55, featured: false },
    { name: 'Bunte T?te', description: 'Selbstgemachte S??igkeitent?te.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 100, featured: false },
    { name: 'Haribo Tropi Frutti 175g', description: 'Exotische Fruchtgummi-Mischung.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Haribo Wein Gums 175g', description: 'Weinbrandbohnen-Art Fruchtgummi.', priceNet: 3.27, vatRate: 7, category: 'Süße Snacks', image: 'https://images.unsplash.com/photo-1621868064663-e0dc2a1fc3f0?w=400&h=400&fit=crop', stock: 55, featured: false },
    // Softdrinks (19% VAT - drinks)
    { name: 'Sprite 0,33l', description: 'Erfrischende Limette-Zitrone Limonade.', priceNet: 2.10, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 150, featured: true },
    { name: 'Coca-Cola 0,5l', description: 'Einzigartiger Cola-Geschmack, 0,5l PET Flasche.', priceNet: 2.44, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 200, featured: true },
    { name: 'Coca-Cola Zero Sugar 0,5l', description: 'Cola-Geschmack ohne Zucker.', priceNet: 2.44, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 180, featured: false },
    { name: 'Fanta Orange 0,5l', description: 'Spritzig erfrischende Orangenlimonade.', priceNet: 2.44, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 160, featured: true },
    { name: 'Mezzo Mix 1l', description: 'Cola-Orange Mix, 1 Liter.', priceNet: 2.94, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Coca-Cola 1l', description: 'Coca-Cola 1,0l PET Mehrwegflasche.', priceNet: 2.94, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 100, featured: true },
    { name: 'Fanta Orange 1l', description: 'Orangenlimonade 1 Liter.', priceNet: 2.94, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 90, featured: false },
    { name: 'Sprite 1,0l', description: 'Zitronenlimonade 1 Liter.', priceNet: 2.94, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 85, featured: false },
    { name: 'Coca-Cola 0,33l Dose', description: 'Coca-Cola Dose, 0,33l.', priceNet: 2.10, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 250, featured: true },
    { name: 'Club-Mate 0,5l', description: 'Koffeinhaltiges Mate-Getr?nk.', priceNet: 2.35, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'Uludag Gazoz 0,33l', description: 'T?rkische Gazoz Limonade.', priceNet: 2.10, vatRate: 19, category: 'Softdrinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 60, featured: false },

    // Energy Drinks (19% VAT)
    { name: 'Red Bull Energy Drink 0,25l', description: 'Original Red Bull Energy Drink.', priceNet: 2.94, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop', stock: 200, featured: true },
    { name: 'Red Bull Sugarfree 0,25l', description: 'Red Bull ohne Zucker.', priceNet: 2.94, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop', stock: 150, featured: false },
    { name: 'Monster Energy 0,5l', description: 'Original Monster Energy Drink.', priceNet: 2.94, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop', stock: 180, featured: true },
    { name: 'Monster Energy Ultra Paradise 0,5l', description: 'Monster Energy Ultra mit Paradise Flavour.', priceNet: 2.94, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop', stock: 100, featured: false },
    { name: 'Powerade Mountain Blast 0,5l', description: 'Sportgetr?nk Mountain Blast.', priceNet: 2.35, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Bomba Blue Energy 0,25l', description: 'Bomba Blue Energy Drink.', priceNet: 3.36, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Action Energy 0,25l', description: 'Action Energy Drink.', priceNet: 2.10, vatRate: 19, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1614071227651-37b82d0b7502?w=400&h=400&fit=crop', stock: 90, featured: false },
    // Eistee (19% VAT)
    { name: 'Fuze Tea Schwarzer Tee Pfirsich 1,25l', description: 'Schwarzer Tee mit Pfirsich-Geschmack.', priceNet: 3.19, vatRate: 19, category: 'Eistee', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Pfanner Ice Tea Pfirsich 2,0l', description: 'Erfrischender Pfirsich-Eistee, 2 Liter.', priceNet: 3.32, vatRate: 19, category: 'Eistee', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Durstl?scher Eistee Pfirsich 0,5l', description: 'Erfrischender Pfirsich-Eistee.', priceNet: 1.85, vatRate: 19, category: 'Eistee', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', stock: 80, featured: false },

    // Spirituosen (19% VAT)
    { name: 'Kleiner Feigling 0,02l', description: 'Feigling Lik?r, 20% Alkohol.', priceNet: 1.68, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 200, featured: false },
    { name: 'Kleiner Feigling 0,5l', description: 'Feigling Lik?r, 0,5 Liter.', priceNet: 12.56, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 30, featured: false },
    { name: 'J?germeister 0,7l', description: 'Klassischer Kr?uterlik?r, 35% Alkohol.', priceNet: 25.17, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 25, featured: true },
    { name: 'J?germeister 0,04l', description: 'Klassischer Kr?uterlik?r, Miniatur.', priceNet: 2.48, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 150, featured: false },
    { name: 'Jack Daniel\'s Tennessee Whiskey 0,7l', description: 'Original Tennessee Whiskey, 40% Alkohol.', priceNet: 29.37, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 20, featured: true },
    { name: 'Bacardi Carta Blanca 0,7l', description: 'Weisser Rum, 38% Alkohol.', priceNet: 20.97, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 25, featured: false },
    { name: 'Smirnoff Red Label 0,7l', description: 'Klassischer Wodka, 38% Alkohol.', priceNet: 20.97, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 30, featured: false },
    { name: 'Absolut Vodka 0,7l', description: 'Premium Wodka aus Schweden, 40% Alkohol.', priceNet: 29.37, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 20, featured: true },
    { name: 'Jim Beam Bourbon 0,7l', description: 'Original Jim Beam Bourbon Whiskey.', priceNet: 25.17, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 22, featured: false },
    { name: 'Bombay Sapphire Gin 0,7l', description: 'Premium Dry Gin, 40% Alkohol.', priceNet: 29.37, vatRate: 19, category: 'Spirituosen', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 18, featured: false },

    // Bier (19% VAT)
    { name: 'Krombacher Pils 0,5l', description: 'Klassisches Krombacher Pils.', priceNet: 2.35, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 200, featured: true },
    { name: 'Heineken 0,33l', description: 'Heineken Bier, 0,33l.', priceNet: 2.94, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 150, featured: true },
    { name: 'Desperados 0,5l', description: 'Tequila Flavour Bier.', priceNet: 4.03, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 100, featured: false },
    { name: 'Corona Extra 0,335l', description: 'Mexikanisches Bier.', priceNet: 3.11, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Astra Urtyp 0,5l', description: 'Hamburger Astra Urtyp Bier.', priceNet: 2.52, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 120, featured: false },
    { name: 'Beck\'s Pils 0,5l', description: 'Klassisches Beck\'s Pils.', priceNet: 2.35, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 160, featured: false },
    { name: 'Warsteiner Pilsener 0,5l', description: 'Warsteiner Premium Pils.', priceNet: 2.35, vatRate: 19, category: 'Bier', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 150, featured: false },
    // Sekt (19% VAT)
    { name: 'Rotk?ppchen Trocken 0,75l', description: 'Klassischer Sekt trocken.', priceNet: 10.04, vatRate: 19, category: 'Sekt', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 30, featured: false },
    { name: 'Rotk?ppchen Halbtrocken 0,75l', description: 'Sekt halbtrocken.', priceNet: 10.04, vatRate: 19, category: 'Sekt', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 30, featured: false },
    { name: 'MM Extra Trocken 0,75l', description: 'MM Extra Sekt trocken.', priceNet: 9.20, vatRate: 19, category: 'Sekt', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 25, featured: false },

    // Wein (19% VAT)
    { name: 'Gallo Family Zinfandel 0,75l', description: 'Rotwein, trocken.', priceNet: 10.88, vatRate: 19, category: 'Wein', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop', stock: 20, featured: false },
    { name: 'Somersby Apple Cider 0,33l', description: 'Apfel-Cider.', priceNet: 4.16, vatRate: 19, category: 'Wein', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Rotk?ppchen Dornfelder Halbtrocken 0,75l', description: 'Dornfelder Rotwein.', priceNet: 10.04, vatRate: 19, category: 'Wein', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop', stock: 20, featured: false },

    // Getr?nkekisten (19% VAT)
    { name: 'Krombacher Pils 0,5l Kiste', description: 'Bierkiste Krombacher Pils.', priceNet: 50.42, vatRate: 19, category: 'Getr?nkekisten', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 10, featured: false },
    { name: 'Heineken 0,33l Kiste', description: 'Bierkiste Heineken.', priceNet: 58.82, vatRate: 19, category: 'Getr?nkekisten', image: 'https://images.unsplash.com/photo-1608278905748-92f0a82f04f9?w=400&h=400&fit=crop', stock: 8, featured: false },
    { name: 'Coca-Cola 1,0l Kiste', description: 'Getr?nkekiste Coca-Cola 1,0l Mehrweg.', priceNet: 36.13, vatRate: 19, category: 'Getr?nkekisten', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop', stock: 8, featured: false },

    // Saft (7% VAT - Lebensmittel)
    { name: 'Granini Orange 1,0l', description: 'Orangensaft 100% Frucht.', priceNet: 4.21, vatRate: 7, category: 'Saft', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Hohes C Orange 1,0l', description: 'Orangensaft mit Vitaminen.', priceNet: 3.69, vatRate: 7, category: 'Saft', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Capri-Sun Orange 0,2l', description: 'Klassischer Orangensaft im Beutel.', priceNet: 1.21, vatRate: 7, category: 'Saft', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', stock: 200, featured: false },
    { name: 'Durstl?scher Orange 0,5l', description: 'Erfrischender Orangen-Durstl?scher.', priceNet: 2.06, vatRate: 7, category: 'Saft', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', stock: 80, featured: false },

    // Milch (7% VAT)
    { name: 'H-Milch 3,5% 1l', description: 'Haltbare Vollmilch, 3,5% Fett.', priceNet: 3.27, vatRate: 7, category: 'Milch', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', stock: 60, featured: true },

    // Wasser (7% VAT)
    { name: 'Apodis Medium 1,5l', description: 'Nat?rliches Mineralwasser mit wenig Kohlens?ure.', priceNet: 2.71, vatRate: 7, category: 'Wasser', image: 'https://images.unsplash.com/photo-1565709465515-144f0d10a53d?w=400&h=400&fit=crop', stock: 200, featured: true },
    { name: 'Apodis Classic 1,5l', description: 'Nat?rliches Mineralwasser mit Kohlens?ure.', priceNet: 2.71, vatRate: 7, category: 'Wasser', image: 'https://images.unsplash.com/photo-1565709465515-144f0d10a53d?w=400&h=400&fit=crop', stock: 200, featured: true },
    { name: 'Apodis Naturell 1,5l', description: 'Nat?rliches Mineralwasser ohne Kohlens?ure.', priceNet: 2.71, vatRate: 7, category: 'Wasser', image: 'https://images.unsplash.com/photo-1565709465515-144f0d10a53d?w=400&h=400&fit=crop', stock: 180, featured: false },
    { name: 'Apodis Medium 0,5l', description: 'Mineralwasser medium 0,5 Liter.', priceNet: 1.60, vatRate: 7, category: 'Wasser', image: 'https://images.unsplash.com/photo-1565709465515-144f0d10a53d?w=400&h=400&fit=crop', stock: 150, featured: false },
    // Lebensmittel (7% VAT - food)
    { name: 'Maggi Ravioli in pikanter Sauce mit Rindfleisch', description: 'Ravioli in pikanter Sauce.', priceNet: 5.14, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Samyang Buldak Carbonara 130g', description: 'W?rzige koreanische Instant-Nudeln Carbonara.', priceNet: 4.21, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 40, featured: false },
    { name: 'Samyang Buldak Spicy 140g', description: 'Extrem scharfe koreanische Instant-Nudeln.', priceNet: 4.21, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 45, featured: false },
    { name: 'Yum Yum Chicken 60g', description: 'Instant-Nudeln mit H?hnergeschmack.', priceNet: 2.06, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 100, featured: false },
    { name: 'Barilla Penne Rigate 500g', description: 'Italienische Hartweizennudeln.', priceNet: 4.63, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 50, featured: false },
    { name: 'Jacobs Gold 200g', description: 'Klassischer Filterkaffee.', priceNet: 14.02, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 30, featured: false },
    { name: 'Feiner Zucker 1kg', description: 'Haushaltszucker, 1kg.', priceNet: 3.55, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 40, featured: false },
    { name: 'Erasco Erbsen Eintopf 400g', description: 'Herzhafter Erbseneintopf.', priceNet: 4.67, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 35, featured: false },
    { name: 'Tomatenmark 200g', description: 'Einfaches Tomatenmark.', priceNet: 3.27, vatRate: 7, category: 'Lebensmittel', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop', stock: 50, featured: false },

    // Rauchbedarf (19% VAT)
    { name: 'Gizeh Original Gelb', description: 'Zigarettenpapier Original Gelb.', priceNet: 1.51, vatRate: 19, category: 'Rauchbedarf', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop', stock: 80, featured: false },
    { name: 'Gizeh Black Fine', description: 'Feines schwarzes Zigarettenpapier.', priceNet: 2.35, vatRate: 19, category: 'Rauchbedarf', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop', stock: 70, featured: false },
    { name: 'OCB Blue Doppelt', description: 'Zigarettenpapier OCB Blue.', priceNet: 2.35, vatRate: 19, category: 'Rauchbedarf', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop', stock: 65, featured: false },

    // Kaugummi (19% VAT)
    { name: 'Wrigley\'s Extra Professional Fresh Spearmint', description: 'Kaugummi mit Spearmint Geschmack.', priceNet: 2.10, vatRate: 19, category: 'Kaugummi', image: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=400&h=400&fit=crop', stock: 120, featured: false },
    { name: 'Wrigley\'s Extra Professional Fresh Strong Mint', description: 'Starke Minz-Kaugummi.', priceNet: 2.10, vatRate: 19, category: 'Kaugummi', image: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=400&h=400&fit=crop', stock: 120, featured: false },
    { name: 'Wrigley\'s Hubba Bubba Strawberry', description: 'Kaubonbon Kaugummi Erdbeer.', priceNet: 2.10, vatRate: 19, category: 'Kaugummi', image: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=400&h=400&fit=crop', stock: 90, featured: false },

    // Drogerie (19% VAT)
    { name: 'M?llbeutel 20 Stck.', description: 'M?llbeutel 60x72cm, 60 Liter.', priceNet: 3.36, vatRate: 19, category: 'Drogerie', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop', stock: 40, featured: false },
    { name: 'Toilettenpapier 8 Rollen', description: 'Weiches Toilettenpapier 3-lagig.', priceNet: 5.46, vatRate: 19, category: 'Drogerie', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop', stock: 50, featured: true },
    { name: 'K?chenrolle 4 Rollen', description: 'Saustarke K?chenrolle 4er-Pack.', priceNet: 5.46, vatRate: 19, category: 'Drogerie', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop', stock: 45, featured: false },
    { name: 'Sp?lmittel 0,5l', description: 'Konzentriertes Sp?lmittel.', priceNet: 3.32, vatRate: 19, category: 'Drogerie', image: 'https://images.unsplash.com/photo-1623260484651-232355e8370a?w=400&h=400&fit=crop', stock: 60, featured: false },
    { name: 'Fl?ssigseife 0,5l', description: 'Fl?ssigseife mit Passionsfrucht Duft.', priceNet: 3.32, vatRate: 19, category: 'Drogerie', image: 'https://images.unsplash.com/photo-1623260484651-232355e8370a?w=400&h=400&fit=crop', stock: 55, featured: false },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('? ' + products.length + ' products created');
  // Store Settings (Barsb?ttel)
  await prisma.storeSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'YaNa Kiosk Barsb?ttel',
      address: 'Barsb?tteler Hof 2c, 22885 Barsb?ttel',
      phone: '+49 40 123456789',
      email: 'info@yanakiosk.de',
    },
  });
  console.log('? Store settings created');

  console.log('\n=== Database seeded successfully! ===');
  console.log('Store: YaNa Kiosk Barsb?ttel');
  console.log('Address: Barsb?tteler Hof 2c, 22885 Barsb?ttel');
  console.log('Admin: admin@yanakiosk.de / Admin123!');
  console.log('Products: ' + products.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
