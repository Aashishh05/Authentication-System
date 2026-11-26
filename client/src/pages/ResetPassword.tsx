import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { resetPasswordRequest } from "../api/auth.api";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If no token in URL, redirect to login
  if (!token) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest(token, password);
      navigate("/login");
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.message ?? "Reset failed" : "Reset failed");
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
              <h1 className="auth-title gradient-text">Reset password</h1>
              <p className="auth-subtitle">Enter your new password below</p>
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

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-4">
                  <label htmlFor="password" className="form-label">
                    New password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    className="glass-input"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={8}
                  />
                </div>

                <div className="form-group mb-6">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    className="glass-input"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={8}
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
                      Updating...
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  <a href="/login" className="font-medium">Back to sign in</a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResetPassword;