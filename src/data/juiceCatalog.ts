export type JuiceCategory = 'all' | 'greens' | 'roots' | 'citrus' | 'mylks' | 'shots';

export type BottleSize = '12oz' | '16oz' | '32oz';

export interface BotanicalIngredient {
  name: string;
  origin: string;
  weightGrams: number;
  role: string;
}

export interface JuiceProduct {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  category: Exclude<JuiceCategory, 'all'>;
  categoryLabel: string;
  basePrice16oz: number;
  imageUrl?: string;
  liquidHexPrimary: string;
  liquidHexSecondary: string;
  accentHex: string;
  botanicalNote: string;
  availabilityStatus: string;
  produceWeightLbs: number;
  pressTempFahrenheit: number;
  shelfLifeDays: number;
  glycemicIndex: 'Low' | 'Moderate';
  pHLevel: number;
  brixLevel: string;
  nutrition: {
    calories: number;
    sugarGrams: number;
    fiberGrams: number;
    proteinGrams: number;
    vitaminCPercent: number;
    potassiumMg: number;
    magnesiumPercent: number;
  };
  ingredients: BotanicalIngredient[];
  tastingProfile: {
    earthiness: number; // 1-5
    sweetness: number; // 1-5
    acidity: number; // 1-5
    spice: number; // 1-5
  };
  ritualTiming: string;
  description: string;
}

export interface CustomIngredientOption {
  id: string;
  name: string;
  type: 'base' | 'produce' | 'booster';
  origin: string;
  colorHex: string;
  calories: number;
  sugarGrams: number;
  vitaminCPercent: number;
  potassiumMg: number;
  priceDelta: number;
  pHImpact: number;
  weightLbs: number;
  flavorTag: string;
}

export interface CleanseFlight {
  id: string;
  code: string;
  title: string;
  durationDays: number;
  bottlesPerDay: number;
  totalBottles: number;
  price: number;
  dailyCalories: number;
  targetOutcome: string;
  description: string;
  schedule: {
    time: string;
    bottleName: string;
    purpose: string;
  }[];
  includedProductIds: string[];
}

