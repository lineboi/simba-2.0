// Curated Unsplash photo IDs mapped to product keywords
const KEYWORD_MAP: { keywords: string[]; photoId: string }[] = [
  // Honey
  { keywords: ['honey'], photoId: 'photo-1558642452-9d2a7deb7f62' },
  // Perfume / fragrance
  { keywords: ['perfum', 'fragrance', 'cologne', 'deodorant', 'deo', 'body spray', 'antiperspirant'], photoId: 'photo-1541643600914-78b084683702' },
  // Air freshener / room spray
  { keywords: ['air wick', 'air freshner', 'freshener', 'freshner', 'wick', 'jasmine', 'lavander', 'lavender', 'la fresh', 'febreze'], photoId: 'photo-1585687433806-6b784a4abc61' },
  // Insecticide / mosquito
  { keywords: ['insecticide', 'insectcide', 'mosquito', 'nyamuk', 'baygon', 'flying insect', 'pest'], photoId: 'photo-1585687433806-6b784a4abc61' },
  // Toilet cleaner / WC
  { keywords: ['toilet cleaner', 'toilet clean', 'toilet block', 'harpic', 'bloc wc', 'wc ', 'hygionic', 'loo'], photoId: 'photo-1563453392212-326f5e854473' },
  // Dishwashing / dish soap
  { keywords: ['dishwash', 'dish wash', 'axion', 'washing up', 'lemon dish', 'dish soap'], photoId: 'photo-1585771724684-38269d6639fd' },
  // Scouring / cleaning powder
  { keywords: ['scouring', 'scour', 'cleaning powder', 'powder clean'], photoId: 'photo-1563453392212-326f5e854473' },
  // Fabric softener / laundry
  { keywords: ['fabric softner', 'fabric softener', 'laundry', 'softner', 'softener', 'washing powder', 'detergent'], photoId: 'photo-1545173168-9f1947eebb7f' },
  // General cleaner / spray cleaner / surface cleaner
  { keywords: ['cleaner', 'cleaning spray', 'surface clean', 'javel', 'bleach', 'disinfect', 'ace toilet', 'window clean', 'glass clean', 'everyday'], photoId: 'photo-1563453392212-326f5e854473' },
  // Furniture polish / wood polish
  { keywords: ['furniture', 'polish', 'pledge', 'tropikal', 'wood polish', 'beautify'], photoId: 'photo-1586023492125-27b2c045efd7' },
  // Cleaning cloth / microfiber / sponge / towel
  { keywords: ['cloth', 'microfiber', 'sponge', 'towel', 'floor-cloth', 'floor cloth', 'shower towel', 'fiber cloth', 'wash cloth', 'chamois'], photoId: 'photo-1563453392212-326f5e854473' },
  // Car shampoo / car wash
  { keywords: ['car shampoo', 'car wash', 'auto'], photoId: 'photo-1520340356584-f9917d1eea6f' },
  // Steam iron
  { keywords: ['steam iron', 'dry iron', 'iron ni-', ' iron'], photoId: 'photo-1558618666-fcd25c85cd64' },
  // Coffee / mocha pot
  { keywords: ['coffee', 'mocha', 'espresso', 'cappuccino', 'nescafe'], photoId: 'photo-1495474472287-4d71bcdd2085' },
  // Storage canister / container / box
  { keywords: ['canister', 'container', 'storage', 'jar', 'box ', 'organizer'], photoId: 'photo-1519710164239-da123dc03ef4' },
  // Aluminum foil / kitchen wrap
  { keywords: ['aluminium foil', 'aluminum foil', 'foil', 'cling wrap'], photoId: 'photo-1556909114-f6e7ad7d3136' },
  // Baby milk / formula
  { keywords: ['baby milk', 'lactogen', 'formula', 'infant', 'nan ', 'similac', 'aptamil'], photoId: 'photo-1584118624012-df056829fbd0' },
  // Baby diapers / nappies
  { keywords: ['diaper', 'nappy', 'nappies', 'pampers', 'huggies'], photoId: 'photo-1515488042361-ee00e0ddd4e4' },
  // Baby wipes
  { keywords: ['baby wipe', 'wipes', 'wet wipe'], photoId: 'photo-1515488042361-ee00e0ddd4e4' },
  // Water bottle
  { keywords: ['water bottle', 'water bottel', 'mineral water', 'drinking water', 'casino water'], photoId: 'photo-1602143407151-7111542de6e8' },
  // Shampoo / hair
  { keywords: ['shampoo', 'hair conditioner', 'hair oil', 'hair care', 'head & shoulders', 'pantene', 'tresemme'], photoId: 'photo-1556228578-8c89e6adf883' },
  // Soap / body wash
  { keywords: ['soap', 'body wash', 'shower gel', 'bath gel', 'dettol', 'lifebuoy', 'imperial leather'], photoId: 'photo-1584305574647-0cc949a2bb9f' },
  // Lotion / cream / moisturiser
  { keywords: ['lotion', 'cream', 'moistur', 'body lotion', 'hand cream', 'vaseline', 'nivea', 'fair & lovely', 'olay'], photoId: 'photo-1570172619644-dfd03ed5d881' },
  // Toothbrush / toothpaste / dental
  { keywords: ['toothbrush', 'toothpaste', 'dental', 'mouthwash', 'oral', 'colgate', 'sensodyne', 'listerine'], photoId: 'photo-1559591937-aba89b77e9ae' },
  // Sunscreen / sunblock
  { keywords: ['sunscreen', 'sunblock', 'spf', 'sun cream'], photoId: 'photo-1596462502278-27bfdc403348' },
  // Massage roller / fitness equipment
  { keywords: ['massage roller', 'roller', 'foam roller', 'fitness'], photoId: 'photo-1571019614242-c5c5dee9f50b' },
  // Paper / stationery
  { keywords: ['paper', 'photocopying', 'a4', 'copy paper', 'sinar line'], photoId: 'photo-1497032628192-86f99bcd76bc' },
  // Scotch tape / stationery
  { keywords: ['scotch', 'tape', 'jambo', 'straw paper', 'straw'], photoId: 'photo-1456324463128-7ff6903988d8' },
  // Brush / cleaning brush / mop / broom
  { keywords: ['cleaning brush', 'scrub brush', 'brush', 'mop', 'broom', 'toilet brush', 'cevre', 'yirong'], photoId: 'photo-1563453392212-326f5e854473' },
  // Beer
  { keywords: ['beer', 'lager', 'ale', 'primus', 'mutzig', 'amstel', 'heineken', 'turbo king', 'skol', 'bralirwa'], photoId: 'photo-1608270586620-248524c67de9' },
  // Wine
  { keywords: ['wine', 'vino', 'rouge', 'blanc', 'rose wine', 'champagne', 'prosecco'], photoId: 'photo-1510812431401-41d2bd2722f3' },
  // Whisky / spirits
  { keywords: ['whisky', 'whiskey', 'vodka', 'gin', 'rum', 'spirit', 'liquor', 'brandy', 'cognac', 'tequila'], photoId: 'photo-1569529465841-dfecdab7503b' },
  // Juice / soft drink
  { keywords: ['juice', 'soft drink', 'soda', 'coca', 'pepsi', 'fanta', 'sprite', 'energy drink', 'minute maid', 'ribena', 'oran'], photoId: 'photo-1622483767028-3f66f32aef97' },
  // Rice / grains / maize
  { keywords: ['rice', 'grain', 'maize', 'posho', 'sorghum', 'millet'], photoId: 'photo-1586201375761-83865001e31c' },
  // Pasta / noodles
  { keywords: ['pasta', 'spaghetti', 'noodle', 'macaroni', 'vermicelli'], photoId: 'photo-1551462147-37885acc36f1' },
  // Flour / baking
  { keywords: ['flour', 'baking powder', 'yeast', 'baking', 'corn starch', 'starch'], photoId: 'photo-1627485937980-221c88ac04f9' },
  // Cooking oil
  { keywords: ['cooking oil', 'vegetable oil', 'palm oil', 'olive oil', 'sunflower oil', 'canola'], photoId: 'photo-1474979266404-7eaacbcd87c5' },
  // Sauce / ketchup / condiments
  { keywords: ['sauce', 'ketchup', 'mayonnaise', 'mayo', 'chilli sauce', 'hot sauce', 'mustard', 'vinegar'], photoId: 'photo-1611171711912-e3f5a8f12a06' },
  // Sugar / salt / seasoning / spices
  { keywords: ['sugar', 'salt', 'seasoning', 'spice', 'pepper', 'cinnamon', 'cumin', 'curry'], photoId: 'photo-1581354765900-b81b7a25c7fe' },
  // Tea
  { keywords: ['tea', 'green tea', 'black tea', 'lipton', 'chai'], photoId: 'photo-1556679343-c7306c1976bc' },
  // Milk / dairy
  { keywords: ['milk', 'dairy', 'butter', 'cheese', 'yogurt', 'yoghurt', 'cream cheese', 'margarine'], photoId: 'photo-1563636619-e9143da7973b' },
  // Cereal / oats
  { keywords: ['cereal', 'oat', 'corn flakes', 'muesli', 'porridge', 'weetabix', 'kellogg'], photoId: 'photo-1517093157656-b9eccef91cb1' },
  // Chips / snacks / biscuits
  { keywords: ['chips', 'snack', 'biscuit', 'cookie', 'cracker', 'popcorn', 'crisps', 'pringles', 'digestive'], photoId: 'photo-1558961363-fa8fdf82db35' },
  // Jam / spread
  { keywords: ['jam', 'jelly', 'spread', 'peanut butter', 'nutella', 'marmalade'], photoId: 'photo-1504674900247-0877df9cc836' },
  // Canned food
  { keywords: ['canned', 'tin ', 'tuna', 'sardine', 'corned beef', 'baked beans', 'tomato paste', 'tomato puree'], photoId: 'photo-1584568694244-14fbdf83bd30' },
  // Kitchen utensils / pot / pan
  { keywords: ['pot ', 'pan ', 'frying', 'cookware', 'utensil', 'spoon', 'fork', 'knife set', 'spatula', 'ladle', 'colander'], photoId: 'photo-1556909114-f6e7ad7d3136' },
  // Cup / mug / glass / tumbler
  { keywords: ['cup', 'mug', 'glass', 'tumbler', 'thermos', 'flask'], photoId: 'photo-1495474472287-4d71bcdd2085' },
  // Plate / bowl / dish
  { keywords: ['plate', 'bowl', 'dish', 'serving', 'salad bowl', 'tray'], photoId: 'photo-1493770348161-369560ae357d' },
  // Bag / basket
  { keywords: ['bag', 'basket', 'bin', 'waste', 'garbage', 'trash'], photoId: 'photo-1604719312566-8912e9227c6a' },
  // Batteries / electronics accessories
  { keywords: ['battery', 'batteries', 'charger', 'cable', 'bulb', 'torch', 'flashlight', 'adapter'], photoId: 'photo-1509395062183-a6c5ee64b1d6' },
];

