import { Award, Handshake, Cog, DollarSign, Headphones, Package } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Quality PPE Products",
    description: "All our products meet international safety standards and undergo rigorous quality control.",
  },
  {
    icon: Handshake,
    title: "Trusted Supply Partner",
    description: "Over 15 years of reliable service to construction, mining, and industrial clients.",
  },
  {
    icon: Cog,
    title: "Industry-Ready Solutions",
    description: "PPE packages tailored to specific industry requirements and compliance needs.",
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description: "Volume discounts and flexible pricing structures for businesses of all sizes.",
  },
  {
    icon: Headphones,
    title: "Responsive Support",
    description: "Dedicated account managers and fast response times for all inquiries.",
  },
  {
    icon: Package,
    title: "Reliable Availability",
    description: "Large inventory and efficient logistics ensure products are always in stock.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Your Trusted PPE Partner
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            TRACMAC Marketing combines product quality, industry expertise, and exceptional service to deliver safety solutions that protect your workforce.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-5">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
