import Link from "next/link"
import {
  ArrowRight,
  Bolt,
  ClipboardCheck,
  Factory,
  FileText,
  HardHat,
  Headphones,
  ShieldCheck,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuoteLink } from "@/components/quote-link"
import industrialHero from "@/assets/hero/industrial-worksite-hero.png"

const benefits = [
  { icon: Bolt, title: "Fast Quotes", text: "Quick turnaround" },
  { icon: Tag, title: "Multiple Brands", text: "Top quality options" },
  { icon: ShieldCheck, title: "Compliance-Ready", text: "Certifications covered" },
]

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#07111d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-42"
        style={{ backgroundImage: `url(${industrialHero.src})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(249,115,22,0.18),transparent_28%),linear-gradient(90deg,rgba(3,14,27,0.96)_0%,rgba(3,14,27,0.82)_48%,rgba(3,14,27,0.96)_100%)]" />
      <div className="absolute inset-0 opacity-[0.08]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M27 0h2v56h-2zM0 27h56v2H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-[1520px] items-center gap-12 px-4 pb-28 pt-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-32 lg:pt-20">
        <div className="max-w-3xl text-center lg:text-left">
          <div className="mx-auto mb-7 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/90 shadow-sm backdrop-blur lg:mx-0">
            <ShieldCheck className="h-4 w-4 text-primary" />
            PPE Supply for Industrial Teams
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white text-balance sm:text-6xl lg:text-7xl">
            Industrial Safety{" "}
            <span className="text-primary">Equipment</span> Built for Serious Worksites
          </h1>
          <div className="mx-auto mt-7 h-1 w-16 rounded-full bg-primary lg:mx-0" />
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/76 text-pretty sm:text-lg lg:mx-0">
            TRACMAC Marketing delivers premium personal protective equipment and safety solutions to construction,
            mining, and industrial sectors. Protect your workforce with certified safety gear from a supplier who
            understands your industry.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Button size="lg" className="h-12 px-8 shadow-xl shadow-orange-950/35" asChild>
              <Link href="/products">
                View Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/25 bg-white/5 px-8 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <QuoteLink>
                <FileText className="h-4 w-4" />
                Get a Quote
              </QuoteLink>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-lg border border-white/15 bg-white/[0.06] p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <benefit.icon className="h-7 w-7 text-primary" />
                  <div>
                    <p className="font-bold text-white">{benefit.title}</p>
                    <p className="mt-1 text-sm text-white/66">{benefit.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="rounded-xl border border-white/22 bg-white/[0.06] p-7 shadow-2xl shadow-black/35 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-lg border border-white/18 bg-slate-950/24 p-8 text-center">
                <HardHat className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-6 font-bold text-white">Head Protection</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">Helmets, hard hats & accessories</p>
              </div>
              <div className="rounded-lg border border-white/18 bg-slate-950/24 p-8 text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-6 font-bold text-white">Body Protection</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">Workwear, hi-vis, gloves & more</p>
              </div>
            </div>

            <Link
              href="/products"
              className="group mt-5 flex items-center gap-5 rounded-lg bg-primary p-7 text-primary-foreground shadow-xl shadow-orange-950/30 transition hover:bg-primary/90"
            >
              <Factory className="h-12 w-12 shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-extrabold leading-tight">Complete Industrial Safety Solutions</h2>
                <p className="mt-2 text-sm text-white/86">End-to-end PPE supply for every job site.</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/60 transition group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>

            <Link
              href="/#contact"
              className="group mt-5 flex items-center gap-5 rounded-lg border border-white/18 bg-slate-950/24 p-6 transition hover:bg-white/10"
            >
              <Headphones className="h-10 w-10 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-white">Catalog-ready support</h2>
                <p className="mt-1 text-sm text-white/66">Expert help when you need it.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-white transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
          <path
            d="M0 72L80 64C160 56 320 40 480 36C640 32 800 40 960 48C1120 56 1280 64 1360 60L1440 56V72H0Z"
            fill="oklch(0.982 0.006 75)"
          />
        </svg>
      </div>
    </section>
  )
}
