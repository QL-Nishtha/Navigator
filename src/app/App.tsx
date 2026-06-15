import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, Check, X, Zap, Shield, Lock, Database, Globe, Network,
  BarChart3, Settings2, FileCode, Eye,
  BookOpen, GitBranch, Package, ChevronRight,
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
    bg: "#0D0D12", surface: "rgba(255,255,255,0.07)", surface2: "rgba(255,255,255,0.04)",
    primary: "#FFFFFF", secondary: "#EBEBF5", accent: "#FFFFFF",
    accent1: "#A855F7", accent2: "#60A5FA", accent3: "#14B8A6",
    gradient: "linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.55) 100%)",
    text: "#FFFFFF", textMuted: "rgba(235,235,245,0.6)", textFaint: "rgba(235,235,245,0.22)",
    border: "rgba(255,255,255,0.1)",
    glowStrong: "rgba(255,255,255,0.15)", glowSubtle: "rgba(255,255,255,0.05)",
    glow1: "rgba(168,85,247,0.24)", glow2: "rgba(96,165,250,0.20)", glow3: "rgba(20,184,166,0.16)",
    buttonBg: "#FFFFFF", buttonText: "#0D0D12", buttonHoverBg: "#E4E4E7",
  },
  "lunar-light": {
    key: "lunar-light", label: "Light", isDark: false,
    bg: "#F2F0FF", surface: "rgba(255,255,255,0.58)", surface2: "rgba(255,255,255,0.82)",
    primary: "#1C1C1E", secondary: "#3C3C43", accent: "#1C1C1E",
    accent1: "#7C3AED", accent2: "#2563EB", accent3: "#0D9488",
    gradient: "linear-gradient(135deg, #1C1C1E 0%, rgba(28,28,30,0.5) 100%)",
    text: "#1C1C1E", textMuted: "rgba(60,60,67,0.65)", textFaint: "rgba(60,60,67,0.28)",
    border: "rgba(255,255,255,0.88)",
    glowStrong: "rgba(0,0,0,0.08)", glowSubtle: "rgba(0,0,0,0.03)",
    glow1: "rgba(124,58,237,0.38)", glow2: "rgba(37,99,235,0.28)", glow3: "rgba(13,148,136,0.22)",
    buttonBg: "#1C1C1E", buttonText: "#FFFFFF", buttonHoverBg: "#3A3A3C",
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
  .orbit-node-dark {
    transition: box-shadow 0.3s ease, transform 0.25s ease;
  }
  .orbit-node-dark:hover {
    box-shadow: 0 0 0 1px rgba(168,85,247,0.22), 0 0 24px rgba(168,85,247,0.38), 0 0 52px rgba(96,165,250,0.18);
    transform: scale(1.06);
  }
  .orbit-node-light {
    transition: box-shadow 0.3s ease, transform 0.25s ease;
  }
  .orbit-node-light:hover {
    box-shadow: 0 0 0 1px rgba(124,58,237,0.2), 0 0 20px rgba(124,58,237,0.28), 0 0 44px rgba(37,99,235,0.14);
    transform: scale(1.06);
  }
  * { scrollbar-width: none; -ms-overflow-style: none; box-sizing: border-box; }
  *::-webkit-scrollbar { display: none; }
  html { scroll-behavior: smooth; }
  body { transition: background-color 0.3s ease; }
  ::selection { background: rgba(139,92,246,0.3); }
  .glass-pill {
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
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

// ─── Hero Visualization ───────────────────────────────────────────────────────
function HeroViz({ theme }: { theme: Theme }) {
  const nodes = [
    { label: "User Intent", sub: '"Upgrade to Enterprise"', step: "01" },
    { label: "Knowledge Search", sub: "2,400 docs indexed", step: "02" },
    { label: "Tool Selection", sub: "upgrade_subscription", step: "03" },
    { label: "API Execution", sub: "POST /v1/subscriptions", step: "04" },
    { label: "Action Complete", sub: "Enterprise plan active", step: "✓", isLast: true },
  ];

  const centers: [number, number][] = [
    [250, 50], [158, 168], [342, 286], [158, 404], [250, 504],
  ];

  const paths = [
    "M 250 76 C 218 116 190 116 158 142",
    "M 158 194 C 198 234 302 234 342 260",
    "M 342 312 C 302 352 198 352 158 378",
    "M 158 430 C 190 462 222 480 250 480",
  ];

  const pkf = [
    { cx: [250, 204, 158] as number[], cy: [76, 114, 142] as number[] },
    { cx: [158, 250, 342] as number[], cy: [194, 234, 260] as number[] },
    { cx: [342, 250, 158] as number[], cy: [312, 352, 378] as number[] },
    { cx: [158, 204, 250] as number[], cy: [430, 464, 480] as number[] },
  ];

  const NW = 208, NH = 50;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 500, margin: "0 auto" }}>
      <div style={{
        position: "absolute", top: "15%", left: "5%", right: "5%", bottom: "15%",
        background: `radial-gradient(ellipse at center, ${theme.glow2} 0%, transparent 65%)`,
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "20%", left: "15%", right: "15%", bottom: "20%",
        background: `radial-gradient(ellipse at center, ${theme.glow1} 0%, transparent 65%)`,
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <svg viewBox="0 0 500 554" style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id={`lg-${theme.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.primary} stopOpacity="0.95" />
            <stop offset="50%" stopColor={theme.secondary} stopOpacity="0.95" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0.95" />
          </linearGradient>
          <filter id={`gf-${theme.key}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {paths.map((d, i) => (
          <path key={`glow-${i}`} d={d} stroke={theme.primary} strokeWidth="5"
            fill="none" strokeOpacity="0.06" strokeLinecap="round" />
        ))}

        {paths.map((d, i) => (
          <path key={`path-${i}`} d={d}
            stroke={`url(#lg-${theme.key})`} strokeWidth="1.5"
            fill="none" strokeDasharray="5 4" strokeLinecap="round"
            style={{ animation: `nav-flow ${1.6 + i * 0.12}s linear infinite ${i * 0.3}s` }}
          />
        ))}

        {pkf.map((kf, i) => (
          <motion.circle key={`p1-${i}`} r={3.5}
            fill={i % 2 === 0 ? theme.accent1 : theme.accent2}
            animate={{ cx: kf.cx, cy: kf.cy, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2 + i * 0.25, repeat: Infinity, delay: i * 0.4, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${i % 2 === 0 ? theme.accent1 : theme.accent2})` }}
          />
        ))}
        {pkf.map((kf, i) => (
          <motion.circle key={`p2-${i}`} r={2}
            fill={theme.accent3}
            animate={{ cx: kf.cx, cy: kf.cy, opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: 2 + i * 0.25, repeat: Infinity, delay: i * 0.4 + 1, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${theme.accent3})` }}
          />
        ))}

        {nodes.map((node, i) => {
          const [cx, cy] = centers[i];
          const nx = cx - NW / 2, ny = cy - NH / 2;
          const r = NH / 2;
          const isLast = node.isLast;

          return (
            <g key={i}>
              {isLast && (
                <>
                  <rect x={nx - 8} y={ny - 8} width={NW + 16} height={NH + 16}
                    rx={r + 8} fill={theme.primary} fillOpacity="0.06" />
                  <rect x={nx - 3} y={ny - 3} width={NW + 6} height={NH + 6}
                    rx={r + 3} fill="none" stroke={theme.primary} strokeWidth="1"
                    strokeOpacity="0.25" />
                </>
              )}

              <rect x={nx} y={ny} width={NW} height={NH} rx={r}
                fill={theme.surface}
                stroke={isLast ? theme.primary : theme.border}
                strokeWidth={isLast ? 1.5 : 1}
                filter={isLast ? `url(#gf-${theme.key})` : undefined}
              />

              <circle cx={nx + r} cy={cy} r={r * 0.58}
                fill={theme.primary} fillOpacity={isLast ? 0.22 : 0.08}
              />

              <text x={nx + r} y={cy + 4}
                fill={isLast ? theme.primary : theme.textMuted}
                fontSize="9.5" fontWeight="700" textAnchor="middle"
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >{node.step}</text>

              <text x={nx + r * 2 + 6} y={cy - 7}
                fill={isLast ? theme.primary : theme.text}
                fontSize="10.5" fontWeight="600"
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >{node.label}</text>

              <text x={nx + r * 2 + 6} y={cy + 8}
                fill={theme.textFaint} fontSize="9"
                fontFamily="'JetBrains Mono', monospace"
              >{node.sub}</text>
            </g>
          );
        })}

        <motion.circle cx={250} cy={504} r={30} fill="none"
          stroke={theme.accent1} strokeWidth="1"
          animate={{ r: [28, 52], opacity: [0.5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.circle cx={250} cy={504} r={30} fill="none"
          stroke={theme.accent2} strokeWidth="1"
          animate={{ r: [28, 52], opacity: [0.35, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
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

function DemoSection({ theme }: { theme: Theme }) {
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

  return (
    <section id="demo-section" style={{ padding: "96px 24px", backgroundColor: theme.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", padding: "6px 16px", borderRadius: 999,
            background: `${theme.primary}18`, border: `1px solid ${theme.primary}30`,
            color: theme.primary, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 20,
          }}>Live Demo</span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", color: theme.text }}>
            Watch Navigator think and act
          </h2>
          <p style={{ fontSize: 17, color: theme.textMuted, maxWidth: 500, margin: "0 auto" }}>
            Real tool calls. Real API execution. Not scripted — this is the actual agent loop running live.
          </p>
        </div>

        <div style={{
          background: theme.isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(40px) saturate(160%)",
          WebkitBackdropFilter: "blur(40px) saturate(160%)",
          border: theme.isDark ? `1px solid rgba(255,255,255,0.1)` : `1px solid rgba(255,255,255,0.9)`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: theme.isDark
            ? `0 40px 80px rgba(0,0,0,0.5)`
            : `0 24px 80px rgba(80,40,180,0.1), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)`,
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

          <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 440 }}>
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
                      fontSize: 13.5, lineHeight: 1.55, color: theme.text,
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

              <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Tools called", val: totalTools.toString() },
                  { label: "Total latency", val: totalLatency > 0 ? `${totalLatency}ms` : "—" },
                  { label: "Auth method", val: "Bearer JWT" },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 10, color: theme.textFaint, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: "'JetBrains Mono', monospace" }}>{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
                    ? "0 0 80px rgba(168,85,247,0.08), 0 0 0 1px rgba(168,85,247,0.1)"
                    : "0 8px 48px rgba(124,58,237,0.12), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)"
                  : t.isDark
                    ? "none"
                    : "0 4px 24px rgba(80,40,180,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              {(item as any).featured && (
                <div style={{
                  position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.45), rgba(96,165,250,0.45), transparent)",
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
                  <div style={{ fontSize: 12, color: t.textMuted }}>{item.title} · {item.company}</div>
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
    <section style={{ padding: "96px 24px", background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
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
    brandColor: "#7C3AED",
    position: "right",
    widgetTheme: "light",
    greeting: "Hi! I'm your AI assistant. How can I help you today?",
  });
  const [widgetOpen, setWidgetOpen] = useState(true);

  const set = (key: keyof WidgetConfig, val: string) =>
    setConfig(c => ({ ...c, [key]: val }));

  const wBg = config.widgetTheme === "dark" ? "#1C1C1E" : "#FFFFFF";
  const wText = config.widgetTheme === "dark" ? "#F5F5F5" : "#18181B";
  const wMuted = config.widgetTheme === "dark" ? "#8E8E93" : "#6B7280";
  const wBorder = config.widgetTheme === "dark" ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";
  const wSurface = config.widgetTheme === "dark" ? "#2C2C2E" : "#F4F4F5";

  const fieldLabel = (text: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 9 }}>
      {text}
    </div>
  );

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
    background: t.isDark ? "rgba(255,255,255,0.06)" : t.surface2,
    border: `1px solid ${t.border}`, color: t.text, outline: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: "border-box" as const,
  };

  return (
    <section style={{ padding: "96px 24px", background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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

        <div className="grid-customizer" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" }}>

          {/* ── Controls panel ── */}
          <div style={{
            background: t.isDark ? "rgba(255,255,255,0.03)" : "white",
            border: `1px solid ${t.border}`, borderRadius: 20, padding: 24,
            display: "flex", flexDirection: "column", gap: 22,
          }}>

            {/* Brand name */}
            <div>
              {fieldLabel("Brand Name")}
              <input value={config.brandName} onChange={e => set("brandName", e.target.value)} maxLength={28} placeholder="Your company name" style={inputBase} />
            </div>

            {/* Logo / emoji */}
            <div>
              {fieldLabel("Logo — emoji or initials")}
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
                    transition: "all 0.15s",
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
                    transition: "all 0.15s",
                  }}>
                    {wt === "light" ? "○  Light" : "◑  Dark"}
                  </button>
                ))}
              </div>
            </div>

            {/* Opening message */}
            <div>
              {fieldLabel("Opening Message")}
              <textarea value={config.greeting} onChange={e => set("greeting", e.target.value)} maxLength={120} rows={3}
                style={{ ...inputBase, resize: "none", lineHeight: 1.55 } as React.CSSProperties}
              />
            </div>
          </div>

          {/* ── Preview + code ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Browser preview */}
            <div style={{
              background: t.isDark ? "rgba(255,255,255,0.02)" : "#EBEBEB",
              border: `1px solid ${t.border}`, borderRadius: 20, overflow: "hidden",
            }}>
              {/* Chrome bar */}
              <div style={{
                padding: "11px 16px", borderBottom: `1px solid ${t.border}`,
                background: t.isDark ? "rgba(0,0,0,0.4)" : "white",
                display: "flex", alignItems: "center", gap: 10,
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

              {/* Fake page content */}
              <div style={{ position: "relative", height: 460 }}>
                <div style={{ padding: "26px 30px", pointerEvents: "none", userSelect: "none" }}>
                  <div style={{ opacity: 0.22 }}>
                    <div style={{ height: 18, background: t.text, borderRadius: 4, width: "36%", marginBottom: 10 }} />
                    <div style={{ height: 10, background: t.textMuted, borderRadius: 3, width: "62%", marginBottom: 6 }} />
                    <div style={{ height: 10, background: t.textMuted, borderRadius: 3, width: "48%", marginBottom: 20 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} style={{ height: 72, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderRadius: 8, border: `1px solid ${t.border}` }} />
                      ))}
                    </div>
                    <div style={{ marginTop: 18, height: 10, background: t.textMuted, borderRadius: 3, width: "78%" }} />
                    <div style={{ marginTop: 7, height: 10, background: t.textMuted, borderRadius: 3, width: "58%" }} />
                    <div style={{ marginTop: 7, height: 10, background: t.textMuted, borderRadius: 3, width: "70%" }} />
                  </div>
                </div>

                {/* Chat window */}
                <AnimatePresence>
                  {widgetOpen && (
                    <motion.div
                      key="chat-window"
                      initial={{ opacity: 0, y: 14, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      style={{
                        position: "absolute", bottom: 70,
                        [config.position]: 14,
                        width: 286, borderRadius: 16, overflow: "hidden",
                        boxShadow: `0 8px 40px rgba(0,0,0,0.22), 0 0 0 1px ${wBorder}`,
                        background: wBg, zIndex: 10,
                      }}
                    >
                      {/* Widget header */}
                      <div style={{ padding: "12px 14px", background: config.brandColor, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 9999,
                            background: "rgba(255,255,255,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 14,
                          }}>{config.logoText?.[0] || "N"}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{config.brandName || "Navigator"}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                              <span style={{ width: 5, height: 5, borderRadius: 9999, background: "#4ade80", display: "inline-block" }} />
                              Online now
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setWidgetOpen(false)} style={{
                          background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 9999,
                          width: 22, height: 22, cursor: "pointer", color: "#fff", fontSize: 13,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✕</button>
                      </div>

                      {/* Messages */}
                      <div style={{ padding: "12px 11px", display: "flex", flexDirection: "column", gap: 9 }}>
                        <div style={{ display: "flex", gap: 7, alignItems: "flex-end" }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: 9999, flexShrink: 0,
                            background: config.brandColor,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, color: "#fff",
                          }}>{config.logoText?.[0] || "N"}</div>
                          <div style={{
                            background: wSurface, border: `1px solid ${wBorder}`,
                            borderRadius: "10px 10px 10px 3px",
                            padding: "8px 11px", fontSize: 12, lineHeight: 1.5,
                            color: wText, maxWidth: 195,
                          }}>{config.greeting}</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <div style={{
                            background: config.brandColor, borderRadius: "10px 10px 3px 10px",
                            padding: "8px 11px", fontSize: 12, lineHeight: 1.5,
                            color: "#fff", maxWidth: 175,
                          }}>How do I upgrade my plan?</div>
                        </div>
                        <div style={{ display: "flex", gap: 7, alignItems: "flex-end" }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: 9999, flexShrink: 0,
                            background: config.brandColor,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, color: "#fff",
                          }}>{config.logoText?.[0] || "N"}</div>
                          <div style={{
                            background: wSurface, border: `1px solid ${wBorder}`,
                            borderRadius: "10px 10px 10px 3px",
                            padding: "8px 11px", fontSize: 12, lineHeight: 1.5,
                            color: wText, maxWidth: 195,
                          }}>I can upgrade you right now! You're on Pro — want to switch to Enterprise?</div>
                        </div>
                      </div>

                      {/* Input bar */}
                      <div style={{ padding: "9px 11px", borderTop: `1px solid ${wBorder}` }}>
                        <div style={{
                          display: "flex", gap: 7, padding: "7px 11px", alignItems: "center",
                          background: wSurface, borderRadius: 9, border: `1px solid ${wBorder}`,
                        }}>
                          <span style={{ flex: 1, fontSize: 12, color: wMuted }}>Ask me anything…</span>
                          <div style={{
                            width: 20, height: 20, borderRadius: 9999, background: config.brandColor,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            <ArrowRight size={10} color="#fff" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating bubble */}
                <div style={{ position: "absolute", bottom: 14, [config.position]: 14, zIndex: 11 }}>
                  <motion.button
                    onClick={() => setWidgetOpen(o => !o)}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                    style={{
                      width: 48, height: 48, borderRadius: 9999,
                      background: config.brandColor, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 4px 24px ${config.brandColor}55`,
                      fontSize: 20, color: "#fff",
                      transition: "background 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {widgetOpen ? "✕" : (config.logoText || "💬")}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Live embed code */}
            <div style={{
              background: t.isDark ? "rgba(255,255,255,0.03)" : "white",
              border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden",
            }}>
              <div style={{
                padding: "10px 16px", borderBottom: `1px solid ${t.border}`,
                background: t.isDark ? "rgba(0,0,0,0.3)" : t.surface2,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: 9999, background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: t.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>
                  Your embed code — updates as you customise
                </span>
              </div>
              <div style={{ padding: "18px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.9 }}>
                <span style={{ color: t.primary }}>{"<script"}</span>{"\n"}
                <span style={{ color: t.textFaint }}>{"  src"}</span>
                <span style={{ color: t.textMuted }}>{`="https://cdn.navigator.ai/widget.js"`}</span>{"\n"}
                <span style={{ color: t.textFaint }}>{"  data-api-key"}</span>
                <span style={{ color: t.textMuted }}>{`="nav_live_xxxxxxxxxxxx"`}</span>{"\n"}
                <span style={{ color: t.primary }}>{"  data-brand-name"}</span>
                <span style={{ color: t.text }}>{`="${config.brandName || "Acme Corp"}"`}</span>{"\n"}
                <span style={{ color: t.primary }}>{"  data-brand-color"}</span>
                <span style={{ color: t.text }}>{`="${config.brandColor}"`}</span>{"\n"}
                <span style={{ color: t.primary }}>{"  data-logo"}</span>
                <span style={{ color: t.text }}>{`="${config.logoText || "⚡"}"`}</span>{"\n"}
                <span style={{ color: t.primary }}>{"  data-position"}</span>
                <span style={{ color: t.text }}>{`="${config.position}"`}</span>{"\n"}
                <span style={{ color: t.primary }}>{"  data-theme"}</span>
                <span style={{ color: t.text }}>{`="${config.widgetTheme}"`}</span>{"\n"}
                <span style={{ color: t.primary }}>{">"}</span>
                <span style={{ color: t.primary }}>{"</script>"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Observatory Background ───────────────────────────────────────────────────
function ObservatoryField({ theme }: { theme: Theme }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Light mode: rich pastel gradient base so glass panels have color to refract */}
      {!theme.isDark && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(145deg, #EAE5FF 0%, #E8F2FF 38%, #E5FBF5 70%, #FEE9F5 100%)",
        }} />
      )}

      {/* Primary glow — purple, top center */}
      <div style={{
        position: "absolute",
        top: theme.isDark ? "18%" : "0%",
        left: "50%", transform: "translateX(-50%)",
        width: theme.isDark ? 900 : 820,
        height: theme.isDark ? 900 : 720,
        background: theme.glow1,
        filter: `blur(${theme.isDark ? 180 : 120}px)`,
        borderRadius: "50%",
      }} />

      {/* Secondary glow — blue, bottom right */}
      <div style={{
        position: "absolute", bottom: "-10%", right: theme.isDark ? "-10%" : "-5%",
        width: theme.isDark ? 700 : 660,
        height: theme.isDark ? 700 : 580,
        background: theme.glow2,
        filter: `blur(${theme.isDark ? 220 : 155}px)`,
        borderRadius: "50%",
      }} />

      {/* Tertiary glow — teal, mid left */}
      <div style={{
        position: "absolute", top: "35%", left: theme.isDark ? "-8%" : "-4%",
        width: theme.isDark ? 600 : 560,
        height: theme.isDark ? 600 : 500,
        background: theme.glow3,
        filter: `blur(${theme.isDark ? 200 : 145}px)`,
        borderRadius: "50%",
      }} />

      {/* Extra glow — rose, lower right (light mode only for richness) */}
      {!theme.isDark && (
        <div style={{
          position: "absolute", top: "58%", right: "18%",
          width: 500, height: 420,
          background: "rgba(236,72,153,0.14)",
          filter: "blur(150px)", borderRadius: "50%",
        }} />
      )}

      {/* Orbit rings — dark mode only */}
      {theme.isDark && (
        <svg viewBox="0 0 1000 1000" style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.06 }}>
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
      : "0 8px 32px rgba(80,40,180,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
    borderRadius: 20,
    ...extra,
  });

  const gradText = (children: React.ReactNode, style?: React.CSSProperties) => (
    <span style={style}>{children}</span>
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
      icon: <Users size={22} />, title: "Multi-Tenant Isolation",
      desc: "Every site's data, tools, and conversations are fully isolated. One platform serving thousands of products securely.",
      detail: ["site_meridian  ── isolated", "site_stackflow ── isolated", "site_arken    ── isolated"],
      large: true,
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
    { icon: <Lock size={18} />, title: "End-to-end Encryption", desc: "All data encrypted at rest and in transit" },
    { icon: <Shield size={18} />, title: "SOC 2 Type II", desc: "Annual third-party security audit" },
    { icon: <Eye size={18} />, title: "Full Audit Logs", desc: "Every action logged and traceable" },
    { icon: <Database size={18} />, title: "Data Isolation", desc: "Per-tenant database-level isolation" },
    { icon: <Settings2 size={18} />, title: "Role-based Access", desc: "Granular permissions per team member" },
    { icon: <Globe size={18} />, title: "GDPR Compliant", desc: "EU and US data residency options" },
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
          boxShadow: t.isDark ? "none" : "0 1px 0 rgba(255,255,255,0.9), 0 4px 24px rgba(80,40,180,0.05)",
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
        <section style={{ ...sectionPad, paddingTop: 120, paddingBottom: 100 }}>
          <div className="grid-hero" style={{ ...container, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
            <div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                  <span style={{
                    padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: `${t.primary}15`, border: `1px solid ${t.primary}25`, color: t.primary,
                    letterSpacing: "0.06em",
                  }}>AI Product Agent Platform</span>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 12,
                    color: t.textMuted, padding: "5px 12px",
                    border: `1px solid ${t.border}`, borderRadius: 999,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 9999, background: t.primary, display: "inline-block", opacity: 0.75 }} />
                    v2.4 — Now GA
                  </span>
                </div>

                <h1 style={{
                  fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontWeight: 800, lineHeight: 1.06,
                  letterSpacing: "-0.04em", margin: "0 0 24px",
                }}>
                  Ship an AI agent<br />for your product.<br />
                  {gradText("In 30 minutes.")}
                </h1>

                <p style={{ fontSize: 18, lineHeight: 1.65, color: t.textMuted, marginBottom: 14, maxWidth: 460 }}>
                  Upload your OpenAPI spec and knowledge base. Navigator deploys an agent that can:
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

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
                  <a href="#" style={{
                    padding: "15px 30px", borderRadius: 14, fontSize: 15, fontWeight: 700,
                    color: t.buttonText, textDecoration: "none", background: t.buttonBg,
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: t.isDark ? "0 0 40px rgba(255,255,255,0.1)" : "0 8px 32px rgba(28,28,30,0.22), 0 2px 8px rgba(28,28,30,0.12)",
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
                    boxShadow: t.isDark ? "none" : "0 4px 16px rgba(80,40,180,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    Watch it work <ChevronRight size={16} />
                  </a>
                </div>

                <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
                  {[
                    { n: "50+", label: "Product teams" },
                    { n: "2M+", label: "API calls/day" },
                    { n: "<200ms", label: "Avg latency" },
                    { n: "99.9%", label: "Uptime SLA" },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: t.text }}>{stat.n}</div>
                      <div style={{ fontSize: 12, color: t.textFaint, marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div className="hide-mobile" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <HeroViz theme={t} />
            </motion.div>
          </div>
        </section>

        {/* ── Marquee Social Proof ── */}
        <section style={{
          padding: "32px 0",
          borderTop: `1px solid ${t.border}`,
          borderBottom: `1px solid ${t.border}`,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}>
            <div style={{
              display: "flex", gap: 72, alignItems: "center",
              animation: "marquee 32s linear infinite",
              willChange: "transform", flexShrink: 0,
              paddingRight: 72,
            }}>
              {[...COMPANY_NAMES, ...COMPANY_NAMES].map((name, i) => (
                <span key={i} style={{
                  fontSize: 14, fontWeight: 700, color: t.textFaint,
                  letterSpacing: "-0.01em", whiteSpace: "nowrap", userSelect: "none",
                  opacity: 0.55,
                }}>{name}</span>
              ))}
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
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: t.textMuted, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section style={{ ...sectionPad, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
          <div style={container}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              {pill("How It Works")}
              <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
                From spec to {gradText("live intelligence")}<br />in four steps
              </h2>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", top: 34, left: "12.5%", right: "12.5%", height: 1,
                background: `linear-gradient(90deg, transparent, ${t.primary}50, ${t.primary}50, transparent)`,
              }} />

              <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative" }}>
                {howItWorks.map((step, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ position: "relative", display: "inline-flex", marginBottom: 28 }}>
                        <div className={t.isDark ? "orbit-node-dark" : "orbit-node-light"} style={{
                          width: 68, height: 68, borderRadius: 9999,
                          background: t.text,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: t.isDark ? "#09090B" : "#ffffff",
                        }}>{step.icon}</div>
                        <div style={{
                          position: "absolute", top: -4, right: -4, width: 22, height: 22,
                          borderRadius: 9999, background: t.surface,
                          border: `1px solid ${t.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 700, color: t.textMuted,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>{step.step}</div>
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em" }}>{step.title}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: t.textMuted, margin: 0 }}>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Core Capabilities (Bento) ── */}
        <section style={sectionPad}>
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
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: t.textMuted, margin: 0 }}>{cap.desc}</p>
                  {cap.large && cap.detail && (
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

        {/* ── Widget Customizer ── */}
        <WidgetCustomizer theme={t} />

        {/* ── Interactive Demo ── */}
        <DemoSection theme={t} />

        {/* ── Testimonials ── */}
        <TestimonialsSection theme={t} />

        {/* ── Architecture ── */}
        <section style={{ ...sectionPad, background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.52)", backdropFilter: t.isDark ? undefined : "blur(24px)", WebkitBackdropFilter: t.isDark ? undefined : "blur(24px)" }}>
          <div style={container}>
            <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
              <div>
                {pill("Architecture")}
                <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
                  Built for production<br />{gradText("from day one")}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: t.textMuted, marginBottom: 32 }}>
                  Navigator's layered architecture separates concerns cleanly — your widget, our intelligence, your APIs, your data. Nothing shared between tenants.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["PostgreSQL + pgvector for data isolation", "Redis for sub-10ms session retrieval", "OpenAI gpt-4o with full function calling", "Agent loop capped at 10 iterations"].map(item => (
                    <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <CheckCircle2 size={16} style={{ color: t.primary, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, color: t.textMuted }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {archLayers.map((layer, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
                    style={{ ...card({ padding: "18px 22px" }) }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>{layer.label}</span>
                      <span style={{
                        fontSize: 9, padding: "2px 8px", borderRadius: 999,
                        background: t.text, color: t.isDark ? "#09090B" : "#fff",
                        fontWeight: 700, letterSpacing: "0.06em",
                      }}>LAYER {i + 1}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: t.textMuted, margin: "0 0 10px", lineHeight: 1.5 }}>{layer.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {layer.chips.map(chip => (
                        <span key={chip} style={{
                          fontSize: 10.5, padding: "3px 10px", borderRadius: 999,
                          background: `${t.primary}10`, border: `1px solid ${t.primary}22`,
                          color: t.primary, fontFamily: "'JetBrains Mono', monospace",
                        }}>{chip}</span>
                      ))}
                    </div>
                    {i < archLayers.length - 1 && (
                      <div style={{ textAlign: "center", marginTop: -4, marginBottom: -16, color: t.textFaint, fontSize: 16 }}>↓</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
              {securityItems.map((item, i) => (
                <div key={i} style={{ ...card({ padding: "24px 28px", display: "flex", gap: 16, alignItems: "flex-start" }) }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `${t.primary}12`, display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.primary,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 13.5, color: t.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
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
                    { icon: <Package size={16} />, label: "Zero-dependency widget bundle", desc: "Pure IIFE — no React, no bundler on the host" },
                    { icon: <GitBranch size={16} />, label: "REST API & TypeScript SDK", desc: "Full programmatic access with type safety" },
                    { icon: <Braces size={16} />, label: "OpenAPI auto-ingestion", desc: "Point at any spec URL — tools appear instantly" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", gap: 14 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0, marginTop: 1,
                        background: `${t.primary}12`, display: "flex", alignItems: "center", justifyContent: "center",
                        color: t.primary,
                      }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 13, color: t.textMuted }}>{item.desc}</div>
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
                        ? t.isDark ? `1.5px solid rgba(255,255,255,0.16)` : `1.5px solid rgba(124,58,237,0.35)`
                        : `1px solid ${t.border}`,
                      boxShadow: plan.highlight
                        ? t.isDark
                          ? `0 0 0 1px rgba(168,85,247,0.1), 0 24px 80px rgba(0,0,0,0.4), 0 0 80px rgba(168,85,247,0.08)`
                          : `0 0 0 1px rgba(124,58,237,0.12), 0 24px 80px rgba(124,58,237,0.14), inset 0 1px 0 rgba(255,255,255,0.95)`
                        : t.isDark ? "none" : `0 4px 24px rgba(80,40,180,0.07), inset 0 1px 0 rgba(255,255,255,0.9)`,
                      position: "relative", overflow: "hidden",
                    }),
                  }}
                >
                  {plan.highlight && (
                    <div style={{
                      position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(96,165,250,0.5), transparent)",
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
                        <span style={{ fontSize: 13.5, color: t.textMuted }}>{f}</span>
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
        <section style={sectionPad}>
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
                boxShadow: t.isDark ? "none" : "0 24px 80px rgba(80,40,180,0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
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
                  fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.08,
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
