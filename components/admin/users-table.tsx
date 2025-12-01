import { Button } from "@/components/ui/button"
import { User } from "@/types/admin"

interface UsersTableProps {
  users: User[]
  searchTerm: string
  onSearch: (value: string) => void
  onToggleStatus: (userId: number, nextStatus: boolean) => void
  onToggleForceLoss: (userId: number, nextValue: boolean) => void
  allForceLossEnabled: boolean
  onForceLossAllToggle: (nextValue: boolean) => void
  onEditBalance: (userId: number, currentBalance?: number) => void
  onDeleteUser: (userId: number) => void
}

export function UsersTable({
  users,
  searchTerm,
  onSearch,
  onToggleStatus,
  onToggleForceLoss,
  allForceLossEnabled,
  onForceLossAllToggle,
  onEditBalance,
  onDeleteUser,
}: UsersTableProps) {
  const filtered = users.filter((user) => {
    const term = searchTerm.toLowerCase()
    return (
      user.email.toLowerCase().includes(term) ||
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search users by email or name..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 bg-input border border-border rounded-2xl px-4 py-2"
        />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">Force Loss (All Users)</p>
            <p className="text-xs text-muted-foreground">Override every user toggle</p>
          </div>
          <button
            type="button"
            onClick={() => onForceLossAllToggle(!allForceLossEnabled)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
              allForceLossEnabled ? "bg-red-500" : "bg-secondary"
            }`}
            aria-pressed={allForceLossEnabled}
            aria-label="Toggle force loss for all users"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                allForceLossEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="card-premium">
        <h3 className="text-xl font-bold mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Balance</th>
                <th className="text-left py-3 px-4">Trade Outcome</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === "ADMIN" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {typeof user.balance === "number" ? (
                      <div>
                        <p className="font-semibold">
                          ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.currency || "USDT"}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium">Force Loss</label>
                      <button
                        type="button"
                        onClick={() => onToggleForceLoss(user.id, !user.forceLossEnabled)}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                          user.forceLossEnabled ? "bg-red-500" : "bg-secondary"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            user.forceLossEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={user.isActive ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => onToggleStatus(user.id, !user.isActive)}
                      >
                        {user.isActive ? "Block" : "Unblock"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onEditBalance(user.id, user.balance)}>
                        Edit Balance
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
