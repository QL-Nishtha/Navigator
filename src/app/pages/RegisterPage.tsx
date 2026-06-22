import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Eye, EyeOff, Network, ArrowRight } from "lucide-react";
import { type ThemeKey, AUTH_THEMES } from "../theme/authTheme";
import B2BInfographic from "../components/B2BInfographic";

const STATS = [
  { stat: "22 min",  label: "avg. setup time" },
  { stat: "2,400+", label: "APIs connected" },
  { stat: "98.7%",  label: "success rate" },
];

export default function RegisterPage() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("lunar-dark");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);

  const t = AUTH_THEMES[themeKey];

  const strengthLevel  = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : password.length < 14 ? 3 : 4;
  const strengthColors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];

  // Matches App.tsx THEMES exactly
  const pageBg = t.isDark
    ? "linear-gradient(145deg, #060A1C 0%, #0D1838 40%, #08101E 70%, #050810 100%)"
    : "linear-gradient(145deg, #D8E6FA 0%, #E6EFFF 45%, #D4E2F8 100%)";

  const formBg     = t.isDark ? "rgba(5,7,13,0.88)" : "rgba(255,255,255,0.96)";
  const textMuted  = t.isDark ? "rgba(200,212,236,0.65)" : "rgba(28,32,50,0.82)";
  const textFaint  = t.isDark ? "rgba(200,212,236,0.25)" : "rgba(28,32,50,0.54)";
  const labelClr   = t.isDark ? "rgba(200,212,236,0.55)" : "rgba(28,32,50,0.65)";
  const inputBg    = t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.84)";
  const inputBdr   = t.isDark ? "rgba(255,255,255,0.10)" : "rgba(28,32,50,0.12)";
  const inputFocus = t.isDark ? "rgba(88,236,255,0.50)"  : "rgba(30,79,170,0.45)";
  const divLine    = t.isDark ? "rgba(255,255,255,0.08)" : "rgba(28,32,50,0.08)";
  const accent     = t.accent1;

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: labelClr, marginBottom: 8,
    textTransform: "uppercase", letterSpacing: "0.10em",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "14px 16px",
    background: inputBg,
    border: `1px solid ${focused === field ? inputFocus : inputBdr}`,
    borderRadius: 12, fontSize: 15, color: t.text, outline: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
    boxShadow: focused === field
      ? t.isDark ? "0 0 0 3px rgba(88,236,255,0.10)" : "0 0 0 3px rgba(30,79,170,0.08)"
      : "none",
    boxSizing: "border-box",
  });

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: pageBg, position: "relative", overflow: "hidden",
      padding: "80px 24px 48px",
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      transition: "background 0.4s ease",
    }}>

      {/* Ambient page orbs */}
      <motion.div
        animate={{ x: ["0%","12%","0%"], y: ["0%","18%","0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-25%", right: "-8%", pointerEvents: "none",
          width: "55%", height: "85%", borderRadius: "50%",
          background: t.isDark ? "rgba(140,158,205,0.45)" : "rgba(130,148,192,0.55)",
          filter: "blur(140px)",
          mixBlendMode: t.isDark ? "screen" : "multiply",
        }}
      />
      <motion.div
        animate={{ x: ["0%","-9%","0%"], y: ["0%","12%","0%"] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        style={{
          position: "absolute", bottom: "-20%", left: "-8%", pointerEvents: "none",
          width: "55%", height: "75%", borderRadius: "50%",
          background: t.isDark ? "rgba(55,175,235,0.22)" : "rgba(80,110,170,0.42)",
          filter: "blur(140px)",
          mixBlendMode: t.isDark ? "screen" : "multiply",
        }}
      />

      {/* Logo */}
      <Link to="/" style={{
        position: "absolute", top: 32, left: 48, zIndex: 20,
        textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: t.isDark ? "#FFFFFF" : "#1A1C24",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Network size={15} color={t.isDark ? "#09090B" : "#FFFFFF"} strokeWidth={2} />
        </div>
        <span style={{
          fontSize: 16, fontWeight: 800, letterSpacing: "-0.03em",
          color: t.isDark ? "#FFFFFF" : "#1A1C24",
          transition: "color 0.4s ease",
        }}>Navigator</span>
      </Link>

      {/* Theme toggle */}
      <button
        onClick={() => setThemeKey(k => k === "lunar-dark" ? "lunar-light" : "lunar-dark")}
        style={{
          position: "absolute", top: 32, right: 48, zIndex: 20,
          width: 38, height: 38, borderRadius: "50%",
          background: t.isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.60)",
          border: `1px solid ${t.isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.88)"}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: textMuted, fontSize: 15,
          backdropFilter: "blur(10px)", transition: "all 0.2s ease",
        }}
      >
        {t.isDark ? "☀" : "☾"}
      </button>

      {/* ── Centered card ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex", position: "relative", zIndex: 10,
          width: "min(1280px, calc(100vw - 32px))",
          minHeight: 620, borderRadius: 28, overflow: "hidden",
          boxShadow: t.isDark
            ? "0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)"
            : "0 32px 90px rgba(30,50,120,0.18), 0 0 0 1px rgba(255,255,255,0.88)",
        }}
      >
        {/* ── Left: graphic (60%) ── */}
        <div style={{
          flex: "0 0 60%", position: "relative", overflow: "hidden",
          background: t.isDark
            ? "linear-gradient(155deg, #0A1630 0%, #0E1F42 50%, #070C1C 100%)"
            : "linear-gradient(155deg, #DBE8FF 0%, #E8F0FF 50%, #D6E4FF 100%)",
          padding: "48px 48px 44px",
          display: "flex", flexDirection: "column",
          transition: "background 0.4s ease",
        }}>
          {/* Ambient orbs */}
          <div style={{
            position: "absolute", top: "-20%", left: "-10%",
            width: "80%", height: "80%", borderRadius: "50%",
            background: t.isDark ? "rgba(55,100,200,0.18)" : "rgba(30,79,170,0.10)",
            filter: "blur(80px)", pointerEvents: "none",
          }}/>
          <div style={{
            position: "absolute", bottom: "-15%", right: "-15%",
            width: "70%", height: "70%", borderRadius: "50%",
            background: t.isDark ? "rgba(88,236,255,0.08)" : "rgba(100,160,255,0.12)",
            filter: "blur(70px)", pointerEvents: "none",
          }}/>

          {/* Badge */}
          <div style={{ position: "relative", zIndex: 5, flexShrink: 0 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.isDark ? "rgba(88,236,255,0.10)" : "rgba(30,79,170,0.09)",
              borderRadius: 999, padding: "6px 16px", marginBottom: 20,
              border: `1px solid ${t.isDark ? "rgba(88,236,255,0.22)" : "rgba(30,79,170,0.22)"}`,
            }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: t.accent1 }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: t.accent1, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                Get started free
              </span>
            </div>
          </div>

          {/* B2B Infographic */}
          <div style={{ position: "relative", zIndex: 5, flex: 1, minHeight: 200, margin: "8px -16px 0" }}>
            <B2BInfographic isDark={t.isDark} />
          </div>
        </div>

        {/* ── Right: form (40%) ── */}
        <div style={{
          flex: "0 0 40%", background: formBg,
          backdropFilter: t.isDark ? "blur(48px) saturate(180%)" : "none",
          WebkitBackdropFilter: t.isDark ? "blur(48px) saturate(180%)" : "none",
          padding: "60px 56px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          borderLeft: `1px solid ${t.isDark ? "rgba(255,255,255,0.06)" : "rgba(220,230,250,0.50)"}`,
          transition: "background 0.4s ease",
        }}>
          <div style={{ maxWidth: 420, width: "100%" }}>
            <h1 style={{
              fontSize: "clamp(1.6rem, 2.2vw, 2rem)", fontWeight: 800,
              letterSpacing: "-0.04em", color: t.text,
              margin: "0 0 6px", lineHeight: 1.15,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>Create account</h1>
            <p style={{ fontSize: 15, color: textMuted, margin: "0 0 28px", lineHeight: 1.5 }}>
              Ship your AI agent in under 30 minutes.
            </p>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Full name</label>
              <input type="text" placeholder="Jane Smith"
                value={name} onChange={e => setName(e.target.value)}
                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                style={inputStyle("name")} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email address</label>
              <input type="email" placeholder="name@company.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                style={inputStyle("email")} />
            </div>

            {/* Password + strength */}
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("password"), paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: textFaint, padding: 4, display: "flex",
                }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: "flex", gap: 5, marginTop: 9 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 4,
                      background: strengthLevel >= i ? strengthColors[strengthLevel]
                        : t.isDark ? "rgba(255,255,255,0.10)" : "rgba(28,32,50,0.10)",
                      transition: "background 0.25s ease",
                    }} />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Terms */}
            <p style={{ fontSize: 12.5, color: textFaint, margin: "16px 0 24px", lineHeight: 1.6 }}>
              By creating an account you agree to our{" "}
              <a href="#" style={{ color: accent, textDecoration: "none", fontWeight: 600 }}>Terms</a>
              {" "}and{" "}
              <a href="#" style={{ color: accent, textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>.
            </p>

            {/* Submit */}
            <button style={{
              width: "100%", padding: "14px 20px",
              background: t.isDark ? "#FFFFFF" : "#1A1C24",
              color: t.isDark ? "#05070D" : "#FFFFFF",
              border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              letterSpacing: "-0.01em",
              boxShadow: t.isDark ? "0 8px 32px rgba(0,0,0,0.45)" : "0 4px 20px rgba(26,28,36,0.20)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = "translateY(-2px)";
                b.style.background = t.isDark ? "#E0E4EC" : "#2E3040";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = "translateY(0)";
                b.style.background = t.isDark ? "#FFFFFF" : "#1A1C24";
              }}
            >
              Create account <ArrowRight size={15} />
            </button>

            <p style={{ textAlign: "center", marginTop: 22, fontSize: 14.5, color: textMuted }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: accent, fontWeight: 700, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "0 48px 28px", display: "flex", gap: 20, zIndex: 20,
        fontSize: 10, fontWeight: 600,
        color: t.isDark ? "rgba(200,212,236,0.25)" : "rgba(28,32,50,0.42)",
        textTransform: "uppercase", letterSpacing: "0.10em",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <span>© 2024 Navigator AI</span>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Status</a>
      </div>

      <style>{`
        input::placeholder { color: ${t.isDark ? "rgba(200,212,236,0.25)" : "rgba(28,32,50,0.35)"}; }
        * { box-sizing: border-box; } body { margin: 0; }
      `}</style>
    </div>
  );
}
