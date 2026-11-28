import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ============================================================
   LANDING PAGE — Technical Precision Design System
   MERN Authentication System
   Persuade Mode: DESIGN_VARIANCE 8, MOTION_INTENSITY 7, VISUAL_DENSITY 4
   ============================================================ */

// --- 3D Particle Background (CSS 3D transforms, no external deps) ---
function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

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
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const el = document.createElement("div");
      el.className = "particle";
      const size = Math.random() * 3 + 1.5;
      const isSquare = Math.random() > 0.5;

      Object.assign(el.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: isSquare ? "1px" : "50%",
        background: `linear-gradient(135deg, rgba(37,99,235,${0.2 + Math.random() * 0.15}), rgba(139,92,246,${0.15 + Math.random() * 0.1}))`,
        opacity: "0",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        pointerEvents: "none",
        boxShadow: `0 0 ${size * 1.5}px rgba(37,99,235,0.25)`,
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
      const maxRadius = Math.min(centerX, centerY) * 0.85;

      particles.forEach((el, i) => {
        const delay = i * 0.08;
        const phase = t + delay;
        const radius = maxRadius * (0.12 + 0.88 * (0.5 + 0.5 * Math.sin(phase * 0.25 + i)));
        const angle = phase * 0.4 + i * 2.1;
        const z = 150 * Math.sin(phase * 0.35 + i);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const scale = 0.6 + 0.4 * (1 + Math.sin(phase * 0.6 + i)) / 2;
        const opacity = 0.25 + 0.45 * (1 + Math.sin(phase * 0.45 + i)) / 2;

        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale}) rotateZ(${phase * 15 + i * 25}deg)`;
        el.style.opacity = String(opacity);
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [reducedMotion]);

  return <div ref={containerRef} className="bg-3d-container" aria-hidden="true" />;
}

// --- Floating Gradient Orbs (CSS animations) ---
function FloatingOrb({ index, delay = 0 }: { index: number; delay?: number }) {
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const style: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.12,
    animation: reducedMotion
      ? "none"
      : `orb-float-${index} 24s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    pointerEvents: "none",
  };

  const sizes = ["420px", "320px", "280px", "220px"];
  const colors = [
    "rgba(37, 99, 235, 0.35)",   // Electric Blue
    "rgba(139, 92, 246, 0.3)",   // Violet accent
    "rgba(20, 184, 166, 0.25)",  // Teal accent
    "rgba(236, 72, 153, 0.2)",   // Rose accent
  ];
  const positions = [
    { top: "-8%", right: "-8%" },
    { bottom: "8%", left: "-4%" },
    { top: "35%", right: "3%" },
    { bottom: "25%", right: "12%" },
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

// --- Feature Card with 3D hover (staggered entrance) ---
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  variant?: "default" | "accent" | "muted";
}

