import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Eye, EyeOff, Moon, Sun, Network } from "lucide-react";

type ThemeKey = "lunar-dark" | "lunar-light";

const THEMES = {
  "lunar-dark": {
    key: "lunar-dark" as ThemeKey, isDark: true,
    bg: "#05070D",
    surface: "rgba(255,255,255,0.07)",
    primary: "#FFFFFF",
    accent1: "#58ECFF",
    accent2: "#A0D4F8",
    text: "#FFFFFF",
    textMuted: "rgba(200,212,236,0.65)",
    textFaint: "rgba(200,212,236,0.25)",
    border: "rgba(255,255,255,0.10)",
    inputBg: "rgba(255,255,255,0.06)",
    inputBorder: "rgba(255,255,255,0.12)",
    inputBorderFocus: "rgba(88,236,255,0.55)",
    buttonBg: "#FFFFFF",
    buttonText: "#05070D",
    dividerColor: "rgba(255,255,255,0.10)",
    glow1: "rgba(140,158,205,0.45)",
    glow2: "rgba(55,175,235,0.22)",
    glow3: "rgba(190,210,240,0.30)",
  },
  "lunar-light": {
    key: "lunar-light" as ThemeKey, isDark: false,
    bg: "#E8EBF2",
    surface: "rgba(255,255,255,0.60)",
    primary: "#1A1C24",
    accent1: "#1E4FAA",
    accent2: "#1060C8",
    text: "#1A1C24",
    textMuted: "rgba(28,32,50,0.82)",
    textFaint: "rgba(28,32,50,0.54)",
    border: "rgba(255,255,255,0.88)",
    inputBg: "rgba(255,255,255,0.72)",
    inputBorder: "rgba(200,210,230,0.80)",
    inputBorderFocus: "rgba(30,79,170,0.55)",
    buttonBg: "#1A1C24",
    buttonText: "#FFFFFF",
    dividerColor: "rgba(28,32,50,0.12)",
    glow1: "rgba(130,148,192,0.55)",
    glow2: "rgba(80,110,170,0.42)",
    glow3: "rgba(170,188,225,0.38)",
  },
};

export default function RegisterPage() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("lunar-dark");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const t = THEMES[themeKey];

  const inputStyle = (field: string) => ({
    width: "100%", padding: "13px 16px",
    background: t.inputBg,
    border: `1px solid ${focusedField === field ? t.inputBorderFocus : t.inputBorder}`,
    borderRadius: 12,
    fontSize: 14.5, color: t.text,
    outline: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focusedField === field
      ? t.isDark
        ? "0 0 0 3px rgba(88,236,255,0.12)"
        : "0 0 0 3px rgba(30,79,170,0.10)"
      : "none",
    boxSizing: "border-box" as const,
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: t.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      transition: "background-color 0.3s ease",
    }}>

      {/* Background orbs */}
      <div style={{
        position: "absolute", bottom: "-12%", left: "8%",
        width: "52vw", height: "52vw", borderRadius: "50%",
        background: `radial-gradient(circle, ${t.glow1} 0%, transparent 65%)`,
        filter: "blur(72px)", pointerEvents: "none",
        animation: "orb-breathe 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "-8%", right: "6%",
        width: "44vw", height: "44vw", borderRadius: "50%",
        background: `radial-gradient(circle, ${t.glow2} 0%, transparent 65%)`,
        filter: "blur(80px)", pointerEvents: "none",
        animation: "orb-breathe 10s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute", top: "35%", left: "20%",
        width: "30vw", height: "30vw", borderRadius: "50%",
        background: `radial-gradient(circle, ${t.glow3} 0%, transparent 65%)`,
        filter: "blur(60px)", pointerEvents: "none",
        animation: "orb-breathe 12s ease-in-out infinite",
      }} />

      {/* Theme toggle */}
      <button
        onClick={() => setThemeKey(k => k === "lunar-dark" ? "lunar-light" : "lunar-dark")}
        style={{
          position: "fixed", top: 20, right: 20,
          width: 42, height: 42, borderRadius: 12,
          background: t.surface,
          border: `1px solid ${t.border}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: t.textMuted,
          transition: "all 0.2s ease",
          zIndex: 10,
        }}
      >
        {t.isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 440,
          backdropFilter: "blur(48px) saturate(200%)",
          WebkitBackdropFilter: "blur(48px) saturate(200%)",
          background: t.isDark
            ? "linear-gradient(155deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)"
            : "linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(240,245,255,0.85) 100%)",
          border: `1px solid ${t.isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.92)"}`,
          borderRadius: 28,
          padding: "44px 40px 40px",
          boxShadow: t.isDark
            ? "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 24px 80px rgba(80,95,130,0.12), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.98)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top rim light */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: t.isDark
            ? "linear-gradient(90deg, transparent, rgba(88,236,255,0.4), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.98), transparent)",
        }} />

        {/* Logo */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: t.text,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Network size={15} color={t.isDark ? "#09090B" : "#ffffff"} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: t.text }}>
              Navigator
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em",
          color: t.text, margin: "0 0 28px",
          textAlign: "center", lineHeight: 1.2,
        }}>Create account</h1>

        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: "block", fontSize: 13.5, fontWeight: 600,
            color: t.textMuted, marginBottom: 7,
          }}>Name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle("name")}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: "block", fontSize: 13.5, fontWeight: 600,
            color: t.textMuted, marginBottom: 7,
          }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle("email")}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            display: "block", fontSize: 13.5, fontWeight: 600,
            color: t.textMuted, marginBottom: 7,
          }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={{ ...inputStyle("password"), padding: "13px 46px 13px 16px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: t.textFaint, padding: 4, display: "flex",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Password strength hint */}
          {password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 8, display: "flex", gap: 4 }}
            >
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 4,
                  background: password.length >= i * 2
                    ? i <= 1 ? "#EF4444" : i <= 2 ? "#F59E0B" : i <= 3 ? "#3B82F6" : "#10B981"
                    : t.inputBorder,
                  transition: "background 0.2s ease",
                }} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Create account button */}
        <button style={{
          width: "100%", padding: "14px 20px",
          background: t.buttonBg,
          color: t.buttonText,
          border: "none", borderRadius: 14,
          fontSize: 15, fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: "-0.01em",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          boxShadow: t.isDark
            ? "0 4px 24px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(26,28,36,0.20)",
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = t.isDark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 28px rgba(26,28,36,0.28)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = t.isDark
              ? "0 4px 24px rgba(0,0,0,0.3)"
              : "0 4px 20px rgba(26,28,36,0.20)";
          }}
        >
          Create account
        </button>

        {/* Sign in link */}
        <p style={{
          textAlign: "center", marginTop: 22, marginBottom: 0,
          fontSize: 14, color: t.textFaint,
        }}>
          Already have an account?{" "}
          <Link to="/login" style={{
            color: t.accent1,
            fontWeight: 600, textDecoration: "none",
          }}>Sign in</Link>
        </p>
      </motion.div>

      <style>{`
        @keyframes orb-breathe {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.75; transform: translateX(-50%) scale(1.10); }
        }
        input::placeholder { color: ${t.textFaint}; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
