import { NavItem } from "@/types/admin"

interface MobileNavProps {
  navItems: NavItem[]
  activeTab: string
  onSelect: (tab: string) => void
  onLogout: () => void
}

export function MobileNav({ navItems, activeTab, onSelect, onLogout }: MobileNavProps) {
  return (
    <div className="lg:hidden border-b border-border bg-card/60 backdrop-blur px-4 py-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Trade Flow</p>
          <p className="text-lg font-semibold">Admin Console</p>
        </div>
        <select
          value={activeTab}
          onChange={(e) => onSelect(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
        >
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onLogout}
        className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-destructive/10 hover:text-destructive"
      >
        Logout
      </button>
    </div>
  )
}
