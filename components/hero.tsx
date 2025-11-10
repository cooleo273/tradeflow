export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl mx-4 md:mx-6 mt-6 mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Start Your Digital Earnings Journey
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Trade cryptocurrencies and binary options with real-time data and maximum security.
          </p>
          <button className="btn-primary w-full md:w-fit py-2 px-5 text-sm">Begin Trading</button>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent rounded-full opacity-30 blur-2xl animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-tr from-accent to-transparent rounded-full opacity-20 blur-2xl" />
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="url(#grad1)" strokeWidth="1" opacity="0.5" />
              <circle cx="100" cy="100" r="60" stroke="url(#grad2)" strokeWidth="1" opacity="0.3" />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(16, 185, 129)" />
                  <stop offset="100%" stopColor="rgb(6, 182, 212)" />
                </linearGradient>
                <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(6, 182, 212)" />
                  <stop offset="100%" stopColor="rgb(16, 185, 129)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
