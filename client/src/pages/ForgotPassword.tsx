import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { forgotPasswordRequest } from "../api/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await forgotPasswordRequest(email);
      setMessage(data.message);
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.message ?? "Failed to send reset link" : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="auth-title gradient-text">Forgot password?</h1>
              <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>
            </div>

            <div className="auth-body">
              {error && (
                <div className="alert alert-error" role="alert">
                  <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}

              {message && (
                <div className="alert alert-success" role="status">
                  <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-6">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    className="glass-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-glass btn-full btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  <Link to="/login" className="font-medium">Back to sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ForgotPassword;