import { NavItem } from "@/types/admin"
import Select from "@/components/ui/select"
import { Button } from "@/components/ui/button"

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
        <Select value={activeTab} onChange={(e) => onSelect(e.target.value)}>
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      <Button onClick={onLogout} variant="destructive" className="w-full">
        Logout
      </Button>
    </div>
  )
}