const CATEGORY_FALLBACK: Record<string, string> = {
  'Food Products': 'photo-1542838132-92c53300491e',
  'Cosmetics & Personal Care': 'photo-1596462502278-27bfdc403348',
  'Cleaning & Sanitary': 'photo-1563453392212-326f5e854473',
  'Alcoholic Drinks': 'photo-1510812431401-41d2bd2722f3',
  'Baby Products': 'photo-1515488042361-ee00e0ddd4e4',
  'Kitchenware & Electronics': 'photo-1556909114-f6e7ad7d3136',
  'Sports & Fitness': 'photo-1517836357463-d25dfeac3438',
  'Stationery': 'photo-1497032628192-86f99bcd76bc',
  'General': 'photo-1604719312566-8912e9227c6a',
};

export function getProductImage(name: string, category: string): string {
  const lower = name.toLowerCase();
  for (const { keywords, photoId } of KEYWORD_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return `https://images.unsplash.com/${photoId}?w=400&q=80&auto=format&fit=crop`;
    }
  }
  const fallback = CATEGORY_FALLBACK[category] ?? 'photo-1604719312566-8912e9227c6a';
  return `https://images.unsplash.com/${fallback}?w=400&q=80&auto=format&fit=crop`;
}

// Returns true if the product has a specific keyword-matched image (not just category fallback)
export function hasSpecificImage(name: string): boolean {
  const lower = name.toLowerCase();
  return KEYWORD_MAP.some(({ keywords }) => keywords.some((kw) => lower.includes(kw)));
}
