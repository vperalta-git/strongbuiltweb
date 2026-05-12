import { CheckCircle2 } from "lucide-react"

const highlights = [
  "Certified safety equipment meeting international standards",
  "Experienced team with deep industry knowledge",
  "Dedicated account management for business clients",
  "Fast delivery and reliable supply chain",
]

export function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image/Visual Area */}
          <div className="relative">
            <div className="aspect-[4/3] bg-foreground rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold text-primary">15+</span>
                  </div>
                  <p className="text-background/80 text-lg">Years of Industry Experience</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 h-24 w-24 border-2 border-primary/30 rounded-lg" />
              <div className="absolute bottom-4 right-4 h-32 w-32 border-2 border-primary/20 rounded-full" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-lg hidden sm:block">
              <div className="text-2xl font-bold">1,200+</div>
              <div className="text-sm opacity-90">Satisfied Clients</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About TRACMAC</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Protecting Workforces Across Industries
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              TRACMAC Marketing has been a leading supplier of personal protective equipment since 2010. We specialize in providing comprehensive safety solutions to the construction, mining, manufacturing, and industrial sectors.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our mission is to ensure every worker returns home safely. We partner with top manufacturers worldwide to bring you certified, quality PPE that meets the demanding requirements of your industry.
            </p>

            {/* Highlights */}
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
