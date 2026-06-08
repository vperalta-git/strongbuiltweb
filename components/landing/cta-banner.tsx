import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, FileText, Phone, ShieldCheck, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuoteLink } from "@/components/quote-link"
import ctaWorkforceImage from "@/assets/homedesign/cta-workforce-left-photo.png"

const ctaFeatures = [
  {
    icon: Zap,
    title: "Quick Response",
    text: "Within 24 Hours",
  },
  {
    icon: ShieldCheck,
    title: "Certified PPE",
    text: "Quality You Can Trust",
  },
  {
    icon: Users,
    title: "Tailored Solutions",
    text: "Built Around Your Needs",
  },
]

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#061625] py-16 text-white lg:py-20">
      <div className="absolute inset-y-0 left-0 w-full opacity-55 lg:w-[34%]">
        <Image
          src={ctaWorkforceImage}
          alt="Worker wearing PPE"
          fill
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061625]/82 via-[#061625]/72 to-[#061625]" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_82%,rgba(242,103,0,0.28),transparent_24%),linear-gradient(120deg,#061625_0%,#0f2435_52%,#061625_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 14px)",
        }}
      />
      <div
        className="absolute left-[15%] top-0 hidden h-full w-44 skew-x-[-24deg] border-x border-primary/35 lg:block"
        aria-hidden="true"
      />
      <div className="absolute -right-24 top-1/2 hidden h-80 w-80 -translate-y-1/2 rounded-full border border-primary/45 opacity-55 lg:block">
        <div className="absolute inset-8 rounded-full border border-primary/20" />
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 h-[1px] w-44 origin-left bg-primary/35"
            style={{ transform: `rotate(${index * 36}deg)` }}
          />
        ))}
      </div>
      <div
        className="absolute bottom-8 left-8 hidden h-24 w-56 opacity-40 lg:block"
        style={{
          backgroundImage: "radial-gradient(circle, #f26700 2px, transparent 2px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="section-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Ready to Equip Your Workforce?
          </h2>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-primary" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/76 text-pretty">
            Get in touch with our team today for a customized quote on PPE solutions tailored to your industry and
            requirements.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-orange-950/35" asChild>
              <QuoteLink className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                Request a Quote Today
                <ArrowRight className="h-5 w-5" />
              </QuoteLink>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-white/35 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="tel:+639178913681" className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                Call Us Now
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-0 overflow-hidden rounded-lg border border-white/16 bg-white/[0.07] text-left shadow-2xl shadow-black/15 backdrop-blur-md sm:grid-cols-3">
            {ctaFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex items-center gap-4 p-5 ${index > 0 ? "border-t border-white/12 sm:border-l sm:border-t-0" : ""}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-white">{feature.title}</p>
                  <p className="mt-1 text-sm text-white/68">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 inline-flex items-center gap-3 text-base text-white/76">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Quick response guaranteed within 24 hours
          </p>
        </div>
      </div>
    </section>
  )
}
