import { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, Check, X, Zap, Shield, Lock, Database, Globe, Network,
  BarChart3, Settings2, FileCode, Eye, SlidersHorizontal,
  BookOpen, Package, ChevronRight,
  Users, TrendingUp, CheckCircle2, Clock, Star,
  Braces, Upload, ToggleLeft, LayoutDashboard,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ThemeKey = "lunar-dark" | "lunar-light";

interface Theme {
  key: ThemeKey;
  label: string;
  isDark: boolean;
  bg: string;
  surface: string;
  surface2: string;
  primary: string;
  secondary: string;
  accent: string;
  accent1: string;
  accent2: string;
  accent3: string;
  gradient: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  glowStrong: string;
  glowSubtle: string;
  glow1: string;
  glow2: string;
  glow3: string;
  buttonBg: string;
  buttonText: string;
  buttonHoverBg: string;
}

// ─── Theme Definitions ────────────────────────────────────────────────────────
const THEMES: Record<ThemeKey, Theme> = {
  "lunar-dark": {
    key: "lunar-dark", label: "Dark", isDark: true,
    bg: "#05070D", surface: "rgba(255,255,255,0.07)", surface2: "rgba(255,255,255,0.04)",
    primary: "#FFFFFF", secondary: "#C8D4EC", accent: "#FFFFFF",
    accent1: "#58ECFF", accent2: "#A0D4F8", accent3: "#E8F6FF",
    gradient: "linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.55) 100%)",
    text: "#FFFFFF", textMuted: "rgba(200,212,236,0.65)", textFaint: "rgba(200,212,236,0.25)",
    border: "rgba(255,255,255,0.1)",
    glowStrong: "rgba(255,255,255,0.15)", glowSubtle: "rgba(255,255,255,0.05)",
    glow1: "rgba(140,158,205,0.45)", glow2: "rgba(55,175,235,0.22)", glow3: "rgba(190,210,240,0.30)",
    buttonBg: "#FFFFFF", buttonText: "#05070D", buttonHoverBg: "#E0E4EC",
  },
  "lunar-light": {
    key: "lunar-light", label: "Light", isDark: false,
    bg: "#E8EBF2", surface: "rgba(255,255,255,0.60)", surface2: "rgba(255,255,255,0.84)",
    primary: "#1A1C24", secondary: "#3A3C48", accent: "#1A1C24",
    accent1: "#1E4FAA", accent2: "#1060C8", accent3: "#2870CC",
    gradient: "linear-gradient(135deg, #1A1C24 0%, rgba(26,28,36,0.5) 100%)",
    text: "#1A1C24", textMuted: "rgba(28,32,50,0.82)", textFaint: "rgba(28,32,50,0.54)",
    border: "rgba(255,255,255,0.88)",
    glowStrong: "rgba(0,0,0,0.08)", glowSubtle: "rgba(0,0,0,0.03)",
    glow1: "rgba(130,148,192,0.55)", glow2: "rgba(80,110,170,0.42)", glow3: "rgba(170,188,225,0.38)",
    buttonBg: "#1A1C24", buttonText: "#FFFFFF", buttonHoverBg: "#2E3040",
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const COMPANY_NAMES = [
  "Meridian", "Stackflow", "Arken Labs", "Nebula HQ", "Prismatic",
  "Veloforge", "Coretek", "Synapse IO", "Luminary", "Orbitcast",
  "Deltawave", "Prism Cloud",
];

const TESTIMONIALS = [
  {
    quote: "We replaced three support engineers' worth of ticket volume in the first week. Navigator just handles it — the right answer, from our actual docs, every time.",
    name: "Marcus Chen", title: "CTO", company: "Stackflow", initials: "MC",
  },
  {
    quote: "Setup took 22 minutes. I uploaded our OpenAPI spec, enabled the tools I wanted, and shipped. Users now upgrade plans directly through chat — zero engineering beyond the script tag.",
    name: "Priya Nair", title: "Head of Product", company: "Arken Labs", initials: "PN", featured: true,
  },
  {
    quote: "The thing that surprised me most: it never hallucinates about our product. It searches the knowledge base, finds the real answer, and tells users exactly that. Or says it doesn't know.",
    name: "James Whitmore", title: "Founder", company: "Nebula HQ", initials: "JW",
  },
];

const FAQ_ITEMS = [
  {
    q: "How long does setup actually take?",
    a: "Most teams are live in under 30 minutes. Upload your OpenAPI spec (or paste the URL), review the auto-generated tools, add your knowledge base docs, and paste one script tag into your app. No custom agent code, no infrastructure to manage.",
  },
  {
    q: "Is our API secure when Navigator calls it?",
    a: "Yes. Navigator forwards your users' own auth tokens when calling your APIs — it never stores or proxies credentials. Each request is made on behalf of the authenticated user, so your existing API authorization logic remains fully in control.",
  },
  {
    q: "What if Navigator doesn't know the answer?",
    a: "It searches your knowledge base using vector similarity first. If it finds relevant content, it answers from that. If it doesn't, it says so clearly — it won't fabricate answers about your product. You can also set custom fallback instructions in the dashboard.",
  },
  {
    q: "Can I control which APIs the agent can call?",
    a: "Yes — granular per-endpoint control in the dashboard. Enable or disable individual tools, and set required permissions. Navigator will only call the tools you've explicitly enabled for each site.",
  },
  {
    q: "What happens if I exceed my message quota?",
    a: "We email you at 80% and 100% of your quota. The agent continues working — we don't cut users off mid-conversation. Overages are billed at a small per-message rate, and you can upgrade your plan at any time.",
  },
  {
    q: "Does Navigator work with any tech stack?",
    a: "Yes. The widget is a plain JavaScript IIFE — no React, no Vue, no framework dependencies. It embeds on any web page with a single script tag. Your backend just needs an OpenAPI-compatible spec for tool generation.",
  },
];

// ─── Widget Customizer Data ───────────────────────────────────────────────────
const COLOR_PRESETS = [
  "#7C3AED", "#2563EB", "#0D9488", "#E11D48",
  "#EA580C", "#059669", "#0F172A", "#DB2777",
];

interface WidgetConfig {
  brandName: string;
  logoText: string;
  logoImage: string;
  brandColor: string;
  position: "right" | "left";
  widgetTheme: "light" | "dark";
  greeting: string;
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes nav-flow {
    to { stroke-dashoffset: -36; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes text-shimmer {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.4); }
  }
  @keyframes orb-breathe {
    0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.75; transform: translateX(-50%) scale(1.12); }
  }
  @keyframes orb-drift {
    0%, 100% { opacity: 1; transform: scale(1) translate(0, 0); }
    33% { opacity: 0.8; transform: scale(1.1) translate(3%, -2%); }
    66% { opacity: 0.9; transform: scale(0.95) translate(-2%, 3%); }
  }
  @keyframes aurora-pulse {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
  }
  @keyframes border-glow-dark {
    0%, 100% { box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(88,236,255,0.35), 0 0 18px rgba(88,236,255,0.22), 0 0 40px rgba(88,236,255,0.10); border-color: rgba(88,236,255,0.45); }
    50% { box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(88,236,255,0.75), 0 0 32px rgba(88,236,255,0.45), 0 0 64px rgba(88,236,255,0.20); border-color: rgba(88,236,255,0.85); }
  }
  @keyframes border-glow-light {
    0%, 100% { box-shadow: 0 4px 28px rgba(60,80,130,0.07), 0 0 0 1px rgba(30,79,170,0.30), 0 0 18px rgba(30,79,170,0.18), 0 0 40px rgba(30,79,170,0.08); border-color: rgba(30,79,170,0.45); }
    50% { box-shadow: 0 4px 28px rgba(60,80,130,0.07), 0 0 0 1px rgba(30,79,170,0.65), 0 0 28px rgba(30,79,170,0.35), 0 0 56px rgba(30,79,170,0.15); border-color: rgba(30,79,170,0.80); }
  }
  .pipeline-last-dark { animation: border-glow-dark 2.6s ease-in-out infinite; }
  .pipeline-last-light { animation: border-glow-light 2.6s ease-in-out infinite; }
  .orbit-node-dark {
    transition: box-shadow 0.3s ease, transform 0.25s ease;
  }
  .orbit-node-dark:hover {
    box-shadow: 0 0 0 1px rgba(88,236,255,0.25), 0 0 24px rgba(88,236,255,0.35), 0 0 52px rgba(88,236,255,0.15);
    transform: scale(1.06);
  }
  .orbit-node-light {
    transition: box-shadow 0.3s ease, transform 0.25s ease;
  }
  .orbit-node-light:hover {
    box-shadow: 0 0 0 1px rgba(30,79,170,0.25), 0 0 20px rgba(30,79,170,0.28), 0 0 44px rgba(100,118,158,0.16);
    transform: scale(1.06);
  }
  .btn-primary {
    transition: transform 0.18s ease, box-shadow 0.18s ease !important;
  }
  .btn-primary:hover {
    transform: translateY(-2px) !important;
  }
  * { scrollbar-width: none; -ms-overflow-style: none; box-sizing: border-box; }
  *::-webkit-scrollbar { display: none; }
  html { scroll-behavior: smooth; }
  body { transition: background-color 0.3s ease; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16.5px; }
  ::selection { background: rgba(88,236,255,0.25); }
  .glass-pill {
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
  }
  .shimmer-dark {
    background-image: linear-gradient(90deg, #6080A8 0%, #A8C8E8 22%, #E8F4FF 42%, #FFFFFF 50%, #E8F4FF 58%, #A8C8E8 78%, #6080A8 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: text-shimmer 6s linear infinite;
    display: inline-block;
  }
  .shimmer-light {
    background-image: linear-gradient(90deg, #2A3A5A 0%, #4A6490 22%, #8098C0 42%, #1E3060 50%, #8098C0 58%, #4A6490 78%, #2A3A5A 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: text-shimmer 6s linear infinite;
    display: inline-block;
  }

  @media (max-width: 900px) {
    .grid-hero { grid-template-columns: 1fr !important; }
    .grid-hero > *:last-child { display: none; }
    .grid-2col { grid-template-columns: 1fr !important; gap: 40px !important; }
    .grid-3col { grid-template-columns: 1fr !important; }
    .grid-4col { grid-template-columns: repeat(2, 1fr) !important; }
    .grid-caps { grid-template-columns: 1fr !important; }
    .grid-caps > * { grid-column: span 1 !important; }
    .grid-footer { grid-template-columns: 1fr 1fr !important; }
    .grid-customizer { grid-template-columns: 1fr !important; }
    .nav-links { display: none !important; }
    .hide-mobile { display: none !important; }
  }
  @media (max-width: 600px) {
    .grid-4col { grid-template-columns: 1fr !important; }
    .grid-footer { grid-template-columns: 1fr !important; }
    .grid-3col-testi { grid-template-columns: 1fr !important; }
    .demo-grid { grid-template-columns: 1fr !important; }
    .demo-grid > *:last-child { display: none; }
    .comparison-table { font-size: 12px !important; }
    .comparison-table td, .comparison-table th { padding: 10px 12px !important; }
  }
`;

// ─── Helper: Gradient Text ────────────────────────────────────────────────────
function GText({ gradient, children, style }: { gradient: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      background: gradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      ...style,
    }}>
      {children}
    </span>
  );
}

// ─── Animated Phrase ─────────────────────────────────────────────────────────
function AnimatedPhrase({ phrases, theme }: { phrases: string[]; theme: Theme }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % phrases.length);
        setVisible(true);
      }, 380);
    }, 2800);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <span style={{
      display: "inline-block",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
      color: theme.text,
      fontWeight: 700,
    }}>
      {phrases[idx]}
    </span>
  );
}

// ─── How It Works — Pipeline Cards ───────────────────────────────────────────
function PipelineCards({ theme, steps }: {
  theme: Theme;
  steps: Array<{ step: string; icon: React.ReactNode; title: string; desc: string }>;
}) {
  const t = theme;
  const a1 = t.accent1;
  const a2 = t.accent2;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                style={{
                  flex: 1, borderRadius: 24, position: "relative",
                  display: "flex", flexDirection: "column",
                  padding: "28px 22px 26px", overflow: "hidden",
                  backdropFilter: "blur(48px) saturate(200%)",
                  WebkitBackdropFilter: "blur(48px) saturate(200%)",
                  background: t.isDark
                    ? "linear-gradient(155deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)"
                    : "linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(240,245,255,0.82) 100%)",
                  border: isLast
                    ? `1px solid ${t.isDark ? `${a1}40` : `${a1}35`}`
                    : `1px solid ${t.isDark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.92)"}`,
                  boxShadow: isLast
                    ? t.isDark
                      ? `0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px ${a1}20, 0 0 40px ${a1}12`
                      : `0 8px 40px rgba(80,100,180,0.10), 0 0 0 1px ${a1}20, 0 0 32px ${a1}0A`
                    : t.isDark
                      ? "0 4px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)"
                      : "0 4px 32px rgba(80,100,180,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                {/* Top rim light */}
                <div style={{
                  position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
                  background: t.isDark
                    ? `linear-gradient(90deg, transparent, ${a1}55, transparent)`
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
                  borderRadius: 999,
                }} />

                {/* Icon ambient glow */}
                <div style={{
                  position: "absolute", top: -30, left: -30,
                  width: 110, height: 110, borderRadius: "50%",
                  background: t.isDark
                    ? `radial-gradient(circle, ${a1}18 0%, transparent 70%)`
                    : `radial-gradient(circle, rgba(80,100,220,0.07) 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                {/* Step label */}
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase" as const, marginBottom: 14,
                  color: t.isDark ? `${a1}99` : "rgba(80,100,200,0.55)",
                }}>Step {step.step}</div>

                {/* Icon */}
                <div style={{
                  width: 46, height: 46, borderRadius: 13, marginBottom: 18, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: t.isDark ? a1 : "rgba(60,90,210,0.85)",
                  background: t.isDark
                    ? `linear-gradient(135deg, ${a1}20, ${a1}08)`
                    : "linear-gradient(135deg, rgba(80,100,220,0.10), rgba(80,100,220,0.03))",
                  border: t.isDark ? `1px solid ${a1}28` : "1px solid rgba(80,100,220,0.13)",
                  boxShadow: t.isDark
                    ? `0 0 18px ${a1}18, 0 2px 8px rgba(0,0,0,0.2)`
                    : `0 0 14px rgba(80,100,220,0.08)`,
                }}>{step.icon}</div>

                <h3 style={{
                  fontSize: 16, fontWeight: 700, margin: "0 0 9px",
                  lineHeight: 1.3, letterSpacing: "-0.02em", color: t.text,
                }}>{step.title}</h3>

                <p style={{
                  fontSize: 13.5, color: t.textMuted, lineHeight: 1.7, margin: 0,
                }}>{step.desc}</p>

                {/* Last card breathing ring */}
                {isLast && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: "absolute", inset: -1, borderRadius: 24,
                      border: `1px solid ${a1}`,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </motion.div>

              {/* Connector — single clean arc */}
              {i < steps.length - 1 && (() => {
                const arcDown = i % 2 === 0;
                const arc = arcDown
                  ? "M 0 50 C 16 76 40 76 56 50"
                  : "M 0 50 C 16 24 40 24 56 50";
                const mid: [number, number] = arcDown ? [28, 76] : [28, 24];
                return (
                  <div style={{ width: 44, flexShrink: 0, alignSelf: "stretch" }}>
                    <svg viewBox="0 0 56 100" width="44" height="100%"
                      preserveAspectRatio="none"
                      style={{ display: "block", overflow: "visible" }}>
                      <defs>
                        <linearGradient id={`pcg-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={a1} stopOpacity="0.15" />
                          <stop offset="50%" stopColor={a2} stopOpacity="0.35" />
                          <stop offset="100%" stopColor={a1} stopOpacity="0.15" />
                        </linearGradient>
                        <filter id={`pglow-${i}`}>
                          <feGaussianBlur stdDeviation="2.5" result="b" />
                          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      </defs>
                      {/* Ambient glow trace */}
                      <path d={arc} stroke={a1} strokeWidth="5" fill="none"
                        strokeOpacity="0.07" strokeLinecap="round" filter={`url(#pglow-${i})`} />
                      {/* Core dashed line */}
                      <path d={arc} stroke={`url(#pcg-${i})`} strokeWidth="0.9" fill="none"
                        strokeLinecap="round" strokeDasharray="2.5 5" />
                      {/* Single gliding particle */}
                      <motion.circle r={2.2} fill={a1}
                        animate={{ cx: [0, mid[0], 56], cy: [50, mid[1], 50], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.65, ease: "easeInOut" }}
                        style={{ filter: `drop-shadow(0 0 5px ${a1}) drop-shadow(0 0 10px ${a1}80)` }}
                      />
                    </svg>
                  </div>
                );
              })()}
            </Fragment>
          );
        })}
      </div>

      {/* Completion pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.6 }} viewport={{ once: true }}
        style={{ textAlign: "center", marginTop: 32 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          backdropFilter: "blur(32px) saturate(180%)", WebkitBackdropFilter: "blur(32px) saturate(180%)",
          background: t.isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.88)",
          border: `1px solid ${t.isDark ? `${a1}30` : `${a1}25`}`,
          borderRadius: 999, padding: "11px 24px",
          boxShadow: t.isDark
            ? `0 0 32px ${a1}10, inset 0 1px 0 rgba(255,255,255,0.07)`
            : `0 4px 24px rgba(80,100,180,0.08), inset 0 1px 0 rgba(255,255,255,1)`,
        }}>
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 26, height: 26, borderRadius: 9999,
              background: t.isDark ? a1 : "rgba(60,90,210,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: `0 0 16px ${a1}50`,
            }}>
            <Check size={12} color="white" strokeWidth={3} />
          </motion.div>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.text, letterSpacing: "-0.01em" }}>Action complete</span>
          <span style={{ width: 1, height: 14, background: t.isDark ? "rgba(255,255,255,0.12)" : "rgba(28,32,50,0.12)" }} />
          <span style={{ fontSize: 14, color: t.isDark ? a1 : "rgba(60,90,210,0.85)", fontWeight: 500 }}>Live intelligence is active</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Hero Visualization ───────────────────────────────────────────────────────
function HeroViz({ theme }: { theme: Theme }) {
  const nodes = [
    { label: "User Intent", sub: "Upgrade to Enterprise", step: "01" },
    { label: "KB Search", sub: "2,400 docs indexed", step: "02" },
    { label: "Tool Selection", sub: "upgrade_subscription", step: "03" },
    { label: "API Execution", sub: "POST /v1/subscriptions", step: "04" },
    { label: "Action Complete", sub: "Enterprise active", step: "✓", isLast: true },
  ];

  // Alternating Y positions: odd nodes high (85), even nodes low (165)
  const NX = [100, 300, 500, 700, 900];
  const NY = [85, 165, 85, 165, 85];
  const NW = 172, NH = 58, r = 29;

  // Diagonal S-curves between alternating heights
  const paths = [
    `M ${NX[0]+NW/2} ${NY[0]} C ${NX[0]+NW/2+30} ${NY[0]} ${NX[1]-NW/2-30} ${NY[1]} ${NX[1]-NW/2} ${NY[1]}`,
    `M ${NX[1]+NW/2} ${NY[1]} C ${NX[1]+NW/2+30} ${NY[1]} ${NX[2]-NW/2-30} ${NY[2]} ${NX[2]-NW/2} ${NY[2]}`,
    `M ${NX[2]+NW/2} ${NY[2]} C ${NX[2]+NW/2+30} ${NY[2]} ${NX[3]-NW/2-30} ${NY[3]} ${NX[3]-NW/2} ${NY[3]}`,
    `M ${NX[3]+NW/2} ${NY[3]} C ${NX[3]+NW/2+30} ${NY[3]} ${NX[4]-NW/2-30} ${NY[4]} ${NX[4]-NW/2} ${NY[4]}`,
  ];

  // Particle midpoints: midpoint of each diagonal at x=200,400,600,800 and midY
  const pkf = [
    { x: [NX[0]+NW/2, 200, NX[1]-NW/2], y: [NY[0], 125, NY[1]] },
    { x: [NX[1]+NW/2, 400, NX[2]-NW/2], y: [NY[1], 125, NY[2]] },
    { x: [NX[2]+NW/2, 600, NX[3]-NW/2], y: [NY[2], 125, NY[3]] },
    { x: [NX[3]+NW/2, 800, NX[4]-NW/2], y: [NY[3], 125, NY[4]] },
  ];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{
        position: "absolute", top: "5%", left: "20%", right: "20%", bottom: "5%",
        background: `radial-gradient(ellipse at center, ${theme.glow1} 0%, transparent 70%)`,
        filter: "blur(55px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "15%", left: "35%", right: "35%", bottom: "15%",
        background: `radial-gradient(ellipse at center, ${theme.glow2} 0%, transparent 70%)`,
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      <svg viewBox="0 0 1000 250" style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id={`lg-${theme.key}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.accent1} stopOpacity="0.9" />
            <stop offset="50%" stopColor={theme.accent2} stopOpacity="0.9" />
            <stop offset="100%" stopColor={theme.accent3} stopOpacity="0.9" />
          </linearGradient>
          <filter id={`gf-${theme.key}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Glow traces */}
        {paths.map((d, i) => (
          <path key={`glow-${i}`} d={d} stroke={theme.accent1} strokeWidth="8"
            fill="none" strokeOpacity="0.06" strokeLinecap="round" />
        ))}

        {/* Animated dashed paths */}
        {paths.map((d, i) => (
          <path key={`path-${i}`} d={d}
            stroke={`url(#lg-${theme.key})`} strokeWidth="1.8"
            fill="none" strokeDasharray="6 5" strokeLinecap="round"
            style={{ animation: `nav-flow ${1.8 + i * 0.1}s linear infinite ${i * 0.3}s` }}
          />
        ))}

        {/* Traveling particles */}
        {pkf.map((kf, i) => (
          <motion.circle key={`p1-${i}`} r={4}
            fill={i % 2 === 0 ? theme.accent1 : theme.accent2}
            animate={{ cx: kf.x, cy: kf.y, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${i % 2 === 0 ? theme.accent1 : theme.accent2})` }}
          />
        ))}
        {pkf.map((kf, i) => (
          <motion.circle key={`p2-${i}`} r={2.5}
            fill={theme.accent3}
            animate={{ cx: kf.x, cy: kf.y, opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.4 + 1, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${theme.accent3})` }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const x = NX[i], y = NY[i];
          const nx = x - NW / 2, ny = y - NH / 2;
          const isLast = !!node.isLast;

          return (
            <g key={i}>
              {isLast && (
                <>
                  <rect x={nx - 8} y={ny - 8} width={NW + 16} height={NH + 16}
                    rx={r + 8} fill={theme.accent1} fillOpacity="0.06" />
                  <rect x={nx - 2} y={ny - 2} width={NW + 4} height={NH + 4}
                    rx={r + 2} fill="none" stroke={theme.accent1} strokeWidth="1.2"
                    strokeOpacity="0.3" />
                </>
              )}

              <rect x={nx} y={ny} width={NW} height={NH} rx={r}
                fill={theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.94)"}
                stroke={isLast ? theme.accent1 : (theme.isDark ? "rgba(255,255,255,0.14)" : "rgba(140,155,190,0.5)")}
                strokeWidth={isLast ? 1.8 : 1}
                filter={isLast ? `url(#gf-${theme.key})` : undefined}
              />

              {/* Step badge */}
              <circle cx={nx + r} cy={y} r={r * 0.55}
                fill={isLast ? theme.accent1 : theme.accent1}
                fillOpacity={isLast ? 0.22 : (theme.isDark ? 0.1 : 0.12)}
              />
              <text x={nx + r} y={y + 4.5}
                fill={isLast ? theme.accent1 : (theme.isDark ? "rgba(200,210,235,0.8)" : "rgba(30,79,170,0.85)")}
                fontSize="11" fontWeight="800" textAnchor="middle"
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >{node.step}</text>

              {/* Label */}
              <text x={nx + r * 2 + 8} y={y - 7}
                fill={isLast ? theme.accent1 : (theme.isDark ? "#F0F4FF" : "#1A1C24")}
                fontSize="12" fontWeight="700"
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >{node.label}</text>

              {/* Sub */}
              <text x={nx + r * 2 + 8} y={y + 10}
                fill={theme.isDark ? "rgba(180,195,230,0.5)" : "rgba(55,58,72,0.58)"}
                fontSize="9.5"
                fontFamily="'JetBrains Mono', monospace"
              >{node.sub}</text>
            </g>
          );
        })}

        {/* Pulsing rings on last node */}
        <motion.circle cx={NX[4]} cy={NY[4]} r={30} fill="none"
          stroke={theme.accent1} strokeWidth="1.2"
          animate={{ r: [28, 52], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle cx={NX[4]} cy={NY[4]} r={30} fill="none"
          stroke={theme.accent2} strokeWidth="1"
          animate={{ r: [28, 52], opacity: [0.4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.9 }}
        />
      </svg>
    </div>
  );
}

// ─── Demo Section ─────────────────────────────────────────────────────────────
interface ChatMsg { id: number; role: "user" | "assistant"; text: string }
interface LogEntry { id: number; tool: string; args: string; status: "running" | "done"; latencyMs: number; ts: string }

const DEMO_EVENTS: Array<{ delay: number; type: string; payload: Record<string, unknown> }> = [
  { delay: 800, type: "chat", payload: { role: "user", text: "What's my current subscription?" } },
  { delay: 1800, type: "log", payload: { tool: "get_subscription", args: '{ "userId": "usr_89124" }', status: "running", latencyMs: 0, ts: "09:14:22" } },
  { delay: 2500, type: "log-done", payload: { id: 0, latencyMs: 145, ts: "09:14:22" } },
  { delay: 2900, type: "chat", payload: { role: "assistant", text: "You're on the **Pro Plan** — $49/month, 50,000 messages, 5 sites. Renews Dec 1, 2024." } },
  { delay: 5000, type: "chat", payload: { role: "user", text: "Upgrade me to Enterprise." } },
  { delay: 6000, type: "log", payload: { tool: "check_eligibility", args: '{ "plan": "enterprise" }', status: "running", latencyMs: 0, ts: "09:14:27" } },
  { delay: 6600, type: "log-done", payload: { id: 1, latencyMs: 89, ts: "09:14:27" } },
  { delay: 6800, type: "log", payload: { tool: "upgrade_subscription", args: '{ "plan": "enterprise", "prorate": true }', status: "running", latencyMs: 0, ts: "09:14:28" } },
  { delay: 7600, type: "log-done", payload: { id: 2, latencyMs: 312, ts: "09:14:28" } },
  { delay: 8000, type: "chat", payload: { role: "assistant", text: "Done. You're now on **Enterprise** — $199/month, unlimited messages, 50 sites, SSO & priority support. Prorated $125 charged for November." } },
];

function DemoSection({ theme, heroMode = false }: { theme: Theme; heroMode?: boolean }) {
  const [chats, setChats] = useState<ChatMsg[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function bold(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") ? <strong key={i} style={{ color: theme.primary }}>{p.slice(2, -2)}</strong> : p
    );
  }

  function runDemo() {
    if (runningRef.current) return;
    runningRef.current = true;
    setChats([]); setLogs([]); setIsTyping(false); setActiveUser("");
    const logIds: number[] = [];

    DEMO_EVENTS.forEach(ev => {
      const t = setTimeout(() => {
        if (ev.type === "chat") {
          const msg = ev.payload as { role: "user" | "assistant"; text: string };
          if (msg.role === "assistant") {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setChats(c => [...c, { id: Date.now(), role: "assistant", text: msg.text }]);
            }, 600);
          } else {
            setChats(c => [...c, { id: Date.now(), role: "user", text: msg.text }]);
            setActiveUser(msg.text);
          }
        } else if (ev.type === "log") {
          const entry = ev.payload as Omit<LogEntry, "id">;
          const id = logIds.length;
          logIds.push(Date.now());
          setLogs(l => [...l, { id: logIds[id], ...entry }]);
        } else if (ev.type === "log-done") {
          const { id, latencyMs } = ev.payload as { id: number; latencyMs: number };
          setLogs(l => l.map((e, idx) => idx === id ? { ...e, status: "done", latencyMs } : e));
        }
      }, ev.delay);
      timeoutsRef.current.push(t);
    });

    const restartT = setTimeout(() => {
      runningRef.current = false;
      timeoutsRef.current = [];
      runDemo();
    }, 12000);
    timeoutsRef.current.push(restartT);
  }

  useEffect(() => {
    if (heroMode) {
      runDemo();
      return () => {
        timeoutsRef.current.forEach(clearTimeout);
        runningRef.current = false;
      };
    }
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !runningRef.current) runDemo();
    }, { threshold: 0.3 });
    const el = document.getElementById("demo-section");
    if (el) obs.observe(el);
    return () => {
      obs.disconnect();
      timeoutsRef.current.forEach(clearTimeout);
      runningRef.current = false;
    };
  }, [theme.key]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chats, isTyping]);

  const totalTools = logs.filter(l => l.status === "done").length;
  const totalLatency = logs.filter(l => l.status === "done").reduce((a, l) => a + l.latencyMs, 0);

  const card = (
        <div style={{
          background: theme.isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(40px) saturate(160%)",
          WebkitBackdropFilter: "blur(40px) saturate(160%)",
          border: theme.isDark ? `1px solid rgba(255,255,255,0.1)` : `1px solid rgba(255,255,255,0.9)`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: theme.isDark
            ? `0 40px 80px rgba(0,0,0,0.5)`
            : `0 24px 80px rgba(80,95,130,0.1), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)`,
        }}>
          <div style={{
            padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: theme.isDark ? `1px solid rgba(255,255,255,0.08)` : `1px solid rgba(255,255,255,0.7)`,
            background: theme.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.55)",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 9999, background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, textAlign: "center", fontSize: 12, fontWeight: 600,
              color: theme.textFaint, fontFamily: "'JetBrains Mono', monospace",
            }}>
              navigator — agent session / usr_89124
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: 9999, background: theme.primary, display: "inline-block", opacity: 0.75 }} />
              <span style={{ fontSize: 11, color: theme.primary, fontFamily: "'JetBrains Mono', monospace" }}>connected</span>
            </div>
          </div>

          <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 440 }}>
            <div style={{ borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column" }}>
              <div style={{
                padding: "10px 16px", borderBottom: `1px solid ${theme.border}`,
                fontSize: 11, fontWeight: 600, color: theme.textFaint, textTransform: "uppercase", letterSpacing: "0.08em",
              }}>Conversation</div>

              <div ref={chatRef} style={{ flex: 1, padding: "20px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                {chats.length === 0 && (
                  <div style={{ color: theme.textFaint, fontSize: 13, textAlign: "center", marginTop: 60, fontStyle: "italic" }}>
                    Waiting for conversation to begin…
                  </div>
                )}
                {chats.map(msg => (
                  <motion.div key={msg.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 9999, flexShrink: 0,
                      background: msg.role === "user" ? theme.surface2 : `${theme.primary}18`,
                      border: `1px solid ${msg.role === "user" ? theme.border : theme.primary + "35"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: msg.role === "user" ? theme.textMuted : theme.primary,
                    }}>
                      {msg.role === "user" ? "U" : "N"}
                    </div>
                    <div style={{
                      maxWidth: "75%", padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.role === "user" ? theme.surface2 : `${theme.primary}10`,
                      border: `1px solid ${msg.role === "user" ? theme.border : theme.primary + "25"}`,
                      fontSize: 14.5, lineHeight: 1.6, color: theme.text,
                    }}>
                      {bold(msg.text)}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: "flex", gap: 10 }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 9999,
                      background: `${theme.primary}18`, border: `1px solid ${theme.primary}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: theme.primary,
                    }}>N</div>
                    <div style={{
                      padding: "10px 16px", borderRadius: "18px 18px 18px 4px",
                      background: `${theme.primary}10`, border: `1px solid ${theme.primary}25`,
                      display: "flex", gap: 4, alignItems: "center",
                    }}>
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} style={{ width: 6, height: 6, borderRadius: 9999, background: theme.primary }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}` }}>
                <div style={{
                  display: "flex", gap: 8, padding: "10px 14px",
                  background: theme.surface2, borderRadius: 12, border: `1px solid ${theme.border}`,
                }}>
                  <span style={{ flex: 1, fontSize: 13, color: theme.textFaint, fontStyle: "italic" }}>
                    {activeUser ? `"${activeUser}"` : "Ask Navigator anything…"}
                  </span>
                  <ArrowRight size={16} style={{ color: theme.primary, flexShrink: 0, marginTop: 1 }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{
                padding: "10px 16px", borderBottom: `1px solid ${theme.border}`,
                fontSize: 11, fontWeight: 600, color: theme.textFaint, textTransform: "uppercase", letterSpacing: "0.08em",
              }}>Agent Execution Log</div>

              <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {logs.length === 0 && (
                  <div style={{ color: theme.textFaint, fontSize: 13, textAlign: "center", marginTop: 60, fontStyle: "italic" }}>
                    Tool calls will appear here…
                  </div>
                )}
                {logs.map((log, idx) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    style={{
                      padding: "12px 14px", borderRadius: 12,
                      background: theme.surface2,
                      border: `1px solid ${log.status === "done" ? theme.primary + "25" : theme.border}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 9999,
                          background: log.status === "done" ? `${theme.primary}18` : `${theme.accent}18`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {log.status === "done"
                            ? <Check size={10} style={{ color: theme.primary }} />
                            : <motion.div style={{ width: 8, height: 8, borderRadius: 9999, background: theme.accent }}
                                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                          }
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: "'JetBrains Mono', monospace" }}>{log.tool}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {log.status === "done" && (
                          <span style={{ fontSize: 10, color: theme.primary, fontFamily: "'JetBrains Mono', monospace" }}>{log.latencyMs}ms</span>
                        )}
                        <span style={{ fontSize: 10, color: theme.textFaint }}>{log.ts}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: theme.textFaint, fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-all" }}>{log.args}</div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>
  );

  if (heroMode) return card;

  return (
    <section id="demo-section" style={{ padding: "96px 24px", backgroundColor: theme.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", padding: "6px 16px", borderRadius: 999,
            background: `${theme.primary}18`, border: `1px solid ${theme.primary}30`,
            color: theme.primary, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase" as const, marginBottom: 20,
          }}>Live Demo</span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em", color: theme.text }}>
            Watch Navigator think and act
          </h2>
          <p style={{ fontSize: 17, color: theme.textMuted, maxWidth: 500, margin: "0 auto" }}>
            Real tool calls. Real API execution. Not scripted — this is the actual agent loop running live.
          </p>
        </div>
        {card}
      </div>
    </section>
  );
}

