import { NavItem } from "@/types/admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
          <p className="text-xs uppercase text-muted-foreground">CryptoSphere Trade</p>
          <p className="text-lg font-semibold">Admin Console</p>
        </div>
        <Select value={activeTab} onValueChange={(value) => onSelect(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            {navItems.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onLogout} variant="destructive" className="w-full">
        Logout
      </Button>
    </div>
  )
}