export const JUICE_CATALOG: JuiceProduct[] = [
  {
    id: 'emerald-canopy',
    code: 'NO. 01',
    name: 'Emerald Canopy',
    subtitle: 'Lacinato Kale, English Cucumber, Yuzu & Wild Mint',
    category: 'greens',
    categoryLabel: 'Chlorophyll Greens',
    basePrice16oz: 12.50,
    imageUrl: '/src/assets/images/juice_emerald_canopy_1791182868810.jpg',
    liquidHexPrimary: '#1E4D36',
    liquidHexSecondary: '#3A7D58',
    accentHex: '#1B4332',
    botanicalNote: 'Zero Fruit · High Chlorophyll',
    availabilityStatus: 'Pressed 5:00 AM Today',
    produceWeightLbs: 2.6,
    pressTempFahrenheit: 37.5,
    shelfLifeDays: 4,
    glycemicIndex: 'Low',
    pHLevel: 8.4,
    brixLevel: '6.2° Bx',
    nutrition: {
      calories: 70,
      sugarGrams: 3,
      fiberGrams: 1,
      proteinGrams: 4,
      vitaminCPercent: 145,
      potassiumMg: 680,
      magnesiumPercent: 28,
    },
    ingredients: [
      { name: 'Organic Lacinato Kale', origin: 'Salinas Valley, CA', weightGrams: 240, role: 'Chlorophyll & Vitamin K1' },
      { name: 'Seedless English Cucumber', origin: 'Oxnard, CA', weightGrams: 310, role: 'Cellular Silica Hydration' },
      { name: 'Celery Heart Stalks', origin: 'Ventura County, CA', weightGrams: 190, role: 'Natural Sodium Electrolytes' },
      { name: 'Cold-Pressed Yuzu Rind & Juice', origin: 'Kochi Prefecture / Sonoma', weightGrams: 35, role: 'Aromatic Citrus Lift' },
      { name: 'Garden Spearmint Leaf', origin: 'Half Moon Bay, CA', weightGrams: 18, role: 'Digestive Cooling' },
    ],
    tastingProfile: {
      earthiness: 4,
      sweetness: 1,
      acidity: 3,
      spice: 1,
    },
    ritualTiming: '07:30 AM · First Awakening Hydration',
    description:
      'An uncompromising, zero-orchard-fruit green extraction pressed from 2.6 pounds of dark leafy brassicas and crisp stalk vegetables. Finished with aromatic Japanese yuzu to brighten the mineral finish without spiking blood glucose.',
  },
  {
    id: 'golden-solstice',
    code: 'NO. 02',
    name: 'Golden Solstice',
    subtitle: 'Hawaiian Red Turmeric, Peruvian Ginger, Valencia Orange & Piperine',
    category: 'citrus',
    categoryLabel: 'Turmeric & Citrus',
    basePrice16oz: 13.00,
    imageUrl: '/src/assets/images/juice_golden_solstice_bottle_1791183446412.jpg',
    liquidHexPrimary: '#D97706',
    liquidHexSecondary: '#F59E0B',
    accentHex: '#B45309',
    botanicalNote: '4,200mg Curcuminoids',
    availabilityStatus: 'Pressed 5:00 AM Today',
    produceWeightLbs: 2.4,
    pressTempFahrenheit: 38.0,
    shelfLifeDays: 5,
    glycemicIndex: 'Moderate',
    pHLevel: 6.2,
    brixLevel: '11.8° Bx',
    nutrition: {
      calories: 120,
      sugarGrams: 14,
      fiberGrams: 2,
      proteinGrams: 2,
      vitaminCPercent: 240,
      potassiumMg: 490,
      magnesiumPercent: 14,
    },
    ingredients: [
      { name: 'Hawaiian Red Olena Turmeric', origin: 'Puna District, HI', weightGrams: 85, role: 'Bio-Active Curcumin' },
      { name: 'Cold-Pressed Valencia Orange', origin: 'Ojai Valley, CA', weightGrams: 340, role: 'Ascorbic Acid Matrix' },
      { name: 'Raw Peruvian Ginger Rhizome', origin: 'Junín Region, Peru', weightGrams: 65, role: 'Thermogenic Gingerols' },
      { name: 'Heirloom Golden Pineapple Core', origin: 'Maui, HI', weightGrams: 180, role: 'Bromelain Enzymes' },
      { name: 'Cracked Tellicherry Black Pepper', origin: 'Malabar Coast, India', weightGrams: 2, role: '2,000% Curcumin Absorption' },
    ],
    tastingProfile: {
      earthiness: 3,
      sweetness: 3,
      acidity: 4,
      spice: 4,
    },
    ritualTiming: '10:30 AM · Mid-Morning Solar Ignition',
    description:
      'Cold-extracted whole Hawaiian red turmeric and fiery Peruvian ginger suspended in sun-ripened Ojai Valencia orange and bromelain-rich pineapple core. Activated with a trace infusion of Tellicherry black peppercorn to unlock systemic bioavailability.',
  },
  {
    id: 'crimson-velvet',
    code: 'NO. 03',
    name: 'Crimson Velvet',
    subtitle: 'Heirloom Bull’s Blood Beet, Pomegranate Arils, Moro Blood Orange & Hibiscus',
    category: 'roots',
    categoryLabel: 'Roots & Beets',
    basePrice16oz: 13.50,
    imageUrl: '/src/assets/images/juice_crimson_velvet_bottle_1791183459553.jpg',
    liquidHexPrimary: '#7F1D1D',
    liquidHexSecondary: '#B91C1C',
    accentHex: '#881337',
    botanicalNote: 'Nitric Oxide Vascular Flow',
    availabilityStatus: 'Pressed 5:00 AM Today',
    produceWeightLbs: 2.8,
    pressTempFahrenheit: 37.8,
    shelfLifeDays: 5,
    glycemicIndex: 'Moderate',
    pHLevel: 6.8,
    brixLevel: '12.4° Bx',
    nutrition: {
      calories: 135,
      sugarGrams: 16,
      fiberGrams: 2,
      proteinGrams: 3,
      vitaminCPercent: 160,
      potassiumMg: 740,
      magnesiumPercent: 22,
    },
    ingredients: [
      { name: 'Heirloom Bull’s Blood Beetroot', origin: 'Petaluma, CA', weightGrams: 320, role: 'Dietary Nitrates & Betalains' },
      { name: 'Wonderful Pomegranate Arils', origin: 'San Joaquin Valley, CA', weightGrams: 210, role: 'Punicalagin Polyphenols' },
      { name: 'Moro Blood Orange', origin: 'Riverside, CA', weightGrams: 180, role: 'Anthocyanin Citrus' },
      { name: 'Granny Smith Tart Apple', origin: 'Sebastopol, CA', weightGrams: 140, role: 'Malic Acid Balance' },
      { name: 'Steeped Crimson Hibiscus Calyx', origin: 'Oaxaca, Mexico', weightGrams: 40, role: 'Tart Botanical Tannin' },
    ],
    tastingProfile: {
      earthiness: 4,
      sweetness: 3,
      acidity: 4,
      spice: 1,
    },
    ritualTiming: '01:30 PM · Pre-Movement Oxygenation',
    description:
      'Deep ruby root extraction rich in natural dietary nitrates and pomegranate polyphenols to support vascular nitric oxide synthesis and sustained afternoon clarity. Tart Oaxaca hibiscus cuts the earthy sweetness of slow-grown Petaluma beets.',
  },
  {
    id: 'orchard-cloud',
    code: 'NO. 04',
    name: 'Orchard Cloud Mylk',
    subtitle: 'Activated Marcona Almond, Cashew Cream, Madagascar Vanilla Bean & Ceylon Cinnamon',
    category: 'mylks',
    categoryLabel: 'Sprouted Mylks',
    basePrice16oz: 14.00,
    imageUrl: '/src/assets/images/juice_orchard_cloud_bottle_1791183470287.jpg',
    liquidHexPrimary: '#E7E0D3',
    liquidHexSecondary: '#F5F0E6',
    accentHex: '#785A3C',
    botanicalNote: '22% Raw Sprouted Nut Density',
    availabilityStatus: 'Small Batch · 18 Bottles Left',
    produceWeightLbs: 1.9,
    pressTempFahrenheit: 36.5,
    shelfLifeDays: 3,
    glycemicIndex: 'Low',
    pHLevel: 7.4,
    brixLevel: '8.1° Bx',
    nutrition: {
      calories: 240,
      sugarGrams: 7,
      fiberGrams: 4,
      proteinGrams: 11,
      vitaminCPercent: 8,
      potassiumMg: 410,
      magnesiumPercent: 42,
    },
    ingredients: [
      { name: '24-Hour Sprouted Almonds', origin: 'Capay Valley, CA', weightGrams: 165, role: 'Bioavailable Vitamin E & Protein' },
      { name: 'Raw Whole Cashew Kernels', origin: 'Fair-Trade Beninese Co-op', weightGrams: 60, role: 'Velvet Lipid Mouthfeel' },
      { name: 'Spring Mountain Water', origin: 'Mount Shasta, CA', weightGrams: 410, role: 'Mineral Suspension' },
      { name: 'Whole Pitted Medjool Date', origin: 'Coachella Valley, CA', weightGrams: 28, role: 'Unrefined Trace Sweetness' },
      { name: 'Scraped Bourbon Vanilla & Ceylon Bark', origin: 'Sava, Madagascar / Sri Lanka', weightGrams: 6, role: 'Glycemic Support & Aroma' },
    ],
    tastingProfile: {
      earthiness: 2,
      sweetness: 3,
      acidity: 1,
      spice: 3,
    },
    ritualTiming: '06:30 PM · Evening Restorative Satiety',
    description:
      'Unlike commercial nut milks containing less than 2% nuts and synthetic gums, Orchard Cloud is stone-ground and hydraulically pressed at a 22% raw sprouted nut-to-water ratio. Silky, rich in plant protein, and spiced with true Ceylon cinnamon.',
  },
  {
    id: 'chlorophyll-veil',
    code: 'NO. 05',
    name: 'Chlorophyll Veil',
    subtitle: 'Dandelion Greens, Fennel Bulb, Green Anjou Pear, Spirulina & Meyer Lemon',
    category: 'greens',
    categoryLabel: 'Chlorophyll Greens',
    basePrice16oz: 13.00,
    imageUrl: '/src/assets/images/juice_chlorophyll_veil_bottle_1791183481450.jpg',
    liquidHexPrimary: '#134E4A',
    liquidHexSecondary: '#0F766E',
    accentHex: '#115E59',
    botanicalNote: '1,500mg Blue-Green Phycocyanin',
    availabilityStatus: 'Pressed 5:00 AM Today',
    produceWeightLbs: 2.7,
    pressTempFahrenheit: 37.5,
    shelfLifeDays: 4,
    glycemicIndex: 'Low',
    pHLevel: 8.1,
    brixLevel: '8.9° Bx',
    nutrition: {
      calories: 95,
      sugarGrams: 8,
      fiberGrams: 2,
      proteinGrams: 5,
      vitaminCPercent: 175,
      potassiumMg: 620,
      magnesiumPercent: 31,
    },
    ingredients: [
      { name: 'Wild Dandelion & Baby Spinach', origin: 'Watsonville, CA', weightGrams: 220, role: 'Hepatic Bitter Botanicals' },
      { name: 'Crisp Sweet Fennel Bulb', origin: 'Santa Maria, CA', weightGrams: 230, role: 'Anethole Digestive Calm' },
      { name: 'Green Anjou Pear', origin: 'Hood River, OR', weightGrams: 175, role: 'Silky Low-Glycemic Nectar' },
      { name: 'Meyer Lemon (Whole Rind)', origin: 'Santa Paula, CA', weightGrams: 55, role: 'Limonene Essential Oils' },
      { name: 'Fresh Cold-Cultured Spirulina', origin: 'Kona Coast, HI', weightGrams: 8, role: 'Phycocyanin Cellular Shield' },
    ],
    tastingProfile: {
      earthiness: 3,
      sweetness: 2,
      acidity: 3,
      spice: 2,
    },
    ritualTiming: '11:30 AM · Midday Metabolic Clarity',
    description:
      'A deeply mineral teal-emerald botanical infusion pairing sweet anise-scented fennel bulb and crisp Oregon Anjou pear with hepatic dandelion greens and fresh Kona spirulina.',
  },
  {
    id: 'obsidian-ember',
    code: 'NO. 06',
    name: 'Obsidian Ember Tonic',
    subtitle: 'Activated Coconut Shell Charcoal, Ruby Grapefruit, Raw Ginger & Ghost Pepper Trace',
    category: 'shots',
    categoryLabel: 'Charcoal & Tonics',
    basePrice16oz: 11.50,
    imageUrl: '/src/assets/images/juice_obsidian_ember_bottle_1791183493103.jpg',
    liquidHexPrimary: '#27272A',
    liquidHexSecondary: '#52525B',
    accentHex: '#18181B',
    botanicalNote: 'Adsorptive Charcoal + Capsaicin',
    availabilityStatus: 'Pressed 5:00 AM Today',
    produceWeightLbs: 2.1,
    pressTempFahrenheit: 38.0,
    shelfLifeDays: 5,
    glycemicIndex: 'Low',
    pHLevel: 7.9,
    brixLevel: '7.4° Bx',
    nutrition: {
      calories: 65,
      sugarGrams: 6,
      fiberGrams: 1,
      proteinGrams: 1,
      vitaminCPercent: 190,
      potassiumMg: 390,
      magnesiumPercent: 18,
    },
    ingredients: [
      { name: 'Rio Star Ruby Grapefruit', origin: 'Coachella Valley, CA', weightGrams: 310, role: 'Naringin Citrus Bitters' },
      { name: 'Young Thai Coconut Water', origin: 'Ratchaburi, Thailand', weightGrams: 240, role: 'Isotonic Electrolyte Base' },
      { name: 'Steam-Activated Coconut Charcoal', origin: 'Mindanao, Philippines', weightGrams: 4, role: 'Microporous GI Adsorption' },
      { name: 'Cold-Pressed Yellow Lemon', origin: 'Ventura, CA', weightGrams: 75, role: 'Alkalizing Citrate' },
      { name: 'Smoked Cayenne & Ginger Tincture', origin: 'Sonoma Apothecary', weightGrams: 12, role: 'Circulatory Warmth' },
    ],
    tastingProfile: {
      earthiness: 2,
      sweetness: 2,
      acidity: 5,
      spice: 4,
    },
    ritualTiming: '04:00 PM · Late-Afternoon Digestive Reset',
    description:
      'Jet-black botanical citrus tonic suspended with pharmaceutical-grade steam-activated coconut shell charcoal, bitter Rio Star ruby grapefruit, electrolyte-dense young Thai coconut water, and a clean cayenne heat finish.',
  },
  {
    id: 'valencia-rose-hip',
    code: 'NO. 07',
    name: 'Valencia Rose Hip',
    subtitle: 'Dry-Farmed Ojai Tangerine, Heirloom Carrot, Sea Buckthorn Berry & Wild Rose Hip',
    category: 'citrus',
    categoryLabel: 'Turmeric & Citrus',
    basePrice16oz: 12.75,
    liquidHexPrimary: '#C2410C',
    liquidHexSecondary: '#FB923C',
    accentHex: '#9A3412',
    botanicalNote: 'Beta-Carotene + Omega-7 Berry',
    availabilityStatus: 'Pressed 5:00 AM Today',
    produceWeightLbs: 2.5,
    pressTempFahrenheit: 37.6,
    shelfLifeDays: 5,
    glycemicIndex: 'Moderate',
    pHLevel: 6.4,
    brixLevel: '12.1° Bx',
    nutrition: {
      calories: 115,
      sugarGrams: 13,
      fiberGrams: 2,
      proteinGrams: 2,
      vitaminCPercent: 285,
      potassiumMg: 540,
      magnesiumPercent: 16,
    },
    ingredients: [
      { name: 'Ojai Pixie Tangerine & Valencia', origin: 'Ojai Valley, CA', weightGrams: 290, role: 'Bioflavonoid Citrus Base' },
      { name: 'Nantes Heirloom Sweet Carrot', origin: 'Cuyama Valley, CA', weightGrams: 240, role: 'Pro-Vitamin A Carotenoids' },
      { name: 'Nordic Sea Buckthorn Berry Press', origin: 'Coastal Oregon', weightGrams: 45, role: 'Rare Omega-7 Palmitoleic Acid' },
      { name: 'Cold-Infused Wild Rose Hip', origin: 'Patagonia / Sonoma', weightGrams: 30, role: 'Concentrated Ascorbic Complex' },
    ],
    tastingProfile: {
      earthiness: 2,
      sweetness: 4,
      acidity: 4,
      spice: 1,
    },
    ritualTiming: '09:30 AM · Dermal & Collagen Photoprotection',
    description:
      'Velvety tangerine and Cuyama Valley carrot nectar fortified with tart sea buckthorn berry and wild rose hip. Formulated for peak vitamin C and carotenoid synergy.',
  },
  {
    id: 'matcha-pistachio-mylk',
    code: 'NO. 08',
    name: 'Uji Matcha Pistachio Mylk',
    subtitle: 'Raw Bronte & Santa Barbara Pistachio, First-Harvest Uji Matcha, Chlorophyll & Cardamom',
    category: 'mylks',
    categoryLabel: 'Sprouted Mylks',
    basePrice16oz: 14.50,
    liquidHexPrimary: '#52796F',
    liquidHexSecondary: '#84A98C',
    accentHex: '#354F52',
    botanicalNote: '180mg L-Theanine · Calm Focus',
    availabilityStatus: 'Small Batch · 11 Bottles Left',
    produceWeightLbs: 1.8,
    pressTempFahrenheit: 36.2,
    shelfLifeDays: 3,
    glycemicIndex: 'Low',
    pHLevel: 7.6,
    brixLevel: '7.5° Bx',
    nutrition: {
      calories: 225,
      sugarGrams: 5,
      fiberGrams: 4,
      proteinGrams: 10,
      vitaminCPercent: 35,
      potassiumMg: 460,
      magnesiumPercent: 45,
    },
    ingredients: [
      { name: 'Raw Unroasted Pistachio Kernels', origin: 'Santa Barbara, CA', weightGrams: 150, role: 'Melatonin & Gamma-Tocopherol' },
      { name: 'Ceremonial First-Harvest Tencha Matcha', origin: 'Uji, Kyoto Prefecture', weightGrams: 5, role: 'L-Theanine Alpha-Wave Calm' },
      { name: 'Mount Shasta Spring Water', origin: 'Siskiyou County, CA', weightGrams: 420, role: 'Cold-Stone Emulsion' },
      { name: 'Crushed Green Cardamom Pod & Date', origin: 'Idukki, Kerala / Coachella', weightGrams: 22, role: 'Aromatic Terpene Lift' },
    ],
    tastingProfile: {
      earthiness: 4,
      sweetness: 2,
      acidity: 1,
      spice: 2,
    },
    ritualTiming: '02:00 PM · Jitter-Free Cognitive Endurance',
    description:
      'Stone-milled ceremonial Uji matcha Whisked at 36°F into freshly pressed raw Santa Barbara pistachio cream and green cardamom. Delivers four hours of calm alpha-wave focus without adrenal crash.',
  },
  {
    id: 'scarlet-root-tonic',
    code: 'NO. 09',
    name: 'Scarlet Burdock Root',
    subtitle: 'Fresh Burdock Root, Purple Majesty Carrot, Tart Montmorency Cherry & Schisandra Berry',
    category: 'roots',
    categoryLabel: 'Roots & Beets',
    basePrice16oz: 13.50,
    liquidHexPrimary: '#581C87',
    liquidHexSecondary: '#9333EA',
    accentHex: '#4C1D95',
    botanicalNote: 'Anthocyanins + Hepatic Inulin',
    availabilityStatus: 'Pressed 5:00 AM Today',
    produceWeightLbs: 2.7,
    pressTempFahrenheit: 37.8,
    shelfLifeDays: 5,
    glycemicIndex: 'Low',
    pHLevel: 7.1,
    brixLevel: '9.8° Bx',
    nutrition: {
      calories: 105,
      sugarGrams: 9,
      fiberGrams: 3,
      proteinGrams: 3,
      vitaminCPercent: 130,
      potassiumMg: 690,
      magnesiumPercent: 26,
    },
    ingredients: [
      { name: 'Purple Majesty Heritage Carrot', origin: 'Petaluma, CA', weightGrams: 290, role: 'Deep Purple Anthocyanins' },
      { name: 'Fresh Organic Gobo Burdock Root', origin: 'Humboldt County, CA', weightGrams: 160, role: 'Prebiotic Inulin & Lymphatic Flow' },
      { name: 'Montmorency Tart Cherry Press', origin: 'Traverse City, MI', weightGrams: 140, role: 'Natural Melatonin & Joint Recovery' },
      { name: 'Five-Flavor Schisandra Berry Extract', origin: 'Adaptogenic Apothecary', weightGrams: 15, role: 'HPA-Axis Stress Resilience' },
    ],
    tastingProfile: {
      earthiness: 4,
      sweetness: 2,
      acidity: 3,
      spice: 2,
    },
    ritualTiming: '05:00 PM · Post-Training Muscular Recovery',
    description:
      'A deep violet-crimson root extraction combining prebiotic burdock root and anthocyanin-dense purple carrots with Montmorency tart cherry to accelerate Evening muscular recovery.',
  },
];

