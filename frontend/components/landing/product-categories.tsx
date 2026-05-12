import { HardHat, ShieldCheck, Hand, Footprints, Eye, Anchor, Wind, Ear, Shirt } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    icon: HardHat,
    title: "Hard Hats",
    description: "Industrial-grade head protection for construction, mining, and heavy industry applications.",
  },
  {
    icon: ShieldCheck,
    title: "Safety Vests",
    description: "High-visibility vests and reflective wear for worksite safety and compliance.",
  },
  {
    icon: Hand,
    title: "Protective Gloves",
    description: "Cut-resistant, chemical-resistant, and general-purpose work gloves for all industries.",
  },
  {
    icon: Footprints,
    title: "Safety Boots",
    description: "Steel-toe and composite-toe footwear with slip-resistant soles and protective features.",
  },
  {
    icon: Eye,
    title: "Protective Eyewear",
    description: "Safety glasses, goggles, and face shields for eye protection in hazardous environments.",
  },
  {
    icon: Anchor,
    title: "Safety Harnesses",
    description: "Fall protection systems including harnesses, lanyards, and anchor points.",
  },
  {
    icon: Wind,
    title: "Respiratory Protection",
    description: "Respirators, masks, and air-purifying equipment for dust and chemical protection.",
  },
  {
    icon: Ear,
    title: "Hearing Protection",
    description: "Earplugs, earmuffs, and noise-canceling solutions for high-decibel work environments.",
  },
  {
    icon: Shirt,
    title: "Protective Uniforms",
    description: "Flame-resistant clothing, coveralls, and specialized workwear for industrial use.",
  },
]

export function ProductCategories() {
  return (
    <section id="products" className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Products</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Complete PPE Solutions for Every Industry
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            From head to toe protection, we supply certified safety equipment that meets international standards and keeps your workforce protected.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.title}
              className="group hover:shadow-lg transition-shadow duration-300 border-border hover:border-primary/30 cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
