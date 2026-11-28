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
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

      <div className="auth-bg-layer" aria-hidden="true">
        <div className="auth-bg-mesh" />
        <div className="auth-bg-noise" />
      </div>

      <div className="auth-layout">
        <main id="main-content" className="w-full">
          <div className="auth-card card animate-scale-in" style={{ animationDelay: "0ms" }}>
            <div className="auth-header">
              <h1 className="auth-title">
                {status === "loading" && "Verifying your email"}
                {status === "success" && "Email verified"}
                {status === "error" && "Verification failed"}
              </h1>
              <p className="auth-subtitle">
                {status === "loading" && "Please wait while we verify your email address"}
                {status === "success" && "Your email has been successfully verified. You can now sign in to your account."}
                {status === "error" && "This link is invalid or has expired. Please request a new verification link."}
              </p>
            </div>

            <div className="auth-body">
              {status === "loading" && (
                <div className="flex justify-center" style={{ animationDelay: "60ms" }}>
                  <span className="spinner" style={{ width: "40px", height: "40px", borderWidth: "3px" }} aria-hidden="true"></span>
                </div>
              )}

              {status === "success" && (
                <div className="alert alert-success" role="status" style={{ animationDelay: "100ms" }}>
                  <svg className="alert-icon" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Thank you! Your email has been verified successfully.</p>
                </div>
              )}

              {status === "error" && (
                <div className="alert alert-error" role="alert" style={{ animationDelay: "100ms" }}>
                  <svg className="alert-icon" width="24" height="24" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>Invalid or expired verification link. Please request a new one.</p>
                </div>
              )}

              <div className="auth-footer" style={{ animationDelay: "140ms" }}>
                {status === "success" && (
                  <p>
                    <Link to="/login" className="btn btn-primary btn-full">Sign in</Link>
                  </p>
                )}
                {status === "error" && (
                  <p>
                    <Link to="/register" className="btn btn-primary btn-full">Register again</Link>
                  </p>
                )}
                <p className="mt-4">
                  <Link to="/login" className="link link-secondary">Back to sign in</Link>
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