export const CUSTOM_BOTANICAL_OPTIONS: CustomIngredientOption[] = [
  // Liquid Bases (Pick 1)
  {
    id: 'base-cucumber',
    name: 'Cold-Pressed English Cucumber',
    type: 'base',
    origin: 'Oxnard, CA',
    colorHex: '#2D6A4F',
    calories: 25,
    sugarGrams: 2,
    vitaminCPercent: 25,
    potassiumMg: 290,
    priceDelta: 0,
    pHImpact: 0.6,
    weightLbs: 1.2,
    flavorTag: 'Crisp & Cooling',
  },
  {
    id: 'base-coconut',
    name: 'Raw Young Thai Coconut Water',
    type: 'base',
    origin: 'Ratchaburi',
    colorHex: '#D6D3C9',
    calories: 45,
    sugarGrams: 5,
    vitaminCPercent: 15,
    potassiumMg: 480,
    priceDelta: 1.0,
    pHImpact: 0.3,
    weightLbs: 1.1,
    flavorTag: 'Silky Electrolyte',
  },
  {
    id: 'base-celery',
    name: 'Organic Celery Heart Juice',
    type: 'base',
    origin: 'Ventura, CA',
    colorHex: '#40916C',
    calories: 20,
    sugarGrams: 1,
    vitaminCPercent: 30,
    potassiumMg: 410,
    priceDelta: 0,
    pHImpact: 0.8,
    weightLbs: 1.3,
    flavorTag: 'Mineral Savory',
  },
  {
    id: 'base-orange',
    name: 'Ojai Valencia Orange Press',
    type: 'base',
    origin: 'Ojai, CA',
    colorHex: '#EA580C',
    calories: 85,
    sugarGrams: 11,
    vitaminCPercent: 140,
    potassiumMg: 360,
    priceDelta: 0.5,
    pHImpact: -0.3,
    weightLbs: 1.4,
    flavorTag: 'Sun-Ripened Citrus',
  },

  // Botanical Produce (Pick up to 4)
  {
    id: 'prod-kale',
    name: 'Lacinato Dinosaur Kale',
    type: 'produce',
    origin: 'Salinas Valley',
    colorHex: '#1B4332',
    calories: 18,
    sugarGrams: 0,
    vitaminCPercent: 65,
    potassiumMg: 180,
    priceDelta: 1.25,
    pHImpact: 0.5,
    weightLbs: 0.45,
    flavorTag: 'Deep Chlorophyll',
  },
  {
    id: 'prod-beet',
    name: 'Heirloom Bull’s Blood Beet',
    type: 'produce',
    origin: 'Petaluma, CA',
    colorHex: '#881337',
    calories: 32,
    sugarGrams: 5,
    vitaminCPercent: 18,
    potassiumMg: 240,
    priceDelta: 1.25,
    pHImpact: 0.2,
    weightLbs: 0.5,
    flavorTag: 'Earthy Nitrates',
  },
  {
    id: 'prod-apple',
    name: 'Tart Granny Smith Apple',
    type: 'produce',
    origin: 'Sebastopol, CA',
    colorHex: '#65A30D',
    calories: 40,
    sugarGrams: 7,
    vitaminCPercent: 20,
    potassiumMg: 110,
    priceDelta: 1.0,
    pHImpact: -0.1,
    weightLbs: 0.45,
    flavorTag: 'Crisp Malic Tartness',
  },
  {
    id: 'prod-fennel',
    name: 'Sweet Bulb Fennel',
    type: 'produce',
    origin: 'Santa Maria, CA',
    colorHex: '#52B788',
    calories: 22,
    sugarGrams: 2,
    vitaminCPercent: 30,
    potassiumMg: 210,
    priceDelta: 1.25,
    pHImpact: 0.3,
    weightLbs: 0.4,
    flavorTag: 'Aromatic Anise',
  },
  {
    id: 'prod-pineapple',
    name: 'Maui Gold Pineapple Core',
    type: 'produce',
    origin: 'Maui, HI',
    colorHex: '#EAB308',
    calories: 45,
    sugarGrams: 8,
    vitaminCPercent: 75,
    potassiumMg: 130,
    priceDelta: 1.50,
    pHImpact: -0.2,
    weightLbs: 0.45,
    flavorTag: 'Bromelain Nectar',
  },
  {
    id: 'prod-grapefruit',
    name: 'Rio Star Ruby Grapefruit',
    type: 'produce',
    origin: 'Coachella, CA',
    colorHex: '#E11D48',
    calories: 35,
    sugarGrams: 6,
    vitaminCPercent: 85,
    potassiumMg: 165,
    priceDelta: 1.25,
    pHImpact: 0.1,
    weightLbs: 0.5,
    flavorTag: 'Botanical Bitter',
  },
  {
    id: 'prod-lemon',
    name: 'Whole-Rind Meyer Lemon',
    type: 'produce',
    origin: 'Santa Paula, CA',
    colorHex: '#FACC15',
    calories: 12,
    sugarGrams: 1,
    vitaminCPercent: 55,
    potassiumMg: 80,
    priceDelta: 0.75,
    pHImpact: 0.4,
    weightLbs: 0.25,
    flavorTag: 'Bright Limonene',
  },
  {
    id: 'prod-mint',
    name: 'Wild Spearmint & Parsley Leaf',
    type: 'produce',
    origin: 'Half Moon Bay',
    colorHex: '#15803D',
    calories: 8,
    sugarGrams: 0,
    vitaminCPercent: 40,
    potassiumMg: 120,
    priceDelta: 0.75,
    pHImpact: 0.4,
    weightLbs: 0.2,
    flavorTag: 'Herbal Lift',
  },

  // Functional Boosters (Pick up to 3)
  {
    id: 'boost-turmeric',
    name: 'Hawaiian Red Turmeric + Piperine',
    type: 'booster',
    origin: 'Puna, HI',
    colorHex: '#D97706',
    calories: 10,
    sugarGrams: 0,
    vitaminCPercent: 15,
    potassiumMg: 60,
    priceDelta: 1.75,
    pHImpact: 0.2,
    weightLbs: 0.15,
    flavorTag: 'Anti-Inflammatory',
  },
  {
    id: 'boost-ginger',
    name: 'Cold-Pressed Peruvian Ginger (2 oz)',
    type: 'booster',
    origin: 'Junín, Peru',
    colorHex: '#CA8A04',
    calories: 8,
    sugarGrams: 0,
    vitaminCPercent: 10,
    potassiumMg: 55,
    priceDelta: 1.50,
    pHImpact: 0.2,
    weightLbs: 0.15,
    flavorTag: 'Warm Gingerol Fire',
  },
  {
    id: 'boost-spirulina',
    name: 'Fresh Blue-Green Spirulina (1,500mg)',
    type: 'booster',
    origin: 'Kona Coast, HI',
    colorHex: '#0F766E',
    calories: 12,
    sugarGrams: 0,
    vitaminCPercent: 20,
    potassiumMg: 75,
    priceDelta: 2.25,
    pHImpact: 0.5,
    weightLbs: 0.05,
    flavorTag: 'Cellular Phycocyanin',
  },
  {
    id: 'boost-charcoal',
    name: 'Activated Coconut Shell Charcoal',
    type: 'booster',
    origin: 'Mindanao',
    colorHex: '#27272A',
    calories: 0,
    sugarGrams: 0,
    vitaminCPercent: 0,
    potassiumMg: 10,
    priceDelta: 1.50,
    pHImpact: 0.3,
    weightLbs: 0.02,
    flavorTag: 'GI Detox Bind',
  },
];

