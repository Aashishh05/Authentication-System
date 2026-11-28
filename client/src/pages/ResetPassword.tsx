import { useState, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { resetPasswordRequest } from "../api/auth.api";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // If no token in URL, redirect to login
  if (!token) {
    navigate("/login");
    return null;
  }

  const handleChange = (field: string, value: string) => {
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string) => {
    if (!touched[field]) return undefined;
    if (field === "password" && password && password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (field === "confirmPassword" && confirmPassword && password !== confirmPassword) {
      return "Passwords do not match";
    }
    return undefined;
  };

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
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

      <div className="auth-bg-layer" aria-hidden="true">
        <div className="auth-bg-mesh" />
        <div className="auth-bg-noise" />
      </div>

      <div className="auth-layout">
        <main id="main-content" className="w-full">
          <div className="auth-card card animate-scale-in" style={{ animationDelay: "0ms" }}>
            <div className="auth-header">
              <h1 className="auth-title">Set new password</h1>
              <p className="auth-subtitle">Enter your new password below. It must be at least 8 characters.</p>
            </div>

            <div className="auth-body">
              {error && (
                <div className="alert alert-error" role="alert" style={{ animationDelay: "60ms" }}>
                  <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-4" style={{ animationDelay: "60ms" }}>
                  <label htmlFor="password" className="form-label">
                    New password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    className={`form-input ${getFieldError("password") ? "error" : ""} ${touched.password && !getFieldError("password") && password ? "valid" : ""}`}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    required
                    disabled={loading}
                    minLength={8}
                    aria-describedby={getFieldError("password") ? "password-error" : "password-hint"}
                    aria-invalid={!!getFieldError("password")}
                  />
                  {getFieldError("password") ? (
                    <span id="password-error" className="form-error" role="alert">{getFieldError("password")}</span>
                  ) : (
                    <span id="password-hint" className="form-hint">Must be at least 8 characters</span>
                  )}
                </div>

                <div className="form-group mb-6" style={{ animationDelay: "100ms" }}>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    className={`form-input ${getFieldError("confirmPassword") ? "error" : ""} ${touched.confirmPassword && !getFieldError("confirmPassword") && confirmPassword ? "valid" : ""}`}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    required
                    disabled={loading}
                    minLength={8}
                    aria-describedby={getFieldError("confirmPassword") ? "confirmPassword-error" : "confirmPassword-hint"}
                    aria-invalid={!!getFieldError("confirmPassword")}
                  />
                  {getFieldError("confirmPassword") ? (
                    <span id="confirmPassword-error" className="form-error" role="alert">{getFieldError("confirmPassword")}</span>
                  ) : (
                    <span id="confirmPassword-hint" className="form-hint">Must match the password above</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                  disabled={loading}
                  style={{ animationDelay: "140ms" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Updating password...
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>

              <div className="auth-footer" style={{ animationDelay: "180ms" }}>
                <p className="text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="link link-primary">Sign in</Link>
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