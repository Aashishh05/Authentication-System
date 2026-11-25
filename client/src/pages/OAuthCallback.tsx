import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthCallback = () => {
  const { restoreSession, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // The refresh cookie was set by the server before the redirect
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (isLoading) return;
    navigate(isAuthenticated ? "/dashboard" : "/login?error=oauth", { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="auth-layout animate-fade-in">
      <div className="auth-card animate-slide-up">
        <div className="auth-body text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <h1 className="auth-title mb-2">Signing you in</h1>
          <p className="auth-subtitle">Please wait while we complete the authentication</p>
          <div className="flex justify-center mt-8">
            <span className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px" }} aria-hidden="true"></span>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;