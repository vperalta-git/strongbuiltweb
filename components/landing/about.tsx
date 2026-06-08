import Image from "next/image"
import { CheckCircle2, Shield, Users } from "lucide-react"
import aboutImage from "@/assets/homedesign/about-tracmac-workforce-image.png"

const highlights = [
  "Certified safety equipment meeting international standards",
  "Experienced team with deep industry knowledge",
  "Dedicated account management for business clients",
  "Fast delivery and reliable supply chain",
]

const statCards = [
  {
    icon: Shield,
    value: "15+",
    label: "Years of Industry Experience",
    className: "bg-[#0b2038]/95 text-white shadow-2xl shadow-slate-900/30",
    valueClassName: "text-primary",
  },
  {
    icon: Users,
    value: "1,200+",
    label: "Satisfied Clients",
    className: "bg-primary text-white shadow-2xl shadow-orange-950/30",
    valueClassName: "text-white",
  },
]

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#fbfaf7] py-18 lg:py-24">
      <div
        className="pointer-events-none absolute left-0 top-0 h-72 w-72 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 2.5px, transparent 2.5px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="pointer-events-none absolute -right-12 top-20 h-64 w-64 rotate-30 border border-orange-100/70 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-72 w-72 rounded-[48px] border border-orange-100/80" />

      <div className="section-shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/12">
              <div className="relative aspect-[4/4.1] overflow-hidden rounded-lg sm:aspect-[4/3.7] lg:aspect-[4/4.1]">
                <Image
                  src={aboutImage}
                  alt="TRACMAC workforce wearing PPE in an industrial environment"
                  fill
                  priority={false}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b2038]/18 via-transparent to-primary/16" />
              </div>
            </div>

            <div className="absolute left-5 top-8 w-44 rounded-xl border border-white/15 p-5 backdrop-blur-md sm:left-10 sm:top-12 sm:w-56">
              <div className={`absolute inset-0 rounded-xl ${statCards[0].className}`} />
              <div className="relative">
                <Shield className="h-10 w-10 text-primary" />
                <div className="mt-8 border-t border-white/12 pt-5">
                  <p className={`text-4xl font-extrabold sm:text-5xl ${statCards[0].valueClassName}`}>
                    {statCards[0].value}
                  </p>
                  <p className="mt-2 text-base font-semibold leading-6 text-white">{statCards[0].label}</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-4 w-48 rounded-xl p-5 sm:-right-6 sm:bottom-10 sm:w-60">
              <div className={`absolute inset-0 rounded-xl ${statCards[1].className}`} />
              <div className="relative">
                <Users className="h-10 w-10 text-white" />
                <p className={`mt-5 text-4xl font-extrabold sm:text-5xl ${statCards[1].valueClassName}`}>
                  {statCards[1].value}
                </p>
                <p className="mt-2 text-base font-semibold text-white">{statCards[1].label}</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-sm font-extrabold uppercase tracking-[0.24em] text-primary">About TRACMAC</span>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#0b2038] text-balance sm:text-5xl lg:text-6xl">
              Protecting workforces across industries
            </h2>
            <div className="mt-6 h-0.5 w-16 rounded-full bg-primary" />
            <div className="mt-7 space-y-6 text-lg leading-8 text-slate-600">
              <p>
                TRACMAC Marketing has been a leading supplier of personal protective equipment since 2010. We specialize
                in providing comprehensive safety solutions to the construction, mining, manufacturing, and industrial
                sectors.
              </p>
              <p>
                Our mission is to ensure every worker returns home safely. We partner with top manufacturers worldwide to
                bring you certified, quality PPE that meets the demanding requirements of your industry.
              </p>
            </div>

            <ul className="mt-9 grid gap-4">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-lg shadow-slate-900/6"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-primary ring-1 ring-orange-100">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <span className="text-base leading-7 text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
