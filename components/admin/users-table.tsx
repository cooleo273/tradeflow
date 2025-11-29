import { User } from "@/types/admin"

interface UsersTableProps {
  users: User[]
  searchTerm: string
  onSearch: (value: string) => void
  onToggleStatus: (userId: number, nextStatus: boolean) => void
}

export function UsersTable({ users, searchTerm, onSearch, onToggleStatus }: UsersTableProps) {
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
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search users by email or name..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 bg-input border border-border rounded-2xl px-4 py-2"
        />
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
                  <td className="py-3 px-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleStatus(user.id, !user.isActive)}
                      className={`px-3 py-1 rounded-2xl text-xs font-medium ${
                        user.isActive
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