function FeatureCard({ title, description, icon, delay, variant = "default" }: FeatureCardProps) {
  const [hovered, setHovered] = useState(false);
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const cardBaseStyle: React.CSSProperties = {
    transition: reducedMotion
      ? "transform 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out"
      : "transform 300ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1), border-color 300ms cubic-bezier(0.23, 1, 0.32, 1)",
    transform: hovered
      ? "translateY(-6px) rotateX(1.5deg) rotateY(-1.5deg)"
      : "translateY(0) rotateX(0) rotateY(0)",
    transformStyle: "preserve-3d",
    perspective: "1000px",
    opacity: 0,
    animation: reducedMotion
      ? "none"
      : `fade-slide-up 600ms cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms forwards`,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {},
    accent: {
      borderColor: "var(--color-accent-500)",
      boxShadow: "var(--shadow-lg), 0 0 0 1px var(--color-accent-500)",
    },
    muted: {
      background: "var(--color-surface-100)",
    },
  };

  return (
    <article
      className="card feature-card"
      style={{ ...cardBaseStyle, ...variantStyles[variant] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
    >
      <div
        className="icon-wrapper"
        style={{
          transition: reducedMotion
            ? "transform 150ms ease-out"
            : "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
          transform: hovered ? "scale(1.08) rotateZ(4deg)" : "scale(1)",
        }}
      >
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </article>
  );
}

// --- Animated Stat Counter ---
function StatCounter({ value, label, delay }: { value: number; label: string; delay: number }) {
  const [count, setCount] = useState(0);
  const [reducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return;
    }
    const duration = 1400;
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
    <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stat-value" data-value={value}>{count.toLocaleString()}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// --- Hero Visual: Abstract Technical Diagram ---
function HeroVisual({ reducedMotion }: { reducedMotion: boolean }) {
  const nodes = [
    { id: 1, x: 50, y: 50, label: "Client", type: "primary" },
    { id: 2, x: 50, y: 150, label: "Auth\nMiddleware", type: "secondary" },
    { id: 3, x: 150, y: 200, label: "Access\nToken (15m)", type: "accent" },
    { id: 4, x: -50, y: 200, label: "Refresh\nToken (7d)", type: "accent" },
    { id: 5, x: 50, y: 280, label: "MongoDB", type: "muted" },
    { id: 6, x: 150, y: 330, label: "SHA-256\nHashed", type: "success" },
    { id: 7, x: -50, y: 330, label: "Rotation\nDetected", type: "warning" },
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 5, to: 7 },
  ];

  const nodeStyle = (node: typeof nodes[0], index: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: `calc(50% + ${node.x}px)`,
      top: `calc(50% + ${node.y}px)`,
      transform: "translate(-50%, -50%)",
      padding: "10px 14px",
      borderRadius: "var(--radius-md)",
      fontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.2,
      textAlign: "center",
      whiteSpace: "nowrap",
      opacity: 0,
      transition: "opacity 200ms ease-out, transform 200ms ease-out",
      animation: reducedMotion
        ? "none"
        : `scale-in 400ms cubic-bezier(0.23, 1, 0.32, 1) ${200 + index * 80}ms forwards`,
    };

    const typeStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: "var(--color-accent-600)",
        color: "white",
        boxShadow: "var(--shadow-md), 0 0 20px rgba(37,99,235,0.3)",
      },
      secondary: {
        background: "var(--color-surface-100)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      },
      accent: {
        background: "var(--color-accent-100)",
        color: "var(--color-accent-700)",
        border: "1px solid var(--color-accent-300)",
      },
      muted: {
        background: "var(--color-surface-100)",
        color: "var(--color-text-muted)",
        border: "1px solid var(--color-border)",
      },
      success: {
        background: "var(--color-success-100)",
        color: "var(--color-success-700)",
        border: "1px solid var(--color-success-300)",
      },
      warning: {
        background: "var(--color-warning-100)",
        color: "var(--color-warning-700)",
        border: "1px solid var(--color-warning-300)",
      },
    };

    return { ...base, ...typeStyles[node.type] };
  };

  const edgeStyle = (edge: typeof edges[0], index: number): React.CSSProperties => {
    const fromNode = nodes.find(n => n.id === edge.from)!;
    const toNode = nodes.find(n => n.id === edge.to)!;
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const midX = fromNode.x + dx / 2;
    const midY = fromNode.y + dy / 2;

    return {
      position: "absolute",
      left: `calc(50% + ${midX}px)`,
      top: `calc(50% + ${midY}px)`,
      width: `${length}px`,
      height: "2px",
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      transformOrigin: "center center",
      background: "linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600))",
      opacity: 0,
      animation: reducedMotion
        ? "none"
        : `fade-in 400ms ease-out ${300 + index * 60}ms forwards`,
    };
  };

  return (
    <div className="hero-visual" aria-hidden="true">
      {edges.map((edge, i) => (
        <div key={i} style={edgeStyle(edge, i)} />
      ))}
      {nodes.map((node, i) => (
        <div key={node.id} style={nodeStyle(node, i)}>
          {node.label}
        </div>
      ))}
    </div>
  );
}

