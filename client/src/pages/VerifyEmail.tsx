import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmailRequest } from "../api/auth.api";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) return;
    verifyEmailRequest(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="auth-bg-layer">
        <div className="auth-bg-mesh"></div>
        <div className="auth-bg-noise"></div>
      </div>
      <div className="auth-layout animate-fade-in">
        <main id="main-content" className="w-full">
          <div className="auth-card animate-slide-up">
            <div className="auth-header">
              <h1 className="auth-title gradient-text">
                {status === "loading" && "Verifying..."}
                {status === "success" && "Email verified"}
                {status === "error" && "Verification failed"}
              </h1>
              <p className="auth-subtitle">
                {status === "loading" && "Please wait while we verify your email"}
                {status === "success" && "Your email has been successfully verified"}
                {status === "error" && "This link is invalid or has expired"}
              </p>
            </div>

            <div className="auth-body">
              {status === "loading" && (
                <div className="flex justify-center">
                  <span className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px" }} aria-hidden="true"></span>
                </div>
              )}

              {status === "success" && (
                <div className="alert alert-success" role="status">
                  <svg className="alert-icon" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Your email has been verified. You can now sign in to your account.</p>
                </div>
              )}

              {status === "error" && (
                <div className="alert alert-error" role="alert">
                  <svg className="alert-icon" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>This verification link is invalid or has expired. Please request a new one.</p>
                </div>
              )}

              <div className="auth-footer">
                {status === "success" && (
                  <p>
                    <Link to="/login" className="btn btn-glass btn-full">Sign in</Link>
                  </p>
                )}
                {status === "error" && (
                  <p>
                    <Link to="/register" className="btn btn-glass btn-full">Register again</Link>
                  </p>
                )}
                <p className="mt-4">
                  <Link to="/login" className="text-sm">Back to sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default VerifyEmail;