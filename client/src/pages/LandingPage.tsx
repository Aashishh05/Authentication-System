import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ============================================================
   LANDING PAGE — 3D / Animatable
   MERN Authentication System
   ============================================================ */

// --- Three.js-like 3D background using pure CSS 3D transforms ---
// No external deps; runs at 60fps on any device

function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener?.("change", handler);
    return () => mediaQuery.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLElement[] = [];
    const particleCount = 60;

    // Create floating geometric particles
    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement("div");
      el.className = "particle";
      const size = Math.random() * 4 + 2;
      const isSquare = Math.random() > 0.5;

      Object.assign(el.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: isSquare ? "2px" : "50%",
        background: `linear-gradient(135deg, rgba(59,130,246,${0.15 + Math.random() * 0.2}), rgba(168,85,247,${0.1 + Math.random() * 0.15}))`,
        opacity: "0",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        pointerEvents: "none",
        boxShadow: `0 0 ${size * 2}px rgba(59,130,246,0.3)`,
      });

      container.appendChild(el);
      particles.push(el);
    }

    let animationId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = (now - startTime) * 0.001;
      const centerX = container.offsetWidth / 2;
      const centerY = container.offsetHeight / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.9;

      particles.forEach((el, i) => {
        const delay = i * 0.1;
        const phase = t + delay;
        const radius = maxRadius * (0.15 + 0.85 * (0.5 + 0.5 * Math.sin(phase * 0.3 + i)));
        const angle = phase * 0.5 + i * 2.3;
        const z = 200 * Math.sin(phase * 0.4 + i);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const scale = 0.5 + 0.5 * (1 + Math.sin(phase * 0.7 + i)) / 2;
        const opacity = 0.3 + 0.5 * (1 + Math.sin(phase * 0.5 + i)) / 2;

        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateZ(${phase * 20 + i * 30}deg)`;
        el.style.opacity = String(opacity);
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [reducedMotion]);

  return <div ref={containerRef} className="bg-3d-container" aria-hidden="true" />;
}

// --- Floating Orb (CSS 3D) ---
function FloatingOrb({ index, delay = 0 }: { index: number; delay?: number }) {
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const style: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(60px)",
    opacity: 0.15,
    animation: reducedMotion
      ? "none"
      : `orb-float-${index} 20s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    pointerEvents: "none",
  };

  const sizes = ["400px", "300px", "250px", "200px"];
  const colors = [
    "rgba(59, 130, 246, 0.4)",
    "rgba(168, 85, 247, 0.35)",
    "rgba(236, 72, 153, 0.3)",
    "rgba(16, 185, 129, 0.25)",
  ];
  const positions = [
    { top: "-10%", right: "-10%" },
    { bottom: "10%", left: "-5%" },
    { top: "40%", right: "5%" },
    { bottom: "30%", right: "15%" },
  ];

  return (
    <div
      style={{
        ...style,
        width: sizes[index % sizes.length],
        height: sizes[index % sizes.length],
        background: colors[index % colors.length],
        ...positions[index % positions.length],
      }}
      aria-hidden="true"
    />
  );
}

