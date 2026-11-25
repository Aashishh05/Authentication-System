import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
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
    <div className="auth-layout animate-fade-in">
      <div className="auth-card animate-slide-up">
        <div className="auth-header">
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Get started with your free account</p>
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
            <div className="form-group mb-4">
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group mb-6">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                className="form-input"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={8}
              />
              <span className="form-hint">Must be at least 8 characters</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;