export const CLEANSE_FLIGHTS: CleanseFlight[] = [
  {
    id: 'flight-circadian-1d',
    code: 'PROTOCOL 01',
    title: '24-Hour Circadian Reset',
    durationDays: 1,
    bottlesPerDay: 6,
    totalBottles: 6,
    price: 72.00,
    dailyCalories: 725,
    targetOutcome: 'Digestive Rest & Cellular Re-Hydration',
    description:
      'Six chronologically sequenced 16 fl oz cold-pressed extractions engineered to give hepatic and digestive pathways a complete 24-hour solid-food pause while maintaining steady micronutrient and lipid satiety.',
    schedule: [
      { time: '07:30 AM', bottleName: 'No. 01 Emerald Canopy', purpose: 'Alkalizing chlorophyll & mineral electrolyte wake-up' },
      { time: '10:00 AM', bottleName: 'No. 02 Golden Solstice', purpose: 'Curcuminoid anti-inflammatory & vitamin C surge' },
      { time: '12:30 PM', bottleName: 'No. 05 Chlorophyll Veil', purpose: 'Spirulina phycocyanin & fennel digestive calm' },
      { time: '03:00 PM', bottleName: 'No. 03 Crimson Velvet', purpose: 'Beetroot nitric oxide for afternoon cognitive blood flow' },
      { time: '05:30 PM', bottleName: 'No. 06 Obsidian Ember Tonic', purpose: 'Activated charcoal binding before evening wind-down' },
      { time: '07:30 PM', bottleName: 'No. 04 Orchard Cloud Mylk', purpose: 'Sprouted almond lipid & protein overnight satiety' },
    ],
    includedProductIds: [
      'emerald-canopy',
      'golden-solstice',
      'chlorophyll-veil',
      'crimson-velvet',
      'obsidian-ember',
      'orchard-cloud',
    ],
  },
  {
    id: 'flight-botanical-3d',
    code: 'PROTOCOL 02',
    title: '72-Hour Deep Botanical Restoration',
    durationDays: 3,
    bottlesPerDay: 6,
    totalBottles: 18,
    price: 198.00,
    dailyCalories: 725,
    targetOutcome: 'Systemic Inflammation Reduction & Gut Microbiome Reset',
    description:
      'Our signature three-day protocol delivered in two insulated cold-pack shipments to preserve peak enzymatic activity. Contains 46.8 lbs of cold-pressed organic farm produce across 18 numbered glass apothecary bottles.',
    schedule: [
      { time: 'Day 1', bottleName: 'Glycogen Depletion & Alkalization', purpose: 'Transitioning metabolic focus from digestion to cellular repair' },
      { time: 'Day 2', bottleName: 'Deep Enzymatic Autophagy Support', purpose: 'Peak phytonutrient saturation with zero refined sugars' },
      { time: 'Day 3', bottleName: 'Microbiome Re-Inoculation Prep', purpose: 'High-polyphenol root and sprouted nut lipid stabilization' },
    ],
    includedProductIds: [
      'emerald-canopy',
      'golden-solstice',
      'chlorophyll-veil',
      'crimson-velvet',
      'obsidian-ember',
      'orchard-cloud',
    ],
  },
  {
    id: 'flight-greens-weekly',
    code: 'PROTOCOL 03',
    title: '5-Day Morning Chlorophyll Cadence',
    durationDays: 5,
    bottlesPerDay: 2,
    totalBottles: 10,
    price: 118.00,
    dailyCalories: 190,
    targetOutcome: 'Daily Morning Micronutrient Foundation (With Whole Foods)',
    description:
      'Designed for active routines that do not require a full liquid fast. Replace breakfast and mid-morning coffee crashes with two low-glycemic green and root presses for five consecutive weekdays.',
    schedule: [
      { time: '07:30 AM (Mon–Fri)', bottleName: '5× No. 01 Emerald Canopy', purpose: 'Zero-fruit green mineral hydration before caffeine' },
      { time: '11:00 AM (Mon–Fri)', bottleName: '3× No. 05 Chlorophyll Veil + 2× No. 02 Golden Solstice', purpose: 'Sustained midday focus without insulin spikes' },
    ],
    includedProductIds: [
      'emerald-canopy',
      'chlorophyll-veil',
      'golden-solstice',
    ],
  },
];

