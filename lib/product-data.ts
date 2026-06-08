export type ProductCategoryName =
  | "Foot Protection"
  | "Head Protection"
  | "Fall Protection"
  | "Eye and Face Protection"
  | "Hearing Protection"
  | "Respiratory Protection"
  | "Hand Protection"
  | "Workwear"
  | "Outdoor Wear"
  | "Technical Wear"
  | "Disposable Wear"
  | "ESD"
  | "W/ DOLE Certificate"

export type ProductCategory = {
  name: ProductCategoryName
  description: string
}

export type CatalogProduct = {
  id: string
  name: string
  category: ProductCategoryName
  brand: string
  description: string
  spec: string
  badge?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
  isDemo?: boolean
}

export const productCategories: ProductCategory[] = [
  {
    name: "Foot Protection",
    description: "Safety footwear for daily site work, wet floors, and heavy-duty industrial environments.",
  },
  {
    name: "Head Protection",
    description: "Hard hats, bump caps, and helmet accessories for construction and industrial sites.",
  },
  {
    name: "Fall Protection",
    description: "Harnesses, lanyards, and anchors for elevated work and controlled access zones.",
  },
  {
    name: "Eye and Face Protection",
    description: "Safety glasses, goggles, and shields for impact, splash, and dust protection.",
  },
  {
    name: "Hearing Protection",
    description: "Earplugs and earmuffs for high-noise production lines and machinery areas.",
  },
  {
    name: "Respiratory Protection",
    description: "Masks and respirators for dust, fumes, and airborne particulate control.",
  },
  {
    name: "Hand Protection",
    description: "Work gloves for cut resistance, grip, chemical handling, and general protection.",
  },
  {
    name: "Workwear",
    description: "Durable uniforms, coveralls, and high-visibility garments for daily operations.",
  },
  {
    name: "Outdoor Wear",
    description: "Weather-ready gear for field crews, logistics teams, and exposed work areas.",
  },
  {
    name: "Technical Wear",
    description: "Specialized protective apparel for welding, electrical, and heat-risk work.",
  },
  {
    name: "Disposable Wear",
    description: "Single-use coveralls, masks, caps, and shoe covers for clean or controlled zones.",
  },
  {
    name: "ESD",
    description: "Static-control equipment for electronics, assembly, and sensitive production floors.",
  },
  {
    name: "W/ DOLE Certificate",
    description: "Certified PPE and documentation-ready items for compliance-focused procurement.",
  },
]

export const demoProducts: CatalogProduct[] = [
  {
    id: "demo-hard-hat",
    name: "Industrial Vented Safety Helmet",
    category: "Head Protection",
    brand: "MSA Safety",
    description: "Lightweight helmet for construction, warehouse, and field operations.",
    spec: "ANSI Z89.1 Type I, adjustable ratchet suspension",
    badge: "Demo",
    createdAt: "2026-01-01T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-respirator",
    name: "Reusable Half-Face Respirator",
    category: "Respiratory Protection",
    brand: "3M",
    description: "Reusable respirator for dust, fumes, and particulate-heavy work areas.",
    spec: "Compatible with P100 cartridge filters",
    badge: "Popular",
    createdAt: "2026-01-01T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-gloves",
    name: "Cut-Resistant Work Gloves",
    category: "Hand Protection",
    brand: "Ansell",
    description: "Grip-focused gloves for handling sheet metal, glass, and sharp components.",
    spec: "EN 388 cut protection, breathable knit shell",
    badge: "Best Seller",
    createdAt: "2026-01-01T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "demo-vest",
    name: "High-Visibility Reflective Vest",
    category: "Workwear",
    brand: "Portwest",
    description: "Bright reflective vest for traffic control, logistics, and site visibility.",
    spec: "Reflective tape, breathable mesh, multiple pockets",
    badge: "Ready Stock",
    createdAt: "2026-01-01T00:00:00.000Z",
    isDemo: true,
  },
]