// --- Feature Card with 3D hover ---
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function FeatureCard({ title, description, icon, delay }: FeatureCardProps) {
  const [hovered, setHovered] = useState(false);
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const cardStyle: React.CSSProperties = {
    transition: reducedMotion
      ? "transform 200ms ease, box-shadow 200ms ease"
      : "transform 400ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1)",
    transform: hovered
      ? "translateY(-8px) rotateX(2deg) rotateY(-2deg)"
      : "translateY(0) rotateX(0) rotateY(0)",
    transformStyle: "preserve-3d",
    perspective: "1000px",
  };

  return (
    <article
      className="glass-card"
      style={{ ...cardStyle, animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
    >
      <div className="icon-wrapper" style={{ transform: hovered ? "scale(1.1) rotateZ(6deg)" : "scale(1)" }}>
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </article>
  );
}

// --- Stats Counter with animated numbers ---
function StatCounter({ value, label, delay }: { value: number; label: string; delay: number }) {
  const [count, setCount] = useState(0);
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return;
    }
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const id = setTimeout(() => requestAnimationFrame(animate), delay);
    return () => clearTimeout(id);
  }, [value, delay, reducedMotion]);

  return (
    <div className="stat-card">
      <div className="stat-value" data-value={value}>{count.toLocaleString()}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// --- Main Landing Page ---
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      title: "JWT + Refresh Rotation",
      description: "Short-lived access tokens (15min) with secure refresh token rotation. Tokens hashed with SHA-256 in database, never exposed to client.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 10h12M6 14h8" />
        </svg>
      ),
      delay: 0,
    },
    {
      title: "Google OAuth 2.0",
      description: "One-click sign-in with Google. PKCE flow, secure state parameter, automatic account linking for existing emails.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      delay: 100,
    },
    {
      title: "Role-Based Access Control",
      description: "Three roles (user, moderator, admin) with route-level protection. Role changes take effect on next token refresh (≤15 min).",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      delay: 200,
    },
    {
      title: "Email Verification & Reset",
      description: "Secure email verification flow, password reset with time-limited tokens, and development email preview (no SMTP needed locally).",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      delay: 300,
    },
    {
      title: "TypeScript Strict Mode",
      description: "Full TypeScript strict mode across client and server. No `any` types. Shared types between frontend and backend for end-to-end type safety.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4,7 4,4 20,4 20,7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
      delay: 400,
    },
    {
      title: "Security First",
      description: "HttpOnly cookies, CSRF protection, rate limiting, input validation with Zod, generic error messages (no email enumeration), security headers via Helmet.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      delay: 500,
    },
  ];

  const stats = [
    { value: 15, label: "min access token", delay: 0 },
    { value: 7, label: "days refresh token", delay: 200 },
    { value: 3, label: "user roles", delay: 400 },
    { value: 256, label: "bit SHA hashing", delay: 600 },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Floating gradient orbs */}
      <div className="floating-orbs" aria-hidden="true">
        <FloatingOrb index={0} delay={0} />
        <FloatingOrb index={1} delay={5} />
        <FloatingOrb index={2} delay={10} />
        <FloatingOrb index={3} delay={15} />
      </div>

      {/* 3D Particle Background */}
      <Background3D />

      {/* Navigation */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-brand" aria-label="MERN Auth Home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span>MERN Auth</span>
        </Link>
        <div className="nav-links">
          <Link to="#features" className="nav-link">Features</Link>
          <Link to="#stats" className="nav-link">Stats</Link>
          <Link to="#cta" className="nav-link">Get Started</Link>
        </div>
        <div className="nav-cta">
          <Link to="/login" className="btn btn-secondary-3d">Sign In</Link>
          <Link to="/register" className="btn btn-primary-3d">Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">Production Ready • TypeScript • Secure</div>
          <h1 className="hero-title">
            Authentication that <span className="gradient">just works</span>
          </h1>
          <p className="hero-description">
            JWT with refresh token rotation, Google OAuth, role-based access control,
            and email verification — all built with TypeScript strict mode and security-first defaults.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary-3d">
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-secondary-3d">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="stats-bar" id="stats" aria-labelledby="stats-title">
        <h2 id="stats-title" className="sr-only">Platform Statistics</h2>
        <div className="stats-grid">
          {stats.map((stat, _i) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features" aria-labelledby="features-title">
        <div className="features-header">
          <span className="section-tag">Core Features</span>
          <h2 id="features-title" className="section-title">Everything you need for modern auth</h2>
          <p className="section-description">
            Built-in security best practices so you can focus on your product, not authentication edge cases.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, _i) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta" aria-labelledby="cta-title">
        <div className="cta-card">
          <h2 id="cta-title" className="cta-title">Ready to secure your app?</h2>
          <p className="cta-description">
            Join developers building with MERN Auth. No credit card required to start.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary-3d">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary-3d">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-brand">MERN Auth</div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="#features" className="footer-link">Features</Link>
          </nav>
          <p className="footer-copyright">
            Built with React, TypeScript, Node.js, Express & MongoDB
          </p>
        </div>
      </footer>

      <main id="main-content" style={{ position: "relative" }} />
    </>
  );
}