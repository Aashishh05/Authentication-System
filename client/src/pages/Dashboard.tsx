import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout, hasRole } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar glass-bg-strong" aria-label="Main navigation">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="font-semibold text-lg">Auth System</span>
        </div>

        <nav className="nav" aria-label="Dashboard">
          <a href="/dashboard" className="nav-item nav-item-hover nav-item-active active">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </a>
          {hasRole("admin") && (
            <a href="/admin" className="nav-item nav-item-hover">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="6" x2="12" y2="18" />
                <line x1="6" y1="12" x2="18" y2="12" />
              </svg>
              Admin Panel
            </a>
          )}
          {hasRole("admin", "moderator") && (
            <a href="#" className="nav-item nav-item-hover">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Moderation
            </a>
          )}
        </nav>
      </aside>

      <main className="dashboard-main" role="main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="text-muted mt-1">Welcome back, {user?.name}</p>
          </div>

          <div className="user-menu glass-bg-strong rounded-xl px-4 py-2">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <div className="user-avatar glass-bg" aria-hidden="true">
              {initials}
            </div>
          </div>
        </header>

        <div className="glass-card mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Account Overview</h2>

            <div className="flex flex-col gap-4">
              <div className="glass-bg p-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted">{user?.email}</p>
                </div>
              </div>

              <div className="glass-bg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Role</p>
                  <p className="text-sm text-muted text-capitalize">{user?.role}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user?.role === "admin"
                    ? "bg-primary-light text-primary"
                    : user?.role === "moderator"
                    ? "bg-warning-light text-warning"
                    : "bg-secondary-light text-secondary"
                }`}>
                  {user?.role}
                </span>
              </div>

              <div className="glass-bg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Verified</p>
                  <p className="text-sm text-muted">
                    {user?.isVerified ? "Yes, verified" : "Not verified"}
                  </p>
                </div>
                {!user?.isVerified && (
                  <Link to="/verify-email" className="btn btn-secondary btn-sm">
                    Verify Email
                  </Link>
                )}
              </div>
            </div>
        </div>

        <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard" className="btn btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Settings
              </Link>
              <button
                onClick={logout}
                className="btn btn-ghost"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;