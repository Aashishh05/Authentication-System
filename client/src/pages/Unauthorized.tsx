import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="auth-layout animate-fade-in">
      <div className="auth-card animate-slide-up">
        <div className="auth-body text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-error-light flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <h1 className="auth-title mb-2">403 - Access Denied</h1>
          <p className="auth-subtitle mb-8">You don't have permission to access this page.</p>
          <Link to="/dashboard" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Go back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;