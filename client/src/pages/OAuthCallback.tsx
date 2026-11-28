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
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

      <div className="auth-bg-layer" aria-hidden="true">
        <div className="auth-bg-mesh" />
        <div className="auth-bg-noise" />
      </div>

      <div className="auth-layout">
        <main id="main-content" className="w-full">
          <div className="auth-card card animate-scale-in" style={{ animationDelay: "0ms" }}>
            <div className="auth-body text-center py-12">
              <div className="flex justify-center mb-6" style={{ animationDelay: "60ms" }}>
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
              <h1 className="auth-title animate-scale-in" style={{ animationDelay: "100ms" }}>Welcome back</h1>
              <p className="auth-subtitle animate-scale-in" style={{ animationDelay: "140ms" }}>Please wait while we complete the authentication</p>
              <hr className="my-8 border-t border-border opacity-50" />
              <div className="flex justify-center mt-8" style={{ animationDelay: "180ms" }}>
                <span className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px" }} aria-hidden="true"></span>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OAuthCallback;