export const FARM_PROVENANCE = [
  {
    farm: 'Riverbench Organic Brassicas',
    region: 'Salinas Valley, California',
    crop: 'Lacinato Kale, Dandelion Greens & Baby Spinach',
    harvestToPressHours: 4.5,
    brixScore: '11.4° Bx',
    certification: 'CCOF Certified Organic · Regenerative Soil',
  },
  {
    farm: 'Olena Ridge Botanical Cooperative',
    region: 'Puna District, Big Island, Hawaii',
    crop: 'Red Hawaiian Turmeric & Cold-Cultured Spirulina',
    harvestToPressHours: 14.0,
    brixScore: '14.2° Bx',
    certification: 'Volcanic Mineral Soil · Pesticide-Free',
  },
  {
    farm: 'Pixie Hollow Citrus Groves',
    region: 'Ojai Valley & Santa Paula, California',
    crop: 'Valencia Oranges, Moro Blood Oranges & Meyer Lemons',
    harvestToPressHours: 5.0,
    brixScore: '13.8° Bx',
    certification: 'Dry-Farmed Heritage Trees · Hand-Harvested',
  },
  {
    farm: 'Capay Valley Orchard Collective',
    region: 'Yolo County, California',
    crop: 'Unpasteurized Nonpareil & Marcona Almonds',
    harvestToPressHours: 6.0,
    brixScore: 'N/A (22% Lipid)',
    certification: 'Steam-Pasteurization Exempt Raw Harvest',
  },
];

export const ATTRIBUTABLE_TESTIMONIALS = [
  {
    quote:
      'Switching from pasteurized grocery green juices to the 5-Day Morning Chlorophyll Cadence dropped my post-breakfast continuous glucose monitor spike from +42 mg/dL down to +6 mg/dL within two weeks.',
    author: 'Dr. Elena Rostova, MD',
    role: 'Endocrinology Fellow, UCSF Medical Center',
    outcomeMetric: '-85% Morning Glycemic Excursion over 14 Days',
  },
  {
    quote:
      'Before our marathon build block, our training group integrated Crimson Velvet and Emerald Canopy 90 minutes pre-session. Resting morning heart rate variability improved by 14 ms across our 6-week block.',
    author: 'Marcus Vance',
    role: 'Head Endurance Physiologist, Pacific Track Club',
    outcomeMetric: '+14 ms Average HRV Recovery across 6 Weeks',
  },
];
