export function AdminLoadingScreen() {
  const pulseBlock = "rounded-2xl bg-card/60 border border-border/60 animate-pulse"

  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:flex flex-col border-r border-border/80 bg-card/40 p-6 gap-4">
        <div className={`${pulseBlock} h-12`} />
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className={`${pulseBlock} h-10`} />
        ))}
      </aside>

      <main className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className={`${pulseBlock} h-10 w-48`} />
          <div className={`${pulseBlock} h-10 w-28`} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className={`${pulseBlock} h-24`} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={`${pulseBlock} h-72`} />
          <div className={`${pulseBlock} h-72`} />
        </div>

        <div className={`${pulseBlock} h-96`} />
      </main>
    </div>
  )
}
