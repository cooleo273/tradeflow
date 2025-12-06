"use client"

import { useEffect, useMemo, useState } from "react"

type Slide = {
  id: string
  label: string
  title: string
  description: string
  cta: string
  stats: { label: string; value: string }[]
  accentBorder: string
  glow: string
}

export default function Hero() {
  const slides = useMemo<Slide[]>(
    () => [
      {
        id: "journey",
        label: "Launch Mode",
        title: "Start Your Digital Earnings Journey",
        description: "Create your first strategy in minutes, sync wallets, and see projected earnings populate in real-time charts.",
        cta: "Begin Trading",
        stats: [
          { label: "Live Signals", value: "120+" },
          { label: "Avg. Fill", value: "0.8s" },
        ],
        accentBorder: "from-emerald-400/50 via-emerald-500/20 to-transparent",
        glow: "bg-emerald-400/10",
      },
      {
        id: "automation",
        label: "Automation",
        title: "Scale With Smart Autopilot",
        description: "Deploy preset automations that rebalance, ladder entries, and exit with discipline while you sleep.",
        cta: "Enable Autopilot",
        stats: [
          { label: "Bots Running", value: "48" },
          { label: "Slippage", value: "<0.02%" },
        ],
        accentBorder: "from-cyan-400/50 via-blue-500/20 to-transparent",
        glow: "bg-cyan-400/10",
      },
      {
        id: "insights",
        label: "Insights",
        title: "Navigate Markets With Clarity",
        description: "Pull on-chain intel, macro alerts, and whale flow into a single actionable dashboard for every asset.",
        cta: "View Insights",
        stats: [
          { label: "Coverage", value: "34 chains" },
          { label: "Alerts Daily", value: "200+" },
        ],
        accentBorder: "from-rose-400/50 via-fuchsia-500/20 to-transparent",
        glow: "bg-rose-400/10",
      },
    ],
    []
  )

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative mx-4 md:mx-6 mt-6 mb-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.15),_transparent_50%)]" />

        <div className="relative h-[360px] md:h-[420px]">
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              aria-hidden={index !== activeIndex}
              className="absolute inset-0 flex flex-col gap-5 px-6 md:px-10 py-8 rounded-3xl text-white transition-all duration-700 ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                transform: `translateX(${(index - activeIndex) * 100}%)`,
                opacity: index === activeIndex ? 1 : 0.4,
              }}
            >
              <div className={`absolute inset-0 rounded-3xl opacity-60 blur-xl bg-gradient-to-br ${slide.accentBorder}`} />
              <div className={`absolute -top-20 right-8 w-48 h-48 ${slide.glow} blur-3xl`} />

              <div className="relative flex-1 flex flex-col justify-center gap-4">
                <span className="text-xs uppercase tracking-[0.4em] text-white/70">{slide.label}</span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">{slide.title}</h1>
                <p className="text-sm md:text-base text-white/80 max-w-2xl">{slide.description}</p>

                <div className="flex flex-wrap gap-4 pt-4">
                  {slide.stats.map(stat => (
                    <div
                      key={stat.label}
                      className="min-w-[140px] rounded-2xl border border-white/15 bg-white/5 px-5 py-4"
                    >
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex flex-wrap gap-3">
                <button className="btn-primary px-6 py-3 rounded-2xl text-base font-semibold">{slide.cta}</button>
                <button className="px-6 py-3 rounded-2xl border border-white/20 text-sm text-white/80 hover:border-white/50 transition">
                  Learn more
                </button>
              </div>
            </article>
          ))}

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-14 bg-white" : "w-6 bg-white/30"
                }`}
                aria-label={`Show ${slide.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