// ─── Built for Scale ──────────────────────────────────────────────────────────
function ScaleSection({ theme }: { theme: Theme }) {
  const t = theme;
  const W = 1200, H = 620, CX = 600, CY = 310;
  const a1 = t.accent1, a2 = t.accent2;

  // Polar helper
  const p = (r: number, deg: number) => ({
    x: Math.round(CX + r * Math.cos((deg * Math.PI) / 180)),
    y: Math.round(CY + r * Math.sin((deg * Math.PI) / 180)),
  });

  // Nodes: centre, inner ring (r=130, 6), mid ring (r=235, 8), scatter (r=310-340)
  const NODES = [
    { ...{ x: CX, y: CY }, r: 9.5, hub: true },        // 0 centre
    { ...p(130,  0),  r: 5.5, hub: true },              // 1
    { ...p(130, 60),  r: 5.5, hub: true },              // 2
    { ...p(130,120),  r: 5.5, hub: true },              // 3
    { ...p(130,180),  r: 5.5, hub: true },              // 4
    { ...p(130,240),  r: 5.5, hub: true },              // 5
    { ...p(130,300),  r: 5.5, hub: true },              // 6
    { ...p(235, 22),  r: 3.5 },                         // 7
    { ...p(235, 67),  r: 3.5 },                         // 8
    { ...p(235,112),  r: 3.5 },                         // 9
    { ...p(235,157),  r: 3.5 },                         // 10
    { ...p(235,202),  r: 3.5 },                         // 11
    { ...p(235,247),  r: 3.5 },                         // 12
    { ...p(235,292),  r: 3.5 },                         // 13
    { ...p(235,337),  r: 3.5 },                         // 14
    { ...p(315, 10),  r: 2.5 },                         // 15
    { ...p(315, 55),  r: 2.5 },                         // 16
    { ...p(315, 95),  r: 2.5 },                         // 17
    { ...p(315,140),  r: 2.5 },                         // 18
    { ...p(315,185),  r: 2.5 },                         // 19
    { ...p(315,225),  r: 2.5 },                         // 20
    { ...p(315,270),  r: 2.5 },                         // 21
    { ...p(315,315),  r: 2.5 },                         // 22
    { ...p(60,  30),  r: 3 },                           // 23 inner cluster
    { ...p(60, 150),  r: 3 },                           // 24
    { ...p(60, 270),  r: 3 },                           // 25
  ];

  const EDGES: [number, number][] = [
    // centre spokes
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    // inner cluster
    [0,23],[0,24],[0,25],[23,1],[23,6],[24,3],[24,2],[25,4],[25,5],
    // inner → mid
    [1,7],[1,14],[2,7],[2,8],[3,8],[3,9],[4,9],[4,10],[5,10],[5,11],[6,11],[6,12],[1,13],[6,13],
    // mid ring lateral
    [7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,7],
    // mid → outer
    [7,15],[7,14],[8,16],[9,17],[10,18],[11,19],[12,20],[13,21],[14,22],[6,22],[1,15],
    // outer ring connections
    [15,16],[16,17],[17,18],[18,19],[20,21],[21,22],[22,15],
  ];

  // Metrics (SVG coordinate positions — outside the node clusters)
  const METRICS = [
    { val: "2,408+",  label: "APIs Connected",           x:  72, y: 148, anchor: "start"  },
    { val: "143K+",   label: "Tools Generated",          x: 1128, y: 110, anchor: "end"   },
    { val: "38M+",    label: "Knowledge Chunks Indexed", x: 1148, y: 358, anchor: "end"   },
    { val: "18M+",    label: "Actions Executed",         x:  52,  y: 488, anchor: "start" },
    { val: "98.7%",   label: "Success Rate",             x:  600, y: 592, anchor: "middle"},
  ];

  const nc = t.isDark ? "rgba(88,236,255,0.10)" : "rgba(30,79,170,0.13)";
  const ns = t.isDark ? "rgba(88,236,255,0.45)" : "rgba(30,79,170,0.70)";
  const lc = t.isDark ? "rgba(88,236,255,0.09)" : "rgba(30,79,170,0.22)";

  return (
    <section style={{
      padding: "100px 0 80px", position: "relative", overflow: "hidden",
    }}>
      {/* Central radial glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "55%", paddingBottom: "32%", borderRadius: "50%",
        background: t.isDark
          ? `radial-gradient(ellipse, ${a1}0f 0%, ${a2}06 45%, transparent 72%)`
          : `radial-gradient(ellipse, ${a1}0a 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Section label + heading */}
      <motion.div
        initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.55 }}
        style={{ textAlign: "center", marginBottom: 16, position: "relative" }}
      >
        <span style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 999,
          background: `${t.primary}18`, border: `1px solid ${t.primary}30`,
          color: t.primary, fontSize: 12, fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20,
        }}>Built for Scale</span>
        <h2 style={{
          fontSize: "clamp(2rem, 3.8vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15,
          margin: "0 0 14px", letterSpacing: "-0.03em",
        }}>
          Intelligence operating at{" "}
          <span className={t.isDark ? "shimmer-dark" : "shimmer-light"}>planetary scale</span>
        </h2>
        <p style={{ fontSize: 16, color: t.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
          Every API call, tool invocation, and knowledge retrieval — flowing through one platform, live.
        </p>
      </motion.div>

      {/* Network SVG */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }}
        style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
          <defs>
            <filter id="sc-node-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="sc-hub-glow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="sc-centre-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={a1} stopOpacity="0.18" />
              <stop offset="100%" stopColor={a1} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft glow behind centre */}
          <ellipse cx={CX} cy={CY} rx={180} ry={140} fill="url(#sc-centre-glow)" />

          {/* Edges */}
          {EDGES.map(([a, b], i) => (
            <line key={i}
              x1={NODES[a].x} y1={NODES[a].y}
              x2={NODES[b].x} y2={NODES[b].y}
              stroke={lc} strokeWidth={0.7} strokeLinecap="round"
            />
          ))}

          {/* Animated particles along edges */}
          {EDGES.filter((_, i) => i % 2 === 0).map(([a, b], i) => {
            const na = NODES[a], nb = NODES[b];
            const fwd = i % 3 !== 0;
            const [fx, tx] = fwd ? [na.x, nb.x] : [nb.x, na.x];
            const [fy, ty] = fwd ? [na.y, nb.y] : [nb.y, na.y];
            const dur = 1.4 + (i % 6) * 0.28;
            const delay = (i * 0.41) % 4.5;
            return (
              <motion.circle key={i} r={1.8} fill={a1}
                animate={{ cx: [fx, tx], cy: [fy, ty], opacity: [0, 1, 1, 0] }}
                transition={{ duration: dur, repeat: Infinity, repeatDelay: delay, ease: "easeInOut", times: [0, 0.08, 0.92, 1] }}
                style={{ filter: `drop-shadow(0 0 4px ${a1}) drop-shadow(0 0 8px ${a2}80)` }}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => (
            <g key={i}>
              {/* Pulse ring */}
              <motion.circle cx={node.x} cy={node.y}
                animate={{
                  r: [node.r + 1.5, node.r + (node.hub ? 16 : 9), node.r + 1.5],
                  opacity: [t.isDark ? 0.4 : 0.55, 0, t.isDark ? 0.4 : 0.55],
                }}
                transition={{ duration: 2.6 + (i % 5) * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.16 }}
                fill="none" stroke={a1} strokeWidth={t.isDark ? "0.5" : "0.9"}
              />
              {/* Node body */}
              <circle cx={node.x} cy={node.y} r={node.r}
                fill={nc} stroke={ns} strokeWidth={node.hub ? (t.isDark ? 0.9 : 1.4) : (t.isDark ? 0.6 : 1.0)}
                filter={node.hub ? "url(#sc-node-glow)" : undefined}
              />
              {/* Hub core */}
              {node.hub && (
                <circle cx={node.x} cy={node.y} r={node.r * 0.4}
                  fill={a1} fillOpacity={t.isDark ? 0.85 : 0.95}
                  filter="url(#sc-hub-glow)"
                />
              )}
            </g>
          ))}

          {/* Metric labels — rendered in SVG so they scale with the network */}
          {METRICS.map((m, i) => (
            <motion.g key={i}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
            >
              <text
                x={m.x} y={m.y}
                textAnchor={m.anchor as React.SVGAttributes<SVGTextElement>["textAnchor"]}
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight="800"
                fontSize="46"
                fill={t.text}
                letterSpacing="-1"
              >{m.val}</text>
              <text
                x={m.x} y={m.y + 24}
                textAnchor={m.anchor as React.SVGAttributes<SVGTextElement>["textAnchor"]}
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight="500"
                fontSize="14"
                fill={t.isDark ? "rgba(180,195,225,0.6)" : "rgba(28,32,50,0.68)"}
                letterSpacing="0.5"
              >{m.label}</text>
            </motion.g>
          ))}
        </svg>
      </motion.div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection({ theme }: { theme: Theme }) {
  const t = theme;
  const pill = (text: string) => (
    <span style={{
      display: "inline-block", padding: "6px 16px", borderRadius: 999,
      background: `${t.primary}18`, border: `1px solid ${t.primary}30`,
      color: t.primary, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase" as const, marginBottom: 20,
    }}>{text}</span>
  );

  return (
    <section style={{ padding: "96px 24px", background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          {pill("What teams say")}
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em", color: t.text }}>
            Trusted by teams who ship.
          </h2>
          <p style={{ fontSize: 17, color: t.textMuted, maxWidth: 460, margin: "0 auto" }}>
            Product teams across industries use Navigator to make their products feel 10× smarter.
          </p>
        </div>

        <div className="grid-3col-testi" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TESTIMONIALS.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
              style={{
                background: t.isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)",
                border: (item as any).featured
                  ? `1.5px solid rgba(255,255,255,0.18)`
                  : `1px solid ${t.border}`,
                backdropFilter: "blur(40px) saturate(160%)",
                WebkitBackdropFilter: "blur(40px) saturate(160%)",
                borderRadius: 24, padding: 32,
                position: "relative", overflow: "hidden",
                boxShadow: (item as any).featured
                  ? t.isDark
                    ? "0 0 80px rgba(160,178,215,0.10), 0 0 0 1px rgba(180,195,225,0.12)"
                    : "0 8px 48px rgba(100,118,158,0.12), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)"
                  : t.isDark
                    ? "none"
                    : "0 4px 24px rgba(100,118,158,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              {(item as any).featured && (
                <div style={{
                  position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(190,205,230,0.7), rgba(220,228,242,0.7), transparent)",
                }} />
              )}
              <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                {[...Array(5)].map((_, si) => (
                  <Star key={si} size={13} style={{ color: t.primary, fill: t.primary, opacity: 0.9 }} />
                ))}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: t.text, margin: "0 0 28px" }}>
                "{item.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9999, flexShrink: 0,
                  background: t.isDark ? "rgba(255,255,255,0.08)" : t.surface2,
                  border: `1px solid ${t.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: t.primary,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>{item.initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{item.name}</div>
                  <div style={{ fontSize: 13.5, color: t.textMuted }}>{item.title} · {item.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection({ theme }: { theme: Theme }) {
  const t = theme;
  const [open, setOpen] = useState<number | null>(null);
  const pill = (text: string) => (
    <span style={{
      display: "inline-block", padding: "6px 16px", borderRadius: 999,
      background: `${t.primary}18`, border: `1px solid ${t.primary}30`,
      color: t.primary, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase" as const, marginBottom: 20,
    }}>{text}</span>
  );

  return (
    <section style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          {pill("FAQ")}
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em", color: t.text }}>
            Everything you need to know.
          </h2>
          <p style={{ fontSize: 17, color: t.textMuted, maxWidth: 440, margin: "0 auto" }}>
            If you have a question not covered here, email us — we reply fast.
          </p>
        </div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{
              borderTop: `1px solid ${t.border}`,
              borderBottom: i === FAQ_ITEMS.length - 1 ? `1px solid ${t.border}` : "none",
            }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", padding: "22px 0", display: "flex",
                  justifyContent: "space-between", alignItems: "center",
                  background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 20,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: t.text, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4 }}>{item.q}</span>
                <span style={{
                  width: 24, height: 24, borderRadius: 9999, flexShrink: 0,
                  background: `${t.primary}10`, border: `1px solid ${t.primary}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: t.primary, fontSize: 18, lineHeight: 1,
                  transition: "transform 0.2s ease, background 0.2s",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                }}>+</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ fontSize: 15, lineHeight: 1.75, color: t.textMuted, margin: "0 0 24px", paddingRight: 44 }}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Widget Customizer ────────────────────────────────────────────────────────
