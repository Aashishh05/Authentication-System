import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/users")
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-primary-light text-primary",
      moderator: "bg-warning-light text-warning",
      user: "bg-secondary-light text-secondary",
    };
    return styles[role] || "bg-secondary-light text-secondary";
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar" aria-label="Main navigation">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="18" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          </div>
          <span className="font-semibold text-lg">Auth System</span>
        </div>

        <nav className="nav" aria-label="Dashboard">
          <a href="/dashboard" className="nav-item">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </a>
          <a href="/admin" className="nav-item active">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="18" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
            Admin Panel
          </a>
        </nav>
      </aside>

      <main className="dashboard-main" role="main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Panel</h1>
            <p className="text-muted mt-1">Manage users and system settings</p>
          </div>

          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Admin</span>
            </div>
          </div>
        </header>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
          </div>
          <div className="card-body p-0">
            {error && (
              <div className="alert alert-error m-4" role="alert">
                <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <span className="spinner" style={{ width: "32px", height: "32px", borderWidth: "3px" }} aria-hidden="true"></span>
                <span className="sr-only">Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-50" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <p>No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="border-b border-border bg-bg-hover">
                      <th className="text-left p-4 font-medium text-sm text-muted uppercase tracking-wider">Name</th>
                      <th className="text-left p-4 font-medium text-sm text-muted uppercase tracking-wider">Email</th>
                      <th className="text-left p-4 font-medium text-sm text-muted uppercase tracking-wider">Role</th>
                      <th className="text-left p-4 font-medium text-sm text-muted uppercase tracking-wider">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                        <td className="p-4">
                          <div className="font-medium">{u.name}</div>
                          <div className="text-sm text-muted">#{u.id.slice(0, 8)}</div>
                        </td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-sm ${u.isVerified ? "text-success" : "text-warning"}`}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              {u.isVerified ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8.5-3a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM10 8.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V9.25A.75.75 0 0110 8.5z" clipRule="evenodd" />
                              )}
                            </svg>
                            {u.isVerified ? "Verified" : "Not verified"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;