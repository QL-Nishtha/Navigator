import { motion } from "motion/react";

// Shift center down so the CRM label (above top node) has breathing room
const CX = 240, CY = 210, R = 122, NR = 24;
const toRad = (d: number) => (d * Math.PI) / 180;

const NODES = [
  { id: "crm",      label: "CRM",      sub: "Customers & Deals",    angle: -90,  color: "#60A5FA", speed: 2.4, delay: 0    },
  { id: "erp",      label: "ERP",      sub: "Finance & Operations", angle: -18,  color: "#C084FC", speed: 2.8, delay: 0.5  },
  { id: "hrms",     label: "HRMS",     sub: "People & Policies",    angle:  54,  color: "#34D399", speed: 2.2, delay: 1.0  },
  { id: "projects", label: "Projects", sub: "Tasks & Workflows",    angle: 126,  color: "#FB923C", speed: 3.0, delay: 1.5  },
  { id: "support",  label: "Support",  sub: "Tickets & Requests",   angle: 198,  color: "#38BDF8", speed: 2.6, delay: 2.0  },
].map(n => ({
  ...n,
  nx: CX + R * Math.cos(toRad(n.angle)),
  ny: CY + R * Math.sin(toRad(n.angle)),
}));

// Labels go radially outward: above for top-half nodes, below for bottom-half nodes
// This keeps text, circle, and connection line all visually grouped together
function labelY(ny: number, lineIdx: 0 | 1): number {
  const isTop = ny < CY;
  if (isTop)  return lineIdx === 0 ? ny - NR - 30 : ny - NR - 16; // main then sub above
  else        return lineIdx === 0 ? ny + NR + 16 : ny + NR + 30; // sub then main below
}

function NodeIcon({ id, color }: { id: string; color: string }) {
  switch (id) {
    case "crm":
      return (
        <>
          <circle r="5" cy="-5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M-9 8c0-6 18-6 18 0" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
        </>
      );
    case "erp":
      return (
        <>
          <line x1="0" y1="-13" x2="0" y2="13" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M-7-4 Q-7-10 0-10 Q7-10 7-4 Q7 0 0 0 Q7 0 7 5 Q7 11 0 11 Q-7 11 -7 5"
            fill="none" stroke={color} strokeWidth="1.5"/>
        </>
      );
    case "hrms":
      return (
        <>
          <circle cx="0" cy="-8" r="4" fill="none" stroke={color} strokeWidth="1.5"/>
          <circle cx="-8" cy="7" r="3.5" fill="none" stroke={color} strokeWidth="1.5"/>
          <circle cx="8" cy="7" r="3.5" fill="none" stroke={color} strokeWidth="1.5"/>
          <line x1="0" y1="-4" x2="0" y2="2" stroke={color} strokeWidth="1.4"/>
          <line x1="-8" y1="2" x2="8" y2="2" stroke={color} strokeWidth="1.4"/>
          <line x1="-8" y1="2" x2="-8" y2="3.5" stroke={color} strokeWidth="1.4"/>
          <line x1="8"  y1="2" x2="8"  y2="3.5" stroke={color} strokeWidth="1.4"/>
        </>
      );
    case "projects":
      return (
        <>
          <rect x="-10" y="-12" width="20" height="24" rx="2" fill="none" stroke={color} strokeWidth="1.5"/>
          <path d="M-7-6 L-4-3 L0-9" fill="none" stroke={color} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="3" y1="-6" x2="8" y2="-6" stroke={color} strokeWidth="1.3"/>
          <path d="M-7 4 L-4 7 L0 1" fill="none" stroke={color} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="3" y1="4" x2="8" y2="4" stroke={color} strokeWidth="1.3"/>
        </>
      );
    case "support":
      return (
        <>
          <path d="M-10-1 Q-10-12 0-12 Q10-12 10-1" fill="none" stroke={color} strokeWidth="1.5"/>
          <rect x="-13" y="-1" width="5" height="8" rx="2.5" fill="none" stroke={color} strokeWidth="1.5"/>
          <rect x="8"   y="-1" width="5" height="8" rx="2.5" fill="none" stroke={color} strokeWidth="1.5"/>
          <path d="M10 7 Q10 12 5 12 Q1 12 1 9" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
        </>
      );
    default:
      return null;
  }
}

interface Props { isDark?: boolean; }