function WidgetCustomizer({ theme }: { theme: Theme }) {
  const t = theme;
  const [config, setConfig] = useState<WidgetConfig>({
    brandName: "Acme Corp",
    logoText: "⚡",
    logoImage: "",
    brandColor: "#7C3AED",
    position: "right",
    widgetTheme: "light",
    greeting: "Hi! I'm your AI assistant. How can I help you today?",
  });
  const [widgetOpen, setWidgetOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    { role: "assistant", text: "Hi! I'm your AI assistant. How can I help you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatMessages(prev => {
      const updated = [...prev];
      updated[0] = { role: "assistant", text: config.greeting };
      return updated;
    });
  }, [config.greeting]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatTyping]);

  function getWidgetReply(msg: string): string {
    const lower = msg.toLowerCase();
    const brand = config.brandName || "us";
    if (/(hi|hello|hey)\b/.test(lower)) return `Hey there! 👋 How can I help you with ${brand} today?`;
    if (lower.includes("upgrade") || lower.includes("enterprise") || lower.includes("plan"))
      return `I can handle that right now! Want me to walk you through ${brand}'s plan options?`;
    if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing"))
      return `Plans start at $29/month. Want me to break down what's included at each tier?`;
    if (lower.includes("cancel") || lower.includes("refund"))
      return `Got it. Let me pull up your account so we can sort this out quickly.`;
    if (lower.includes("help") || lower.includes("support"))
      return `Absolutely! I'm here for anything on ${brand}. What do you need?`;
    return `Got it! Let me look into that for you. Is there anything else I can help with on ${brand}?`;
  }

  function sendChat() {
    const text = chatInput.trim();
    if (!text || chatTyping) return;
    setChatInput("");
    setChatMessages(m => [...m, { role: "user", text }]);
    setChatTyping(true);
    setTimeout(() => {
      setChatMessages(m => [...m, { role: "assistant", text: getWidgetReply(text) }]);
      setChatTyping(false);
    }, 700 + Math.random() * 500);
  }

  const set = (key: keyof WidgetConfig, val: string) =>
    setConfig(c => ({ ...c, [key]: val }));

  const wBg = config.widgetTheme === "dark" ? "#1C1C1E" : "#FFFFFF";
  const wText = config.widgetTheme === "dark" ? "#F5F5F5" : "#18181B";
  const wMuted = config.widgetTheme === "dark" ? "#8E8E93" : "#6B7280";
  const wBorder = config.widgetTheme === "dark" ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";
  const wSurface = config.widgetTheme === "dark" ? "#2C2C2E" : "#F4F4F5";

  const fieldLabel = (text: string) => (
    <div style={{ fontSize: 10.5, fontWeight: 700, color: t.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 7 }}>
      {text}
    </div>
  );

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
    background: t.isDark ? "rgba(255,255,255,0.06)" : t.surface2,
    border: `1px solid ${t.border}`, color: t.text, outline: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: "border-box" as const,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("logoImage", ev.target?.result as string ?? "");
    reader.readAsDataURL(file);
  };

  /* Avatar renders image if uploaded, else emoji/text */
  const Avatar = ({ size, fontSize }: { size: number; fontSize: number }) => (
    <div style={{
      width: size, height: size, borderRadius: 9999, flexShrink: 0,
      background: config.logoImage ? "none" : config.brandColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, color: "#fff", overflow: "hidden",
      transition: "background 0.25s ease",
    }}>
      {config.logoImage
        ? <img src={config.logoImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : (config.logoText?.[0] || "N")}
    </div>
  );

  return (
    <section style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{
            display: "inline-block", padding: "6px 16px", borderRadius: 999,
            background: `${t.primary}18`, border: `1px solid ${t.primary}30`,
            color: t.primary, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase" as const, marginBottom: 20,
          }}>Widget Customizer</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em", color: t.text }}>
            Make it yours. Instantly.
          </h2>
          <p style={{ fontSize: 17, color: t.textMuted, maxWidth: 500, margin: "0 auto" }}>
            Navigator blends into your product's design. Customise the look below — the preview and embed code update live.
          </p>
        </div>

        <div className="grid-customizer" style={{ display: "grid", gridTemplateColumns: "3fr 7fr", gap: 24, alignItems: "stretch" }}>

          {/* ── LEFT: Controls ── */}
          <div style={{
            background: t.isDark ? "rgba(255,255,255,0.03)" : "white",
            border: `1px solid ${t.border}`, borderRadius: 20, padding: "18px 20px",
            display: "flex", flexDirection: "column", gap: 16,
          }}>

              {/* Brand name */}
              <div>
                {fieldLabel("Brand Name")}
                <input value={config.brandName} onChange={e => set("brandName", e.target.value)} maxLength={28} placeholder="Your company name" style={inputBase} />
              </div>

              {/* Logo */}
              <div>
                {fieldLabel("Logo")}
                {/* Image upload row */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  {config.logoImage ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <img src={config.logoImage} alt="logo" style={{ width: 36, height: 36, borderRadius: 9999, objectFit: "cover", border: `2px solid ${t.primary}55` }} />
                      <button onClick={() => { set("logoImage", ""); if (fileInputRef.current) fileInputRef.current.value = ""; }} style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                        background: "transparent", border: `1px solid ${t.border}`, color: t.textMuted,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>Remove</button>
                      <button onClick={() => fileInputRef.current?.click()} style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                        background: `${t.primary}12`, border: `1px solid ${t.primary}40`, color: t.primary,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>Change</button>
                    </div>
                  ) : (
                    <button onClick={() => fileInputRef.current?.click()} style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "8px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer",
                      background: `${t.primary}10`, border: `1px solid ${t.primary}35`, color: t.primary,
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                    }}>
                      <Upload size={13} /> Upload image
                    </button>
                  )}
                </div>
                {/* Emoji presets + custom text (only when no image) */}
                {!config.logoImage && (
                  <>
                    <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
                      {["⚡", "🤖", "💬", "✨", "🔮", "🚀"].map(em => (
                        <button key={em} onClick={() => set("logoText", em)} style={{
                          width: 38, height: 38, borderRadius: 10, fontSize: 18, cursor: "pointer",
                          background: config.logoText === em ? `${t.primary}14` : (t.isDark ? "rgba(255,255,255,0.05)" : t.surface2),
                          border: `1px solid ${config.logoText === em ? t.primary + "50" : t.border}`,
                          transition: "all 0.15s",
                        }}>{em}</button>
                      ))}
                    </div>
                    <input value={config.logoText} onChange={e => set("logoText", e.target.value.slice(0, 3))} placeholder="or type custom…" style={{ ...inputBase, fontSize: 18 }} />
                  </>
                )}
              </div>

              {/* Brand color */}
              <div>
                {fieldLabel("Brand Colour")}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {COLOR_PRESETS.map(color => (
                    <button key={color} onClick={() => set("brandColor", color)} style={{
                      width: 30, height: 30, borderRadius: 9999, background: color,
                      border: `2px solid ${config.brandColor === color ? t.primary : "transparent"}`,
                      outline: config.brandColor === color ? `2px solid ${t.isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.22)"}` : "none",
                      outlineOffset: 2, cursor: "pointer", padding: 0, transition: "outline 0.15s, border 0.15s",
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="color" value={config.brandColor} onChange={e => set("brandColor", e.target.value)}
                    style={{ width: 38, height: 38, borderRadius: 9, border: `1px solid ${t.border}`, cursor: "pointer", padding: 3, background: "none", flexShrink: 0 }}
                  />
                  <input value={config.brandColor}
                    onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) set("brandColor", e.target.value); }}
                    style={{ ...inputBase, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "9px 12px" }}
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                {fieldLabel("Position")}
                <div style={{ display: "flex", gap: 8 }}>
                  {(["left", "right"] as const).map(pos => (
                    <button key={pos} onClick={() => set("position", pos)} style={{
                      flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer",
                      border: `1px solid ${config.position === pos ? t.primary + "55" : t.border}`,
                      background: config.position === pos ? `${t.primary}10` : "transparent",
                      color: config.position === pos ? t.primary : t.textMuted,
                      fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: "all 0.18s ease",
                    }}>
                      {pos === "left" ? "↙ Bottom Left" : "↘ Bottom Right"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Widget theme */}
              <div>
                {fieldLabel("Widget Theme")}
                <div style={{ display: "flex", gap: 8 }}>
                  {(["light", "dark"] as const).map(wt => (
                    <button key={wt} onClick={() => set("widgetTheme", wt)} style={{
                      flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer",
                      border: `1px solid ${config.widgetTheme === wt ? t.primary + "55" : t.border}`,
                      background: config.widgetTheme === wt ? `${t.primary}10` : "transparent",
                      color: config.widgetTheme === wt ? t.primary : t.textMuted,
                      fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: "all 0.18s ease",
                    }}>
                      {wt === "light" ? "○  Light" : "◑  Dark"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opening message */}
              <div>
                {fieldLabel("Opening Message")}
                <textarea value={config.greeting} onChange={e => set("greeting", e.target.value)} maxLength={120} rows={2}
                  style={{ ...inputBase, resize: "none", lineHeight: 1.55 } as React.CSSProperties}
                />
              </div>
            </div>


          {/* ── RIGHT: Large chat preview ── */}
          <div style={{
            background: t.isDark ? "rgba(255,255,255,0.02)" : "#EAECF2",
            border: `1px solid ${t.border}`, borderRadius: 20, overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}>
            {/* Chrome bar */}
            <div style={{
              padding: "11px 16px", borderBottom: `1px solid ${t.border}`,
              background: t.isDark ? "rgba(0,0,0,0.4)" : "white",
              display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: 9999, background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: t.isDark ? "rgba(255,255,255,0.07)" : t.surface2,
                borderRadius: 6, padding: "4px 12px", fontSize: 11,
                color: t.textFaint, fontFamily: "'JetBrains Mono', monospace", textAlign: "center",
              }}>
                {(config.brandName || "yourproduct").toLowerCase().replace(/\s+/g, "")}.com/dashboard
              </div>
              <div style={{ width: 52 }} />
            </div>

            {/* Page + widget area */}
            <div style={{ position: "relative", flex: 1 }}>
              {/* Faint page skeleton */}
              <div style={{ padding: "28px 32px", pointerEvents: "none", userSelect: "none" }}>
                <div style={{ opacity: 0.18 }}>
                  <div style={{ height: 16, background: t.text, borderRadius: 4, width: "28%", marginBottom: 10 }} />
                  <div style={{ height: 9, background: t.textMuted, borderRadius: 3, width: "55%", marginBottom: 6 }} />
                  <div style={{ height: 9, background: t.textMuted, borderRadius: 3, width: "40%", marginBottom: 22 }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{ height: 64, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderRadius: 8, border: `1px solid ${t.border}` }} />
                    ))}
                  </div>
                  <div style={{ marginTop: 20, height: 9, background: t.textMuted, borderRadius: 3, width: "72%" }} />
                  <div style={{ marginTop: 7, height: 9, background: t.textMuted, borderRadius: 3, width: "52%" }} />
                  <div style={{ marginTop: 7, height: 9, background: t.textMuted, borderRadius: 3, width: "64%" }} />
                </div>
              </div>

              {/* Chat window — large and prominent */}
              <AnimatePresence>
                {widgetOpen && (
                  <motion.div
                    key="chat-window"
                    initial={{ opacity: 0, y: 18, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute", bottom: 86,
                      [config.position]: 28,
                      width: 380, borderRadius: 20, overflow: "hidden",
                      boxShadow: `0 16px 56px rgba(0,0,0,0.28), 0 0 0 1px ${wBorder}`,
                      background: wBg, zIndex: 10,
                      transition: "background 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    {/* Widget header */}
                    <div style={{
                      padding: "14px 16px", background: config.brandColor,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      transition: "background 0.25s ease",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 9999,
                          background: config.logoImage ? "none" : "rgba(255,255,255,0.22)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 17, overflow: "hidden", flexShrink: 0,
                          transition: "background 0.25s ease",
                        }}>
                          {config.logoImage
                            ? <img src={config.logoImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : (config.logoText?.[0] || "N")}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{config.brandName || "Navigator"}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.72)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                            <span style={{ width: 6, height: 6, borderRadius: 9999, background: "#4ade80", display: "inline-block" }} />
                            Online now
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setWidgetOpen(false)} style={{
                        background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 9999,
                        width: 26, height: 26, cursor: "pointer", color: "#fff", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✕</button>
                    </div>

                    {/* Messages */}
                    <div ref={chatContainerRef} style={{
                      padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12,
                      overflowY: "auto", maxHeight: 420, flex: 1,
                    }}>
                      {chatMessages.map((msg, idx) => (
                        <motion.div key={idx}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          style={{ display: "flex", gap: 9, alignItems: "flex-end", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}
                        >
                          {msg.role === "assistant" && <Avatar size={28} fontSize={12} />}
                          <div style={{
                            background: msg.role === "user" ? config.brandColor : wSurface,
                            border: msg.role === "user" ? "none" : `1px solid ${wBorder}`,
                            borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                            padding: "10px 13px", fontSize: 13, lineHeight: 1.55,
                            color: msg.role === "user" ? "#fff" : wText, maxWidth: 220,
                            transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease",
                          }}>{msg.text}</div>
                        </motion.div>
                      ))}
                      {chatTyping && (
                        <div style={{ display: "flex", gap: 9, alignItems: "flex-end" }}>
                          <Avatar size={28} fontSize={12} />
                          <div style={{
                            background: wSurface, border: `1px solid ${wBorder}`,
                            borderRadius: "12px 12px 12px 3px",
                            padding: "10px 14px", display: "flex", gap: 4, alignItems: "center",
                          }}>
                            {[0, 1, 2].map(i => (
                              <motion.div key={i} style={{ width: 5, height: 5, borderRadius: 9999, background: wMuted }}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input bar */}
                    <div style={{ padding: "11px 14px", borderTop: `1px solid ${wBorder}`, transition: "border-color 0.25s ease", flexShrink: 0 }}>
                      <div style={{
                        display: "flex", gap: 8, padding: "9px 13px", alignItems: "center",
                        background: wSurface, borderRadius: 11, border: `1px solid ${wBorder}`,
                        transition: "background 0.25s ease, border-color 0.25s ease",
                      }}>
                        <input
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendChat()}
                          placeholder="Ask me anything…"
                          style={{
                            flex: 1, fontSize: 13, color: wText, background: "transparent",
                            border: "none", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        />
                        <button onClick={sendChat} style={{
                          width: 24, height: 24, borderRadius: 9999, background: config.brandColor,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          border: "none", cursor: "pointer", transition: "background 0.25s ease",
                        }}>
                          <ArrowRight size={12} color="#fff" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating bubble */}
              <div style={{ position: "absolute", bottom: 18, [config.position]: 20, zIndex: 11, transition: "left 0.3s ease, right 0.3s ease" }}>
                <motion.button
                  onClick={() => setWidgetOpen(o => !o)}
                  whileHover={{ scale: 1.09 }} whileTap={{ scale: 0.92 }}
                  style={{
                    width: 54, height: 54, borderRadius: 9999,
                    background: config.brandColor, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 6px 28px ${config.brandColor}66`,
                    fontSize: 22, color: "#fff",
                    transition: "background 0.25s ease, box-shadow 0.25s ease",
                    overflow: "hidden",
                  }}
                >
                  {widgetOpen
                    ? <span style={{ fontSize: 18 }}>✕</span>
                    : (config.logoImage
                        ? <img src={config.logoImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (config.logoText || "💬"))}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Observatory Background ───────────────────────────────────────────────────
// Deterministic star positions — no re-render jitter
const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: ((i * 2654435761 + 1013904223) >>> 0) % 10000 / 100,
  y: ((i * 1664525 + 1013904223) >>> 0) % 10000 / 100,
  size: i % 7 === 0 ? 1.5 : i % 3 === 0 ? 1.0 : 0.55,
  delay: (i * 0.19) % 5.5,
  duration: 2.2 + (i % 7) * 0.55,
}));

function ObservatoryField({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Light mode: cool silver-chrome gradient base */}
      {!theme.isDark && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(150deg, #DDE1EC 0%, #E4E9F5 35%, #DCEAF6 65%, #E8EDF6 100%)",
        }} />
      )}

      {/* Primary glow — top center, breathing */}
      <div style={{
        position: "absolute",
        top: theme.isDark ? "10%" : "-5%",
        left: "50%",
        transform: "translateX(-50%)",
        width: theme.isDark ? 1000 : 860,
        height: theme.isDark ? 900 : 760,
        background: theme.glow1,
        filter: `blur(${theme.isDark ? 140 : 110}px)`,
        borderRadius: "50%",
        animation: "orb-breathe 8s ease-in-out infinite",
      }} />

      {/* Secondary glow — bottom right, drifting */}
      <div style={{
        position: "absolute", bottom: "-10%", right: theme.isDark ? "-8%" : "-6%",
        width: theme.isDark ? 800 : 700,
        height: theme.isDark ? 750 : 620,
        background: theme.glow2,
        filter: `blur(${theme.isDark ? 160 : 140}px)`,
        borderRadius: "50%",
        animation: "orb-drift 11s ease-in-out infinite",
      }} />

      {/* Tertiary glow — mid left, drifting offset */}
      <div style={{
        position: "absolute", top: "30%", left: theme.isDark ? "-6%" : "-5%",
        width: theme.isDark ? 700 : 600,
        height: theme.isDark ? 650 : 540,
        background: theme.glow3,
        filter: `blur(${theme.isDark ? 160 : 130}px)`,
        borderRadius: "50%",
        animation: "orb-drift 14s ease-in-out 3s infinite",
      }} />

      {/* Quaternary glow — lower area */}
      {!theme.isDark && (
        <div style={{
          position: "absolute", top: "60%", right: "15%",
          width: 540, height: 460,
          background: "rgba(180,196,228,0.32)",
          filter: "blur(130px)", borderRadius: "50%",
          animation: "orb-drift 16s ease-in-out 6s infinite",
        }} />
      )}
      {theme.isDark && (
        <div style={{
          position: "absolute", top: "50%", right: "5%",
          width: 600, height: 520,
          background: "rgba(55,175,235,0.16)",
          filter: "blur(140px)", borderRadius: "50%",
          animation: "orb-drift 13s ease-in-out 5s infinite",
        }} />
      )}

      {/* Dark mode: starfield */}
      {theme.isDark && STARS.map((star, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${star.x}%`, top: `${star.y}%`,
          width: star.size, height: star.size,
          borderRadius: "50%",
          background: i % 5 === 0 ? "#A8E8FF" : "#FFFFFF",
          opacity: 0.2,
          animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
        }} />
      ))}

      {/* Grain texture — tactile premium feel */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: theme.isDark ? 0.045 : 0.03, pointerEvents: "none" }}>
        <filter id="grain-tex">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-tex)" />
      </svg>

      {/* Orbit rings — dark mode only */}
      {theme.isDark && (
        <svg viewBox="0 0 1000 1000" style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.055 }}>
          <circle cx="500" cy="500" r="250" fill="none" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="500" cy="500" r="450" fill="none" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="500" cy="500" r="650" fill="none" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="500" cy="500" r="850" fill="none" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="4 8" />
          <line x1="0" y1="500" x2="1000" y2="500" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="2 10" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="2 10" />
          <line x1="146" y1="146" x2="854" y2="854" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="2 10" />
          <line x1="146" y1="854" x2="854" y2="146" stroke={theme.textMuted} strokeWidth="1" strokeDasharray="2 10" />
        </svg>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("lunar-dark");
  const [pricingAnnual, setPricingAnnual] = useState(false);
  const t = THEMES[themeKey];

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: t.isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.70)",
    border: t.isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.90)",
    backdropFilter: "blur(40px) saturate(160%)",
    WebkitBackdropFilter: "blur(40px) saturate(160%)",
    boxShadow: t.isDark
      ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 8px 32px rgba(80,95,130,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
    borderRadius: 20,
    ...extra,
  });

  const gradText = (children: React.ReactNode, style?: React.CSSProperties) => (
    <span className={t.isDark ? "shimmer-dark" : "shimmer-light"} style={style}>{children}</span>
  );

  const container: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
  const sectionPad: React.CSSProperties = { padding: "96px 24px" };
  const pill = (text: string): React.ReactNode => (
    <span style={{
      display: "inline-block", padding: "6px 16px", borderRadius: 999,
      background: `${t.primary}18`, border: `1px solid ${t.primary}30`,
      color: t.primary, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase" as const, marginBottom: 20,
    }}>{text}</span>
  );

  const capabilities = [
    {
      icon: <FileCode size={22} />, title: "OpenAPI Intelligence",
      desc: "Upload any OpenAPI spec and Navigator auto-generates callable tools — endpoints, parameters, schemas, auth — no manual mapping required.",
      detail: ["// Auto-generated from your spec", "→  upgrade_subscription", "→  check_eligibility", "→  get_billing_history"],
      large: true,
    },
    {
      icon: <BookOpen size={22} />, title: "Knowledge Base Search",
      desc: "Semantic search across uploaded PDFs, URLs, and docs. Navigator retrieves exactly the right context before responding.",
    },
    {
      icon: <Zap size={22} />, title: "Action Execution",
      desc: "Navigator doesn't just answer — it acts. Calls your APIs on behalf of users with their auth tokens, completing tasks end-to-end.",
    },
    {
      icon: <Network size={22} />, title: "Page Navigation",
      desc: "Navigates users to the right page, highlights elements, and guides them through complex workflows inside your product.",
      detail: ["→  /dashboard/billing", "→  /settings/integrations", "→  /onboarding/step-3"],
      large: true,
    },
    {
      icon: <SlidersHorizontal size={22} />, title: "Choose Your Agent's Personality",
      desc: "Match your brand voice with custom instructions or predefined profiles.",
      large: true,
      customDetail: (
        <div style={{
          marginTop: 20, padding: "14px 16px", borderRadius: 10,
          background: t.isDark ? "rgba(255,255,255,0.04)" : t.surface2,
          border: `1px solid ${t.isDark ? "rgba(255,255,255,0.06)" : "#E4E4E7"}`,
        }}>
          {[
            { label: "Professional", selected: false },
            { label: "Friendly", selected: true },
            { label: "Technical", selected: false },
            { label: "Sales Assistant", selected: false },
            { label: "Customer Success", selected: false },
          ].map(opt => (
            <div key={opt.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
              <div style={{
                width: 16, height: 16, borderRadius: 9999, flexShrink: 0,
                border: `2px solid ${opt.selected ? t.accent1 : t.textFaint}`,
                background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {opt.selected && <div style={{ width: 7, height: 7, borderRadius: 9999, background: t.accent1 }} />}
              </div>
              <span style={{ fontSize: 13, color: opt.selected ? t.text : t.textMuted, fontWeight: opt.selected ? 600 : 400 }}>{opt.label}</span>
            </div>
          ))}
          <div style={{
            marginTop: 10, paddingTop: 10,
            borderTop: `1px solid ${t.isDark ? "rgba(255,255,255,0.08)" : "#E4E4E7"}`,
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 11.5, color: t.accent1, fontFamily: "'JetBrains Mono', monospace",
          }}>
            <Check size={11} strokeWidth={2.5} />
            Custom instructions enabled
          </div>
        </div>
      ),
    },
    {
      icon: <BarChart3 size={22} />, title: "Usage Analytics",
      desc: "Understand what users ask, which tools fire, where it fails. Full observability into your product intelligence layer.",
    },
  ];

  const comparisonRows = [
    { feature: "Time to deploy", navigator: "Under 30 minutes", inhouse: "3–6 months", legacy: "2–4 weeks" },
    { feature: "API-native intelligence", navigator: true, inhouse: "Build it", legacy: false },
    { feature: "Executes real actions", navigator: true, inhouse: "Build it", legacy: false },
    { feature: "Auto tool generation", navigator: true, inhouse: false, legacy: false },
    { feature: "Knowledge base search", navigator: true, inhouse: "Build it", legacy: "Partial" },
    { feature: "Multi-tenant isolation", navigator: true, inhouse: "Build it", legacy: false },
    { feature: "Maintenance overhead", navigator: "Minimal", inhouse: "Full eng team", legacy: "Support needed" },
    { feature: "Embed in 1 script tag", navigator: true, inhouse: false, legacy: "Partial" },
  ];

  const plans = [
    {
      name: "Starter", price: pricingAnnual ? 23 : 29, desc: "For indie developers and small teams getting started.",
      features: ["5 sites", "100,000 messages/mo", "5 knowledge base docs", "OpenAPI auto-generation", "Community support"],
      cta: "Start free", highlight: false,
    },
    {
      name: "Pro", price: pricingAnnual ? 79 : 99, desc: "For growing products that need scale and reliability.",
      features: ["25 sites", "1,000,000 messages/mo", "Unlimited knowledge base", "Advanced analytics", "Priority support", "Custom agent instructions"],
      cta: "Start free trial", highlight: true,
    },
    {
      name: "Enterprise", price: null, desc: "Custom pricing for teams that need complete control.",
      features: ["Unlimited sites", "Unlimited messages", "Custom LLM models", "SSO & SAML", "Dedicated support", "SLA guarantees", "On-premise option"],
      cta: "Talk to sales", highlight: false,
    },
  ];

  const howItWorks = [
    { step: "01", icon: <Upload size={20} />, title: "Upload your OpenAPI spec", desc: "Paste a URL or upload a .yaml / .json file. Navigator parses every endpoint, method, and schema automatically." },
    { step: "02", icon: <ToggleLeft size={20} />, title: "Review generated tools", desc: "Navigator creates callable tool definitions for each endpoint. Enable or disable tools with granular per-endpoint control." },
    { step: "03", icon: <BookOpen size={20} />, title: "Add a knowledge base", desc: "Upload PDFs, URLs, or Markdown docs. Navigator embeds them for semantic search, grounding answers in your actual content." },
    { step: "04", icon: <LayoutDashboard size={20} />, title: "Embed and go live", desc: "Add one script tag to your product. The agent is live — understanding your product, answering questions, and executing actions." },
  ];

  const securityItems = [
    { icon: <Database size={18} />, title: "Data Isolation", desc: "Per-tenant database-level isolation" },
    { icon: <Users size={18} />, title: "Role-Based Access", desc: "Granular permissions per team member" },
    { icon: <Eye size={18} />, title: "Full Audit Logs", desc: "Every action logged and traceable" },
    { icon: <Shield size={18} />, title: "AI Guardrails by LangProtect", desc: "Prevent prompt injection, jailbreaks, and unsafe agent behavior", langprotect: true },
    { icon: <Lock size={18} />, title: "Sensitive Data Protection", desc: "Automatically detect and block PII and confidential data exposure", langprotect: true },
    { icon: <BarChart3 size={18} />, title: "Runtime Threat Detection", desc: "Monitor conversations, tool calls, and agent actions in real time", langprotect: true },
  ];

  const archLayers = [
    { label: "Widget Layer", desc: "One script tag. Embeds in any web product — React, Vue, or plain HTML.", chips: ["Floating bubble UI", "agentBridge API", "Zero framework deps"] },
    { label: "Navigator Core", desc: "The agent loop. Builds context, routes tools, executes the intelligence.", chips: ["Context builder", "Tool router", "Agent loop (10 iterations max)"] },
    { label: "Tool Engine", desc: "Parses OpenAPI specs, generates tool definitions, routes to handlers.", chips: ["API handler", "KB search", "Navigation handler"] },
    { label: "Data Layer", desc: "Multi-tenant isolation at every level. Session, vector, and config stores.", chips: ["pgvector", "Redis sessions", "Postgres + Prisma"] },
  ];

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative" }}>
      <style>{GLOBAL_CSS}</style>

      <ObservatoryField theme={t} />

      {/* ── Aurora strip — iridescent top edge ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9999, pointerEvents: "none",
        background: t.isDark
          ? "linear-gradient(90deg, transparent 0%, rgba(88,236,255,0.4) 20%, rgba(180,220,255,0.85) 50%, rgba(88,236,255,0.4) 80%, transparent 100%)"
          : "linear-gradient(90deg, transparent 0%, rgba(130,150,200,0.5) 20%, rgba(200,215,245,0.9) 50%, rgba(130,150,200,0.5) 80%, transparent 100%)",
        animation: "aurora-pulse 3.5s ease-in-out infinite",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Theme Toggle ── */}
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          display: "flex", gap: 2, padding: "4px",
          background: t.isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderRadius: 12, border: `1px solid ${t.border}`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}>
          {(Object.keys(THEMES) as ThemeKey[]).map(key => {
            const active = key === themeKey;
            return (
              <button key={key} onClick={() => setThemeKey(key)} style={{
                padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: active ? t.text : "transparent",
                color: active ? (t.isDark ? "#000" : "#fff") : t.textMuted,
                fontSize: 11, fontWeight: 600, transition: "all 0.15s",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {THEMES[key].label}
              </button>
            );
          })}
        </div>

        {/* ── Navigation ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          padding: "0 24px",
          backdropFilter: "blur(48px) saturate(180%)",
          WebkitBackdropFilter: "blur(48px) saturate(180%)",
          borderBottom: t.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.65)",
          background: t.isDark ? "rgba(13,13,18,0.82)" : "rgba(242,240,255,0.78)",
          boxShadow: t.isDark ? "none" : "0 1px 0 rgba(255,255,255,0.9), 0 4px 24px rgba(80,95,130,0.05)",
        }}>
          <div style={{ ...container, padding: "0 24px", display: "flex", alignItems: "center", height: 64, gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: t.text,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Network size={15} color={t.isDark ? "#09090B" : "#ffffff"} />
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em" }}>Navigator</span>
            </div>

            <div className="nav-links" style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center" }}>
              {["Product", "How it works", "Pricing", "Docs"].map(link => (
                <a key={link} href="#" style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                  color: t.textMuted, textDecoration: "none", transition: "color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = t.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = t.textMuted)}
                >{link}</a>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
              <a href="#" style={{
                padding: "8px 16px", borderRadius: 9, fontSize: 14, fontWeight: 600,
                color: t.textMuted, textDecoration: "none",
              }}>Sign in</a>
              <a href="#" style={{
                padding: "8px 18px", borderRadius: 9, fontSize: 14, fontWeight: 700,
                color: t.buttonText, textDecoration: "none", background: t.buttonBg,
              }}>Start Free →</a>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{ paddingTop: 110, paddingBottom: 96 }}>
          <div className="grid-hero" style={{ width: "100%", maxWidth: "100%", padding: "0 56px", boxSizing: "border-box", display: "grid", gridTemplateColumns: "1fr 1.65fr", gap: 52, alignItems: "center" }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 style={{
                  fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontWeight: 800, lineHeight: 1.05,
                  letterSpacing: "-0.04em", margin: "0 0 24px",
                }}>
                  Give your users an agent,<br />{gradText("not a chatbot.")}
                </h1>

                <p style={{ fontSize: 18, lineHeight: 1.65, color: t.textMuted, marginBottom: 14, maxWidth: 460 }}>
                  Embed a product-aware AI agent with a single script tag. Navigator can:
                </p>

                <div style={{ marginBottom: 44, height: 34, display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 18, color: t.textFaint, marginRight: 8 }}>→</span>
                  <AnimatedPhrase
                    phrases={[
                      "answer any support question",
                      "execute real API actions",
                      "guide users step by step",
                      "upgrade subscriptions in chat",
                      "navigate users to the right page",
                    ]}
                    theme={t}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href="#" className="btn-primary" style={{
                    padding: "15px 30px", borderRadius: 14, fontSize: 15, fontWeight: 700,
                    color: t.buttonText, textDecoration: "none", background: t.buttonBg,
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: t.isDark
                      ? "0 0 40px rgba(88,236,255,0.12), 0 4px 20px rgba(0,0,0,0.5)"
                      : "0 8px 32px rgba(28,28,30,0.22), 0 2px 8px rgba(28,28,30,0.12)",
                  }}>
                    Start Free <ArrowRight size={16} />
                  </a>
                  <a href="#" style={{
                    padding: "15px 28px", borderRadius: 14, fontSize: 15, fontWeight: 600,
                    color: t.text, textDecoration: "none",
                    background: t.isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(24px) saturate(140%)",
                    WebkitBackdropFilter: "blur(24px) saturate(140%)",
                    border: t.isDark ? `1px solid rgba(255,255,255,0.1)` : `1px solid rgba(255,255,255,0.9)`,
                    boxShadow: t.isDark ? "none" : "0 4px 16px rgba(80,95,130,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    Watch it work <ChevronRight size={16} />
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div className="hide-mobile" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  display: "inline-block", padding: "4px 13px", borderRadius: 999,
                  background: `${t.primary}15`, border: `1px solid ${t.primary}25`,
                  color: t.primary, fontSize: 11, fontWeight: 600, letterSpacing: "0.07em",
                  textTransform: "uppercase" as const,
                }}>Live Demo</span>
                <span style={{ fontSize: 13, color: t.textMuted }}>Watch Navigator think and act</span>
              </div>
              <DemoSection theme={t} heroMode />
            </motion.div>
          </div>
        </section>

        {/* ── Marquee Social Proof ── */}
        <section style={{
          padding: "22px 0",
          borderTop: t.isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,32,50,0.10)",
          borderBottom: t.isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,32,50,0.10)",
          overflow: "hidden",
          background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.55)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {/* Sticky label */}
            <div style={{
              flexShrink: 0, paddingLeft: 40, paddingRight: 32,
              borderRight: t.isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(28,32,50,0.10)",
              marginRight: 32,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.10em",
              textTransform: "uppercase" as const,
              color: t.isDark ? "rgba(200,212,236,0.55)" : "rgba(28,32,50,0.45)",
              whiteSpace: "nowrap",
            }}>Trusted by</div>

            {/* Scrolling names */}
            <div style={{
              flex: 1, overflow: "hidden",
              maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}>
              <div style={{
                display: "flex", gap: 0, alignItems: "center",
                animation: "marquee 36s linear infinite",
                willChange: "transform", flexShrink: 0,
              }}>
                {[...COMPANY_NAMES, ...COMPANY_NAMES].map((name, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", userSelect: "none" }}>
                    <span style={{
                      fontSize: 13.5, fontWeight: 600,
                      color: t.isDark ? "rgba(200,212,236,0.82)" : "rgba(28,32,50,0.72)",
                      letterSpacing: "0.01em",
                      padding: "0 36px",
                    }}>{name}</span>
                    <span style={{
                      width: 3, height: 3, borderRadius: "50%", flexShrink: 0,
                      background: t.isDark ? "rgba(200,212,236,0.25)" : "rgba(28,32,50,0.22)",
                    }} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Problem Statement ── */}
        <section style={sectionPad}>
          <div style={container}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              {pill("The Problem")}
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
                Your product is powerful.<br />Your users don't know it.
              </h2>
              <p style={{ fontSize: 17, color: t.textMuted, maxWidth: 520, margin: "0 auto" }}>
                Documentation is ignored. Support tickets pile up. Users churn because they can't find what they need.
              </p>
            </div>

            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                {
                  icon: <Clock size={22} />,
                  title: "Hours wasted on support",
                  desc: "Users open tickets for things your product already does. Your team spends engineering time answering the same questions.",
                },
                {
                  icon: <TrendingUp size={22} />,
                  title: "Features go undiscovered",
                  desc: "You ship capabilities users never find. Complex workflows are abandoned halfway. The value is there — access is broken.",
                },
                {
                  icon: <Users size={22} />,
                  title: "Onboarding causes churn",
                  desc: "New users don't know where to start. Without guidance, they hit a wall and leave before experiencing your product's core value.",
                },
              ].map(item => (
                <div key={item.title} style={{ ...card({ padding: 32 }) }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, marginBottom: 20,
                    background: `${t.primary}10`, display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.primary,
                  }}>{item.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em" }}>{item.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: t.textMuted, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section style={{ padding: "80px 0", background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
          <div style={{ ...container, maxWidth: "min(1560px, calc(100vw - 32px))" }}>

            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              {pill("How It Works")}
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 14px", letterSpacing: "-0.03em" }}>
                From spec to {gradText("live intelligence")}<br />in four steps
              </h2>
              <p style={{ fontSize: 17, color: t.textMuted, margin: 0, lineHeight: 1.65, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                Upload your OpenAPI spec once. Navigator parses it, generates tools, and lets your agent execute real actions.
              </p>
            </div>

            <PipelineCards theme={t} steps={howItWorks} />

          </div>
        </section>

        {/* ── Widget Customizer ── */}
        <WidgetCustomizer theme={t} />

        {/* ── Core Capabilities (Bento) ── */}
        <section style={{ ...sectionPad, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
          <div style={container}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              {pill("Capabilities")}
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
                Not a chatbot. A {gradText("product intelligence layer")}.
              </h2>
              <p style={{ fontSize: 17, color: t.textMuted, maxWidth: 500, margin: "0 auto" }}>
                Navigator understands your product's structure, surfaces its knowledge, and executes actions on behalf of your users.
              </p>
            </div>

            <div className="grid-caps" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {capabilities.map((cap, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }} viewport={{ once: true }}
                  style={{
                    ...card({
                      padding: cap.large ? 32 : 28,
                      gridColumn: cap.large ? "span 2" : "span 1",
                      display: "flex", flexDirection: "column",
                    } as React.CSSProperties),
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = t.isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 50px ${t.glowSubtle}`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = t.isDark ? "rgba(255,255,255,0.08)" : "#E4E4E7";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, marginBottom: 16,
                    background: t.text, display: "flex", alignItems: "center",
                    justifyContent: "center", color: t.isDark ? "#09090B" : "#fff",
                  }}>{cap.icon}</div>
                  <h3 style={{ fontSize: cap.large ? 17 : 16, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>{cap.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: t.textMuted, margin: 0 }}>{cap.desc}</p>
                  {cap.large && (cap as { customDetail?: React.ReactNode }).customDetail}
                  {cap.large && !('customDetail' in cap) && cap.detail && (
                    <div style={{
                      marginTop: 20, padding: "12px 14px", borderRadius: 10,
                      background: t.isDark ? "rgba(255,255,255,0.04)" : t.surface2,
                      border: `1px solid ${t.isDark ? "rgba(255,255,255,0.06)" : "#E4E4E7"}`,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.7,
                    }}>
                      {cap.detail.map((line, li) => (
                        <div key={li} style={{ color: li === 0 ? t.textMuted : t.primary }}>{line}</div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Built for Scale ── */}
        <ScaleSection theme={t} />

        {/* ── Testimonials ── */}
        <TestimonialsSection theme={t} />


        {/* ── Comparison ── */}
        <section style={sectionPad}>
          <div style={container}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              {pill("Why Navigator")}
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
                The fastest path to {gradText("embedded AI")}
              </h2>
            </div>

            <div style={{ ...card({ overflow: "hidden" }) }}>
              <table className="comparison-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: t.textMuted, width: "30%" }}> </th>
                    {[
                      { name: "Navigator", highlight: true },
                      { name: "Build In-House", highlight: false },
                      { name: "Legacy Chatbot", highlight: false },
                    ].map(col => (
                      <th key={col.name} style={{
                        padding: "16px 24px", textAlign: "center", fontSize: 14, fontWeight: 700,
                        color: col.highlight ? t.primary : t.text,
                        background: col.highlight ? `${t.primary}06` : "transparent",
                        borderLeft: `1px solid ${t.border}`,
                      }}>{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < comparisonRows.length - 1 ? `1px solid ${t.border}` : "none" }}>
                      <td style={{ padding: "14px 24px", fontSize: 14, color: t.textMuted }}>{row.feature}</td>
                      {[
                        { val: row.navigator, highlight: true },
                        { val: row.inhouse, highlight: false },
                        { val: row.legacy, highlight: false },
                      ].map((cell, j) => (
                        <td key={j} style={{
                          padding: "14px 24px", textAlign: "center",
                          background: cell.highlight ? `${t.primary}04` : "transparent",
                          borderLeft: `1px solid ${t.border}`,
                        }}>
                          {cell.val === true
                            ? <Check size={16} style={{ color: t.primary, display: "inline" }} />
                            : cell.val === false
                            ? <X size={16} style={{ color: t.textFaint, display: "inline" }} />
                            : <span style={{ fontSize: 13, color: cell.highlight ? t.primary : t.textMuted, fontWeight: cell.highlight ? 600 : 400 }}>{cell.val as string}</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Security ── */}
        <section style={{ ...sectionPad, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
          <div style={container}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              {pill("Security")}
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
                Enterprise-grade {gradText("security")} by default
              </h2>
              <p style={{ fontSize: 17, color: t.textMuted, maxWidth: 480, margin: "0 auto" }}>
                Security isn't a feature — it's the foundation. Every tenant is isolated. Every action is logged.
              </p>
            </div>

            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {securityItems.map((item, i) => {
                const lp = (item as any).langprotect as boolean | undefined;
                return (
                  <div key={i} style={{
                    ...card({ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 0 }),
                    ...(lp ? {
                      border: t.isDark ? "1px solid rgba(88,236,255,0.13)" : "1px solid rgba(30,79,170,0.15)",
                    } : {}),
                  }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        background: lp
                          ? (t.isDark ? "rgba(88,236,255,0.10)" : "rgba(30,79,170,0.09)")
                          : `${t.primary}12`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: lp ? t.accent1 : t.primary,
                      }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{item.title}</div>
                        <div style={{ fontSize: 14.5, color: t.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                    {lp && (
                      <div style={{
                        marginTop: "auto", paddingTop: 14, marginBlockStart: "auto",
                        borderTop: t.isDark ? "1px solid rgba(88,236,255,0.12)" : "1px solid rgba(30,79,170,0.12)",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <img
                          src="https://www.langprotect.com/favicon.ico"
                          alt="LangProtect"
                          style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, objectFit: "contain" }}
                        />
                        <a
                          href="https://www.langprotect.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 11.5, fontWeight: 700,
                            color: t.isDark ? "rgba(88,236,255,0.85)" : "rgba(20,58,140,0.80)",
                            letterSpacing: "0.04em", textDecoration: "none",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = t.accent1)}
                          onMouseLeave={e => (e.currentTarget.style.color = t.isDark ? "rgba(88,236,255,0.85)" : "rgba(20,58,140,0.80)")}
                        >Powered by LangProtect</a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Developer Experience ── */}
        <section style={sectionPad}>
          <div style={container}>
            <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
              <div>
                {pill("Developer Experience")}
                <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
                  One script tag.<br />{gradText("Infinite intelligence.")}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: t.textMuted, marginBottom: 32 }}>
                  Embed Navigator in any web product in minutes. Works with React, Vue, Angular, or plain HTML — no dependencies required.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { icon: <Package size={16} />, label: "One-Line Installation", desc: "Deploy an AI agent with a single script tag." },
                    { icon: <Braces size={16} />, label: "Automatic API Tool Discovery", desc: "Import an OpenAPI spec and expose endpoints as agent tools instantly." },
                    { icon: <SlidersHorizontal size={16} />, label: "Full Dashboard Control", desc: "Customize prompts, behavior, tools, permissions, and branding without code." },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", gap: 14 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 1,
                        background: `${t.primary}12`, display: "flex", alignItems: "center", justifyContent: "center",
                        color: t.primary,
                      }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 14.5, color: t.textMuted }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...card({ overflow: "hidden" }), boxShadow: `0 0 80px ${t.glowSubtle}` }}>
                <div style={{
                  padding: "12px 16px", borderBottom: `1px solid ${t.border}`,
                  background: t.surface2, display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
                      <div key={i} style={{ width: 11, height: 11, borderRadius: 9999, background: c }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: t.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>embed.html</span>
                </div>
                <div style={{ padding: "24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, lineHeight: 1.8 }}>
                  {[
                    { text: "<!-- Add to your ", color: t.textFaint },
                    { text: "<head>", color: t.secondary },
                    { text: " tag -->", color: t.textFaint },
                    { text: "\n<script", color: t.primary },
                    { text: "\n  src", color: t.textMuted },
                    { text: '="https://cdn.navigator.ai/widget.js"', color: t.textFaint },
                    { text: "\n  data-api-key", color: t.textMuted },
                    { text: '="nav_live_xxxxxxxx"', color: t.textFaint },
                    { text: "\n  data-site-id", color: t.textMuted },
                    { text: '="site_89124"', color: t.textFaint },
                    { text: "\n></", color: t.primary },
                    { text: "script", color: t.primary },
                    { text: ">", color: t.primary },
                    { text: "\n\n<!-- Agent is now live. That's it. -->", color: t.textFaint },
                  ].map((part, i) => (
                    <span key={i} style={{ color: part.color, whiteSpace: "pre" }}>{part.text}</span>
                  ))}
                </div>
                <div style={{
                  padding: "12px 16px", borderTop: `1px solid ${t.border}`,
                  background: `${t.primary}06`,
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, color: t.primary, fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <CheckCircle2 size={13} />
                  Agent connected · 3 tools loaded · KB indexed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section style={{ ...sectionPad, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
          <div style={container}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              {pill("Pricing")}
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 24px", letterSpacing: "-0.03em" }}>
                Simple, honest {gradText("pricing")}
              </h2>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 2, padding: "4px",
                background: t.isDark ? "rgba(255,255,255,0.06)" : t.bg,
                border: `1px solid ${t.border}`, borderRadius: 12,
              }}>
                <button onClick={() => setPricingAnnual(false)} style={{
                  padding: "7px 18px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: !pricingAnnual ? t.text : "transparent",
                  color: !pricingAnnual ? (t.isDark ? "#09090B" : "#fff") : t.textMuted,
                  fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: "all 0.15s",
                }}>Monthly</button>
                <button onClick={() => setPricingAnnual(true)} style={{
                  padding: "7px 18px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: pricingAnnual ? t.text : "transparent",
                  color: pricingAnnual ? (t.isDark ? "#09090B" : "#fff") : t.textMuted,
                  fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: "all 0.15s",
                }}>
                  Annual
                  <span style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 999,
                    background: pricingAnnual ? "rgba(255,255,255,0.2)" : `${t.primary}18`,
                    color: pricingAnnual ? (t.isDark ? "#09090B" : "#fff") : t.primary, fontWeight: 700,
                  }}>–20%</span>
                </button>
              </div>
            </div>

            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
              {plans.map((plan, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
                  style={{
                    ...card({
                      padding: 32,
                      border: plan.highlight
                        ? t.isDark ? `1.5px solid rgba(200,212,235,0.20)` : `1.5px solid rgba(148,162,195,0.45)`
                        : `1px solid ${t.border}`,
                      boxShadow: plan.highlight
                        ? t.isDark
                          ? `0 0 0 1px rgba(180,195,225,0.12), 0 24px 80px rgba(0,0,0,0.4), 0 0 80px rgba(160,178,215,0.10)`
                          : `0 0 0 1px rgba(148,162,195,0.18), 0 24px 80px rgba(100,118,158,0.14), inset 0 1px 0 rgba(255,255,255,0.95)`
                        : t.isDark ? "none" : `0 4px 24px rgba(100,118,158,0.07), inset 0 1px 0 rgba(255,255,255,0.9)`,
                      position: "relative", overflow: "hidden",
                    }),
                  }}
                >
                  {plan.highlight && (
                    <div style={{
                      position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(190,205,230,0.75), rgba(220,228,242,0.75), transparent)",
                    }} />
                  )}
                  {plan.highlight && (
                    <div style={{
                      position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 999, background: t.text,
                      color: t.isDark ? "#09090B" : "#fff",
                    }}>Most popular</div>
                  )}

                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                      {plan.price !== null ? (
                        <>
                          <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em" }}>${plan.price}</span>
                          <span style={{ fontSize: 14, color: t.textMuted }}>/month</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" }}>Custom</span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, color: t.textMuted, margin: 0, lineHeight: 1.5 }}>{plan.desc}</p>
                  </div>

                  <a href="#" style={{
                    display: "block", padding: "12px 20px", borderRadius: 11, marginBottom: 28,
                    textAlign: "center", fontSize: 14, fontWeight: 700, textDecoration: "none",
                    background: plan.highlight ? t.buttonBg : "transparent",
                    color: plan.highlight ? t.buttonText : t.text,
                    border: plan.highlight ? "none" : `1px solid ${t.border}`,
                  }}>{plan.cta}</a>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <Check size={15} style={{ color: t.primary, flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 14.5, color: t.textMuted }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: t.textFaint }}>
              All plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQSection theme={t} />

        {/* ── Final CTA ── */}
        <section style={{ ...sectionPad, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
          <div style={container}>
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }}
              style={{
                textAlign: "center", padding: "100px 40px", borderRadius: 28,
                background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)",
                backdropFilter: "blur(40px) saturate(160%)",
                WebkitBackdropFilter: "blur(40px) saturate(160%)",
                border: t.isDark ? `1px solid rgba(255,255,255,0.08)` : `1px solid rgba(255,255,255,0.92)`,
                boxShadow: t.isDark ? "none" : "0 24px 80px rgba(80,95,130,0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
                width: 700, height: 500,
                background: `radial-gradient(ellipse, ${t.glow1} 0%, transparent 65%)`,
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: "60%", left: "30%", transform: "translate(-50%, -50%)",
                width: 500, height: 400,
                background: `radial-gradient(ellipse, ${t.glow2} 0%, transparent 65%)`,
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: "40%", left: "70%", transform: "translate(-50%, -50%)",
                width: 500, height: 400,
                background: `radial-gradient(ellipse, ${t.glow3} 0%, transparent 65%)`,
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative" }}>
                <span style={{
                  display: "inline-block", padding: "6px 16px", borderRadius: 999,
                  background: `${t.primary}15`, border: `1px solid ${t.primary}25`,
                  color: t.primary, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", marginBottom: 28,
                }}>Get started today</span>

                <h2 style={{
                  fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1,
                  letterSpacing: "-0.04em", margin: "0 0 20px",
                }}>
                  Your product deserves<br />
                  {gradText("intelligent agents")}
                </h2>

                <p style={{ fontSize: 18, color: t.textMuted, maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.65 }}>
                  Join 50+ product teams who've turned their APIs into intelligent agents. No engineering sprint required.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
                  <a href="#" style={{
                    padding: "16px 36px", borderRadius: 14, fontSize: 16, fontWeight: 700,
                    color: t.buttonText, textDecoration: "none", background: t.buttonBg,
                    display: "flex", alignItems: "center", gap: 10,
                    boxShadow: t.isDark ? "0 0 60px rgba(255,255,255,0.12)" : "0 8px 32px rgba(0,0,0,0.18)",
                  }}>
                    Start Free — No credit card <ArrowRight size={18} />
                  </a>
                  <a href="#" style={{
                    padding: "16px 32px", borderRadius: 14, fontSize: 16, fontWeight: 600,
                    color: t.text, textDecoration: "none",
                    background: t.isDark ? "rgba(255,255,255,0.05)" : "white",
                    border: `1px solid ${t.border}`,
                  }}>
                    Book a Demo
                  </a>
                </div>

                <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
                  {["30-minute setup", "OpenAPI auto-generation", "14-day free trial", "Cancel anytime"].map(item => (
                    <span key={item} style={{ fontSize: 13, color: t.textFaint, display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={13} style={{ color: t.textMuted }} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: `1px solid ${t.border}`, padding: "72px 24px 48px" }}>
          <div style={container}>
            <div className="grid-footer" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: t.text,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Network size={13} color={t.isDark ? "#09090B" : "#ffffff"} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.03em" }}>Navigator</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: t.textMuted, maxWidth: 260, margin: "0 0 24px" }}>
                  The AI agent platform that turns any web product into an intelligent assistant. Ship in 30 minutes.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 9999, background: t.primary, opacity: 0.7 }} />
                  <span style={{ fontSize: 12, color: t.textFaint }}>All systems operational</span>
                </div>
              </div>

              {[
                {
                  title: "Product",
                  links: ["Overview", "Pricing", "Changelog", "Status", "Roadmap"],
                },
                {
                  title: "Developers",
                  links: ["Documentation", "API Reference", "TypeScript SDK", "Widget Guide", "Examples"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers", "Press", "Contact"],
                },
                {
                  title: "Legal",
                  links: ["Privacy", "Terms", "Security", "Cookies", "DPA"],
                },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: t.primary, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {col.title}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {col.links.map(link => (
                      <a key={link} href="#" style={{
                        fontSize: 14, color: t.textMuted, textDecoration: "none", transition: "color 0.15s",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = t.text)}
                        onMouseLeave={e => (e.currentTarget.style.color = t.textMuted)}
                      >{link}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontSize: 13, color: t.textFaint }}>© 2024 Navigator AI, Inc. All rights reserved.</span>
              <div style={{ display: "flex", gap: 20 }}>
                {["Twitter / X", "GitHub", "LinkedIn"].map(link => (
                  <a key={link} href="#" style={{
                    fontSize: 13, color: t.textFaint, textDecoration: "none", transition: "color 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = t.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = t.textFaint)}
                  >{link}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
