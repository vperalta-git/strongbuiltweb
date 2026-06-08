import Image, { type StaticImageData } from "next/image"
import { Bolt, Building2, Factory, Pickaxe, Truck, type LucideIcon } from "lucide-react"
import constructionImage from "@/assets/homedesign/industry-construction.png"
import miningImage from "@/assets/homedesign/industry-mining.png"
import manufacturingImage from "@/assets/homedesign/industry-manufacturing.png"
import energyUtilitiesImage from "@/assets/homedesign/industry-energy-utilities.png"
import logisticsTransportImage from "@/assets/homedesign/industry-logistics-transport.png"

type Industry = {
  icon: LucideIcon
  title: string
  description: string
  image: StaticImageData
  accent: "orange" | "navy"
}

const industries: Industry[] = [
  {
    icon: Building2,
    title: "Construction",
    description: "Site-ready PPE for civil, building, and road work crews.",
    image: constructionImage,
    accent: "orange",
  },
  {
    icon: Pickaxe,
    title: "Mining",
    description: "Heavy-duty protection for surface and underground operations.",
    image: miningImage,
    accent: "navy",
  },
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Daily safety gear for production floors and assembly lines.",
    image: manufacturingImage,
    accent: "orange",
  },
  {
    icon: Bolt,
    title: "Energy & Utilities",
    description: "Certified equipment for electrical, field, and service teams.",
    image: energyUtilitiesImage,
    accent: "navy",
  },
  {
    icon: Truck,
    title: "Logistics & Transport",
    description: "Visibility and handling protection for fast-moving operations.",
    image: logisticsTransportImage,
    accent: "orange",
  },
]

export function Industries() {
  return (
    <section id="industries" className="relative overflow-hidden bg-[#fbfaf7] py-16 lg:py-24">
      <div
        className="pointer-events-none absolute right-0 top-8 h-72 w-72 opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 2px, transparent 2px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-8 left-0 h-64 w-64 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 2px, transparent 2px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-5xl text-center lg:mb-16">
          <span className="text-sm font-extrabold uppercase tracking-[0.08em] text-primary">
            Built for Industry. Backed by Trust.
          </span>
          <div className="mx-auto mt-5 h-0.5 w-20 rounded-full bg-primary" />
          <h2 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-[#0b2038] text-balance sm:text-5xl lg:text-6xl">
            Safety Solutions for Every Worksite
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {industries.map((industry) => (
            <article
              key={industry.title}
              className="group relative flex min-h-[430px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/8 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-slate-900/14"
            >
              <div className="absolute inset-x-0 top-0 z-20 h-1 bg-primary transition-all duration-300 group-hover:h-1.5" />
              <div className="flex w-full flex-col">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={industry.image}
                    alt={industry.title}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/82 to-transparent" />
                </div>

                <div className="relative flex flex-1 flex-col p-7 pt-0">
                  <div className="-mt-10 mb-6 flex h-20 w-20 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
                    <industry.icon
                      className={`h-10 w-10 ${industry.accent === "orange" ? "text-primary" : "text-[#123b72]"}`}
                    />
                  </div>
                  <h3 className="text-2xl font-extrabold leading-tight text-[#0b2038]">{industry.title}</h3>
                  <p className="mt-5 text-base leading-8 text-slate-600">{industry.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