export default function B2BInfographic({ isDark = true }: Props) {
  const accent   = isDark ? "#58ECFF" : "#1E4FAA";
  const nodeFill = isDark ? "rgba(7,12,32,0.88)"    : "rgba(255,255,255,0.90)";
  const labelClr = isDark ? "#FFFFFF"                : "#1A1C24";
  const subClr   = isDark ? "rgba(200,212,236,0.42)" : "rgba(28,32,50,0.52)";
  const orbitClr = isDark ? "rgba(88,236,255,0.06)"  : "rgba(30,79,170,0.09)";
  const lineOp   = isDark ? 0.18 : 0.28;

  return (
    <svg viewBox="0 0 480 390" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="cGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={accent} stopOpacity={isDark ? 0.22 : 0.16}/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
        {NODES.map(n => (
          <radialGradient key={n.id} id={`ng-${n.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={n.color} stopOpacity={isDark ? 0.16 : 0.12}/>
            <stop offset="100%" stopColor={n.color} stopOpacity="0"/>
          </radialGradient>
        ))}
        {NODES.map(n => (
          <path key={n.id} id={`p-${n.id}`}
            d={`M ${CX} ${CY} L ${n.nx} ${n.ny}`} fill="none" stroke="none"/>
        ))}
      </defs>

      {/* Orbit ring */}
      <circle cx={CX} cy={CY} r={R} fill="none"
        stroke={orbitClr} strokeWidth="1" strokeDasharray="3 9"/>

      {/* Connections + particles */}
      {NODES.map(n => (
        <g key={n.id}>
          <line x1={CX} y1={CY} x2={n.nx} y2={n.ny}
            stroke={n.color} strokeOpacity={lineOp} strokeWidth="1.5" strokeDasharray="5 7"/>
          <circle r="2.8" fill={n.color} opacity="0.9">
            <animateMotion dur={`${n.speed}s`} repeatCount="indefinite" begin={`${n.delay}s`}>
              <mpath href={`#p-${n.id}`}/>
            </animateMotion>
          </circle>
          <circle r="1.8" fill={n.color} opacity="0.45">
            <animateMotion dur={`${n.speed}s`} repeatCount="indefinite" begin={`${n.delay + n.speed * 0.5}s`}>
              <mpath href={`#p-${n.id}`}/>
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* Center glow */}
      <circle cx={CX} cy={CY} r={56} fill="url(#cGlow)"/>

      {/* Center pulse ring */}
      <circle cx={CX} cy={CY} r={34} fill="none" stroke={accent}
        strokeWidth="1" strokeOpacity={isDark ? 0.22 : 0.30}>
        <animate attributeName="r"              values="33;46;33"   dur="3.5s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values={isDark ? "0.22;0;0.22" : "0.30;0;0.30"}
          dur="3.5s" repeatCount="indefinite"/>
      </circle>

      {/* Center circle */}
      <motion.circle cx={CX} cy={CY} r={32}
        fill={isDark ? "rgba(7,12,32,0.94)" : "rgba(255,255,255,0.95)"}
        stroke={accent} strokeWidth="1.5" strokeOpacity={0.55}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Center icon */}
      <motion.g transform={`translate(${CX}, ${CY})`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}>
        <circle cx={0}  cy={-10} r={4.5} fill="none" stroke={accent} strokeWidth="1.8"/>
        <circle cx={-9} cy={7}   r={4.5} fill="none" stroke={accent} strokeWidth="1.8"/>
        <circle cx={9}  cy={7}   r={4.5} fill="none" stroke={accent} strokeWidth="1.8"/>
        <line x1={0}    y1={-5.5} x2={-7}  y2={2.5} stroke={accent} strokeWidth="1.4"/>
        <line x1={0}    y1={-5.5} x2={7}   y2={2.5} stroke={accent} strokeWidth="1.4"/>
        <line x1={-4.5} y1={7}    x2={4.5} y2={7}   stroke={accent} strokeWidth="1.4"/>
      </motion.g>

      {/* Satellite nodes — label always above the circle */}
      {NODES.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${n.nx}px ${n.ny}px` } as React.CSSProperties}
        >
          {/* Glow halo */}
          <circle cx={n.nx} cy={n.ny} r={NR + 10} fill={`url(#ng-${n.id})`}/>
          {/* Node circle */}
          <circle cx={n.nx} cy={n.ny} r={NR}
            fill={nodeFill} stroke={n.color} strokeWidth="1.4" strokeOpacity="0.5"/>
          {/* Icon */}
          <g transform={`translate(${n.nx}, ${n.ny})`}>
            <NodeIcon id={n.id} color={n.color}/>
          </g>
          {/* Main label */}
          <text
            x={n.nx} y={labelY(n.ny, 0)}
            textAnchor="middle"
            fontSize="11.5" fontWeight="700" fill={labelClr}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {n.label}
          </text>
          {/* Sub label */}
          <text
            x={n.nx} y={labelY(n.ny, 1)}
            textAnchor="middle"
            fontSize="9.5" fontWeight="500" fill={subClr}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {n.sub}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
