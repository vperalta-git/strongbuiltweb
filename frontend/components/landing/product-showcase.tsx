import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import {
  Anchor,
  ArrowRight,
  Ear,
  Eye,
  Footprints,
  Hand,
  HardHat,
  ShieldCheck,
  Wind,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { type ProductCategoryName } from "@/lib/product-data"
import footProtectionImage from "@/assets/homedesign/category-foot-protection.png"
import headProtectionImage from "@/assets/homedesign/category-head-protection.png"
import fallProtectionImage from "@/assets/homedesign/category-fall-protection.png"
import eyeFaceProtectionImage from "@/assets/homedesign/category-eye-face-protection.png"
import hearingProtectionImage from "@/assets/homedesign/category-hearing-protection.png"
import respiratoryProtectionImage from "@/assets/homedesign/category-respiratory-protection.png"
import handProtectionImage from "@/assets/homedesign/category-hand-protection.png"
import workwearImage from "@/assets/homedesign/category-workwear.png"

type FeaturedCategory = {
  icon: LucideIcon
  name: ProductCategoryName
  description: string
  image: StaticImageData
}

const featuredCategories: FeaturedCategory[] = [
  {
    icon: Footprints,
    name: "Foot Protection",
    description: "Safety footwear for daily site work, wet floors, and heavy-duty industrial environments.",
    image: footProtectionImage,
  },
  {
    icon: HardHat,
    name: "Head Protection",
    description: "Hard hats, bump caps, and helmet accessories for construction and industrial sites.",
    image: headProtectionImage,
  },
  {
    icon: Anchor,
    name: "Fall Protection",
    description: "Harnesses, lanyards, and anchors for elevated work and controlled access zones.",
    image: fallProtectionImage,
  },
  {
    icon: Eye,
    name: "Eye and Face Protection",
    description: "Safety glasses, goggles, and shields for impact, splash, and dust protection.",
    image: eyeFaceProtectionImage,
  },
  {
    icon: Ear,
    name: "Hearing Protection",
    description: "Earplugs and earmuffs for high-noise production lines and machinery areas.",
    image: hearingProtectionImage,
  },
  {
    icon: Wind,
    name: "Respiratory Protection",
    description: "Masks and respirators for dust, fumes, and airborne particulate control.",
    image: respiratoryProtectionImage,
  },
  {
    icon: Hand,
    name: "Hand Protection",
    description: "Work gloves for cut resistance, grip, chemical handling, and general protection.",
    image: handProtectionImage,
  },
  {
    icon: ShieldCheck,
    name: "Workwear",
    description: "Durable uniforms, coveralls, and high-visibility garments for daily operations.",
    image: workwearImage,
  },
]

export function ProductShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] py-18 lg:py-24">
      <div
        className="pointer-events-none absolute right-0 top-10 h-80 w-80 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 2px, transparent 2px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rotate-45 border-y-[28px] border-orange-100/65" />

      <div className="section-shell relative">
        <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="text-sm font-extrabold uppercase tracking-[0.22em] text-primary">Featured Categories</span>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#0b2038] text-balance sm:text-5xl">
              PPE essentials organized for quick procurement
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 text-pretty">
              Start with the most requested safety gear, then jump into the catalog to filter by brand, category, specs,
              and certification notes.
            </p>
          </div>
          <Button size="lg" className="h-12 px-7 shadow-lg shadow-orange-950/15" asChild>
            <Link href="/products">
              Browse Full Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative flex min-h-[390px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/8 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-slate-900/14"
            >
              <div className="absolute inset-x-0 top-0 z-20 mx-auto h-1 w-[42%] rounded-b-full bg-primary transition-all duration-300 group-hover:w-1/2 group-hover:h-1.5" />
              <div className="flex w-full flex-col">
                <div className="relative h-44 overflow-hidden p-2">
                  <div className="relative h-full overflow-hidden rounded-md">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  </div>
                </div>

                <div className="relative flex flex-1 flex-col p-5 pt-0">
                  <div className="-mt-8 mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-primary shadow-lg shadow-slate-900/8">
                    <category.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-extrabold leading-tight text-[#0b2038]">{category.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4 text-sm font-extrabold text-primary">
                    <span>View category</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
