export function AdminLoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-4 animate-pulse"></div>
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    </div>
  )
}
