import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { NavItem } from "@/types/admin"

interface AdminSidebarProps {
  navItems: NavItem[]
  activeTab: string
  collapsed: boolean
  onSelect: (tab: string) => void
  onExit: () => void
  onToggleCollapse: () => void
  onLogout: () => void
}

export function AdminSidebar({ navItems, activeTab, collapsed, onSelect, onExit, onToggleCollapse, onLogout }: AdminSidebarProps) {
  return (
    <aside
      className={`hidden lg:flex ${collapsed ? "w-20" : "w-64"} border-r border-border bg-card/40 flex-col transition-all duration-200`}
    >
      <div className="px-4 py-6 border-b border-border flex items-center justify-between gap-2">
        <div className={collapsed ? "sr-only" : "block"}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Trade Flow</p>
          <p className="text-lg font-semibold">Admin Console</p>
          <button
            onClick={onExit}
            className="mt-4 w-full rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            Exit Console
          </button>
        </div>
        <button
          onClick={onToggleCollapse}
          className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 px-2 py-6 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`w-full flex items-center ${collapsed ? "justify-center" : ""} gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className={collapsed ? "hidden" : "block"}>{label}</span>
            </button>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