// --- Trust Indicators ---
function TrustIndicators() {
  const items = [
    { label: "TypeScript Strict", detail: "Zero `any` types" },
    { label: "JWT + Rotation", detail: "15m / 7d tokens" },
    { label: "Google OAuth 2.0", detail: "PKCE flow" },
    { label: "RBAC", detail: "3 roles, route-level" },
    { label: "Rate Limited", detail: "Per-endpoint quotas" },
    { label: "Helmet + CORS", detail: "Security headers" },
  ];

  return (
    <div className="trust-grid" role="list" aria-label="Technical capabilities">
      {items.map((item, i) => (
        <div key={item.label} className="trust-item" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="trust-label">{item.label}</div>
          <div className="trust-detail">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

// --- Main Landing Page ---
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      title: "JWT + Refresh Rotation",
      description: "Short-lived access tokens (15 min) with secure refresh token rotation. Tokens hashed with SHA-256 in database, never exposed to client.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 10h12M6 14h8" />
        </svg>
      ),
      delay: 0,
      variant: "accent" as const,
    },
    {
      title: "Google OAuth 2.0",
      description: "One-click sign-in with Google. PKCE flow, secure state parameter, automatic account linking for existing emails.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      delay: 80,
      variant: "default" as const,
    },
    {
      title: "Role-Based Access Control",
      description: "Three roles (user, moderator, admin) with route-level protection. Role changes take effect on next token refresh (≤15 min).",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      delay: 160,
      variant: "muted" as const,
    },
    {
      title: "Email Verification & Reset",
      description: "Secure email verification flow, password reset with time-limited tokens (15 min), and development email preview (no SMTP needed locally).",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      delay: 240,
      variant: "default" as const,
    },
    {
      title: "TypeScript Strict Mode",
      description: "Full TypeScript strict mode across client and server. No `any` types. Shared types between frontend and backend for end-to-end type safety.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="4,7 4,4 20,4 20,7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
      delay: 320,
      variant: "accent" as const,
    },
    {
      title: "Security First Architecture",
      description: "HttpOnly cookies, CSRF protection, rate limiting, input validation with Zod, generic error messages (no email enumeration), security headers via Helmet.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      delay: 400,
      variant: "muted" as const,
    },
  ];

  const stats = [
    { value: 15, label: "min", delay: 0 },
    { value: 7, label: "days", delay: 120 },
    { value: 3, label: "roles", delay: 240 },
    { value: 256, label: "bit SHA-256", delay: 360 },
  ];

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>

      {/* Floating gradient orbs */}
      <div className="floating-orbs" aria-hidden="true">
        <FloatingOrb index={0} delay={0} />
        <FloatingOrb index={1} delay={6} />
        <FloatingOrb index={2} delay={12} />
        <FloatingOrb index={3} delay={18} />
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
          <Link to="#stats" className="nav-link">Specs</Link>
          <Link to="#cta" className="nav-link">Get Started</Link>
        </div>
        <div className="nav-cta">
          <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">Production Ready · TypeScript · Security First</div>
          <h1 className="hero-title">
            Authentication that <span className="text-accent">just works</span>
          </h1>
          <p className="hero-description">
            JWT access tokens (15 min), refresh tokens (7 days, httpOnly cookie),
            Google OAuth with PKCE, and role-based access control — all built with
            TypeScript strict mode and security-first defaults.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Dashboard
            </Link>
          </div>
          <TrustIndicators />
        </div>
        <div className="hero-visual-wrapper">
          <HeroVisual reducedMotion={reducedMotion} />
        </div>
      </header>

      {/* Stats Bar */}
      <section className="stats-section" id="stats" aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className="sr-only">Token Specifications</h2>
          <div className="stats-grid">
            {stats.map((stat, _i) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Features - Three varied layouts */}
      <section className="features" id="features" aria-labelledby="features-title">
        <div className="container">
          <div className="features-header">
            <span className="section-tag">Core Capabilities</span>
            <h2 id="features-title" className="section-title">Everything you need for modern authentication</h2>
            <p className="section-description">
              Built-in security best practices so you can focus on your product, not authentication edge cases.
            </p>
          </div>

          {/* Layout 1: Three-column card grid */}
          <div className="features-grid layout-grid">
            {features.slice(0, 3).map((feature, _i) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          {/* Layout 2: Alternating visual + content */}
          <div className="features-alternating layout-alternating">
            {features.slice(3).map((feature, i) => (
              <div key={feature.title} className={`feature-row ${i % 2 === 0 ? "reverse" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="feature-card-wrapper">
                  <FeatureCard {...feature} />
                </div>
                <div className="feature-visual" aria-hidden="true">
                  <div className="visual-accent" style={{ "--accent-hue": i === 0 ? "221" : i === 1 ? "262" : "174" } as React.CSSProperties} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-card">
            <h2 id="cta-title" className="cta-title">Ready to secure your application?</h2>
            <p className="cta-description">
              Join developers building with MERN Auth. No credit card required to start.
              JWT access tokens (15 min), refresh tokens (7 days), Google OAuth, role-based access.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container footer-content">
          <div className="footer-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="24" height="24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>MERN Auth</span>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="#features" className="footer-link">Features</Link>
          </nav>
          <p className="footer-copyright">
            Built with React, TypeScript, Node.js, Express & MongoDB
                • JWT + Refresh Rotation • Google OAuth 2.0 • RBAC • Email Verification
          </p>
        </div>
      </footer>

      <main id="main-content" style={{ position: "relative" }} />
    </>
  );
}