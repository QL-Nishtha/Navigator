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
    surface2: "rgba(255,255,255,0.04)",
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
    surface2: "rgba(255,255,255,0.84)",
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

export default function LoginPage() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("lunar-dark");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const t = THEMES[themeKey];

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
        position: "absolute", top: "-18%", left: "12%",
        width: "55vw", height: "55vw", borderRadius: "50%",
        background: t.isDark
          ? `radial-gradient(circle, ${t.glow1} 0%, transparent 65%)`
          : `radial-gradient(circle, ${t.glow1} 0%, transparent 65%)`,
        filter: "blur(72px)", pointerEvents: "none",
        animation: "orb-breathe 7s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "5%",
        width: "45vw", height: "45vw", borderRadius: "50%",
        background: t.isDark
          ? `radial-gradient(circle, ${t.glow2} 0%, transparent 65%)`
          : `radial-gradient(circle, ${t.glow2} 0%, transparent 65%)`,
        filter: "blur(80px)", pointerEvents: "none",
        animation: "orb-breathe 9s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "22%",
        width: "28vw", height: "28vw", borderRadius: "50%",
        background: t.isDark
          ? `radial-gradient(circle, ${t.glow3} 0%, transparent 65%)`
          : `radial-gradient(circle, ${t.glow3} 0%, transparent 65%)`,
        filter: "blur(60px)", pointerEvents: "none",
        animation: "orb-breathe 11s ease-in-out infinite",
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
        }}>Sign in</h1>

        {/* Google button */}
        <button style={{
          width: "100%", padding: "13px 20px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: t.isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.92)",
          border: `1px solid ${t.isDark ? "rgba(255,255,255,0.14)" : "rgba(200,210,230,0.85)"}`,
          borderRadius: 14,
          cursor: "pointer",
          fontSize: 14.5, fontWeight: 600,
          color: t.text,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: "all 0.18s ease",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: t.isDark
            ? "inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 2px 8px rgba(80,95,130,0.06), inset 0 1px 0 rgba(255,255,255,1)",
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = t.isDark
              ? "rgba(255,255,255,0.11)"
              : "rgba(255,255,255,1)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = t.isDark
              ? "rgba(255,255,255,0.07)"
              : "rgba(255,255,255,0.92)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          margin: "24px 0",
        }}>
          <div style={{ flex: 1, height: 1, background: t.dividerColor }} />
          <span style={{ fontSize: 13, color: t.textFaint, fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: t.dividerColor }} />
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
            style={{
              width: "100%", padding: "13px 16px",
              background: t.inputBg,
              border: `1px solid ${focusedField === "email" ? t.inputBorderFocus : t.inputBorder}`,
              borderRadius: 12,
              fontSize: 14.5, color: t.text,
              outline: "none",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              boxShadow: focusedField === "email"
                ? t.isDark
                  ? `0 0 0 3px rgba(88,236,255,0.12)`
                  : `0 0 0 3px rgba(30,79,170,0.10)`
                : "none",
              boxSizing: "border-box",
            }}
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
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={{
                width: "100%", padding: "13px 46px 13px 16px",
                background: t.inputBg,
                border: `1px solid ${focusedField === "password" ? t.inputBorderFocus : t.inputBorder}`,
                borderRadius: 12,
                fontSize: 14.5, color: t.text,
                outline: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxShadow: focusedField === "password"
                  ? t.isDark
                    ? `0 0 0 3px rgba(88,236,255,0.12)`
                    : `0 0 0 3px rgba(30,79,170,0.10)`
                  : "none",
                boxSizing: "border-box",
              }}
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
        </div>

        {/* Sign in button */}
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
          Sign in
        </button>

        {/* Register link */}
        <p style={{
          textAlign: "center", marginTop: 22, marginBottom: 0,
          fontSize: 14, color: t.textFaint,
        }}>
          No account?{" "}
          <Link to="/register" style={{
            color: t.isDark ? t.accent1 : t.accent1,
            fontWeight: 600, textDecoration: "none",
          }}>Create one</Link>
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
