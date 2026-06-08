import Image, { type StaticImageData } from "next/image"
import { Award, Cog, DollarSign, Handshake, Headphones, Package, type LucideIcon } from "lucide-react"
import qualityPpeImage from "@/assets/homedesign/quality_ppe_products_image.png"
import trustedSupplyImage from "@/assets/homedesign/trusted_supply_partner_image.png"
import industryReadyImage from "@/assets/homedesign/industry_ready_solutions_image.png"
import competitivePricingImage from "@/assets/homedesign/competitive_pricing_image.png"
import responsiveSupportImage from "@/assets/homedesign/responsive_support_image.png"
import reliableAvailabilityImage from "@/assets/homedesign/reliable_availability_image.png"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  image: StaticImageData
}

const features: Feature[] = [
  {
    icon: Award,
    title: "Quality PPE Products",
    description: "All our products meet international safety standards and undergo rigorous quality control.",
    image: qualityPpeImage,
  },
  {
    icon: Handshake,
    title: "Trusted Supply Partner",
    description: "Over 15 years of reliable service to construction, mining, and industrial clients.",
    image: trustedSupplyImage,
  },
  {
    icon: Cog,
    title: "Industry-Ready Solutions",
    description: "PPE packages tailored to specific industry requirements and compliance needs.",
    image: industryReadyImage,
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description: "Volume discounts and flexible pricing structures for businesses of all sizes.",
    image: competitivePricingImage,
  },
  {
    icon: Headphones,
    title: "Responsive Support",
    description: "Dedicated account managers and fast response times for all inquiries.",
    image: responsiveSupportImage,
  },
  {
    icon: Package,
    title: "Reliable Availability",
    description: "Large inventory and efficient logistics ensure products are always in stock.",
    image: reliableAvailabilityImage,
  },
]

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] py-18 lg:py-24">
      <div
        className="pointer-events-none absolute left-0 top-14 h-80 w-80 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 2.5px, transparent 2.5px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute -right-16 top-12 h-80 w-[420px] opacity-[0.08]">
        <div className="h-full w-full border-t-[3px] border-r-[3px] border-slate-900/50 [clip-path:polygon(22%_0,100%_0,100%_72%,84%_72%,84%_16%,22%_16%)]" />
      </div>
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rotate-45 border-y-[28px] border-orange-100/70" />

      <div className="section-shell relative">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-5">
            <span className="h-px w-12 bg-primary" />
            <span className="text-sm font-extrabold uppercase tracking-[0.28em] text-primary">Why Choose Us</span>
            <span className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0b2038] text-balance sm:text-5xl lg:text-6xl">
            Your trusted PPE partner
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" />
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600 text-pretty">
            TRACMAC Marketing combines product quality, industry expertise, and exceptional service to deliver safety
            solutions that protect your workforce.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative min-h-[250px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/8 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-slate-900/12"
            >
              <div className="absolute inset-x-0 top-0 z-20 h-1 bg-primary" />
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover object-right transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.97)_34%,rgba(255,255,255,0.82)_58%,rgba(255,255,255,0.28)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(249,115,22,0.08),transparent_28%)]" />

              <div className="relative z-10 flex min-h-[250px] max-w-[65%] flex-col justify-center p-6 sm:p-7">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-orange-50 text-primary shadow-sm ring-1 ring-orange-100">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-extrabold leading-snug text-[#0b2038]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
