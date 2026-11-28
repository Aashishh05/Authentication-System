import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string) => {
    if (!touched[field]) return undefined;
    const value = form[field as keyof typeof form];
    if (field === "name" && value && value.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address";
    }
    if (field === "password" && value && value.length < 8) {
      return "Password must be at least 8 characters";
    }
    return undefined;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      setMessage(await register(form));
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.message ?? "Registration failed" : "Registration failed");
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
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-subtitle">Enter your details to get started with our platform</p>
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

              {message && (
                <div className="alert alert-success" role="status" style={{ animationDelay: "100ms" }}>
                  <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-4" style={{ animationDelay: "60ms" }}>
                  <label htmlFor="name" className="form-label">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    className={`form-input ${getFieldError("name") ? "error" : ""} ${touched.name && !getFieldError("name") && form.name.trim() ? "valid" : ""}`}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    required
                    disabled={loading}
                    aria-describedby={getFieldError("name") ? "name-error" : "name-hint"}
                    aria-invalid={!!getFieldError("name")}
                  />
                  {getFieldError("name") ? (
                    <span id="name-error" className="form-error" role="alert">{getFieldError("name")}</span>
                  ) : (
                    <span id="name-hint" className="form-hint">Your full name as it appears on your ID</span>
                  )}
                </div>

                <div className="form-group mb-4" style={{ animationDelay: "100ms" }}>
                  <label htmlFor="email" className="form-label">
                    Work email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    className={`form-input ${getFieldError("email") ? "error" : ""} ${touched.email && !getFieldError("email") && form.email ? "valid" : ""}`}
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    required
                    disabled={loading}
                    aria-describedby={getFieldError("email") ? "email-error" : "email-hint"}
                    aria-invalid={!!getFieldError("email")}
                  />
                  {getFieldError("email") ? (
                    <span id="email-error" className="form-error" role="alert">{getFieldError("email")}</span>
                  ) : (
                    <span id="email-hint" className="form-hint">We'll never share your email</span>
                  )}
                </div>

                <div className="form-group mb-4" style={{ animationDelay: "140ms" }}>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    className={`form-input ${getFieldError("password") ? "error" : ""} ${touched.password && !getFieldError("password") && form.password ? "valid" : ""}`}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
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

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                  disabled={loading}
                  style={{ animationDelay: "180ms" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <div className="auth-divider auth-divider-lines" style={{ animationDelay: "220ms" }}>
                <span>or sign up with</span>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                className="btn btn-secondary btn-full"
                disabled={loading}
                style={{ animationDelay: "260ms" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="auth-footer" style={{ animationDelay: "300ms" }}>
                <p className="text-sm">
                  Already have an account?{" "}
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

export default Register;