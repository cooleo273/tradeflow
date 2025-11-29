import { ShieldCheck, Zap, Users } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl mx-4 md:mx-6 mt-6 mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" />
          {/* Circles removed per design request */}

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 items-center">
        <div className="space-y-4 relative text-center lg:text-left mx-auto lg:mx-0 max-w-xl">
          {/* All decorative circles removed; keeping text clean */}
          <div className="pointer-events-none absolute -right-16 top-2/4 -translate-y-1/2 w-44 h-44 rounded-full bg-primary/12 blur-3xl hidden lg:block" />
          <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent relative z-20">
            Start Your Digital Earnings Journey
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative z-20">
            Trade cryptocurrencies with real-time data and maximum security.
          </p>
          <button className="btn-primary w-full md:w-fit py-3 px-6 text-sm md:text-base rounded-2xl shadow-xl">
            Begin Trading
          </button>

          {/* Feature snippets - good for small screens */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-accent" /> <span>Fast</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-foreground" /> <span>Low Fees</span>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  )
}
