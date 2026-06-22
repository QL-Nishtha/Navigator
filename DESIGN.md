# Navigator — Design System

Single reference for all visual decisions across the marketing site and auth pages.

---

## Themes

Two named themes ship with the product. Both are available on every page via a toggle.

| Token | `lunar-dark` | `lunar-light` |
|---|---|---|
| `bg` | `#05070D` | `#F0F2F8` |
| `panelBg` | `#08090F` | `#FFFFFF` |
| `primary` | `#FFFFFF` | `#1A1C24` |
| `accent1` | `#58ECFF` (cyan) | `#1E4FAA` (navy) |
| `accent2` | `#A0D4F8` | `#1060C8` |
| `accent3` | `#E8F6FF` | `#2870CC` |
| `text` | `#FFFFFF` | `#1A1C24` |
| `textMuted` | `rgba(200,212,236,0.65)` | `rgba(28,32,50,0.75)` |
| `textFaint` | `rgba(200,212,236,0.28)` | `rgba(28,32,50,0.42)` |
| `border` | `rgba(255,255,255,0.08)` | `rgba(28,32,50,0.08)` |
| `inputBg` | `rgba(255,255,255,0.05)` | `#F7F8FC` |
| `inputBorder` | `rgba(255,255,255,0.10)` | `rgba(28,32,50,0.12)` |
| `inputBorderFocus` | `rgba(88,236,255,0.50)` | `rgba(30,79,170,0.45)` |
| `buttonBg` | `#FFFFFF` | `#1A1C24` |
| `buttonText` | `#05070D` | `#FFFFFF` |
| `divider` | `rgba(255,255,255,0.08)` | `rgba(28,32,50,0.08)` |
| `labelColor` | `rgba(200,212,236,0.55)` | `rgba(28,32,50,0.55)` |

**Source of truth:** [`src/app/theme/authTheme.ts`](src/app/theme/authTheme.ts)
Auth pages import `AUTH_THEMES` from there. The marketing landing page has its own extended theme in `src/app/App.tsx` (adds `surface`, `glow1–3`, `gradient` tokens).

---

## Glow Tokens (landing page only)

Used for background orbs and SVG network visualizations.

| Token | `lunar-dark` | `lunar-light` |
|---|---|---|
| `glow1` | `rgba(140,158,205,0.45)` | `rgba(130,148,192,0.55)` |
| `glow2` | `rgba(55,175,235,0.22)` | `rgba(80,110,170,0.42)` |
| `glow3` | `rgba(190,210,240,0.30)` | `rgba(170,188,225,0.38)` |
| `glowStrong` | `rgba(255,255,255,0.15)` | `rgba(0,0,0,0.08)` |
| `glowSubtle` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.03)` |

---

## Typography

| Role | Font | Weight | Size | Tracking |
|---|---|---|---|---|
| Display / Hero | Plus Jakarta Sans | 800 | `clamp(3rem, 6vw, 5rem)` | `-0.04em` |
| Section heading | Plus Jakarta Sans | 800 | `clamp(2rem, 4vw, 2.75rem)` | `-0.03em` |
| Card heading | Plus Jakarta Sans | 700 | `16–18px` | `-0.02em` |
| Body | Plus Jakarta Sans | 400–500 | `15–17px` | `0` |
| Label / caption | Plus Jakarta Sans | 600 | `12–13px` | `0.08em` uppercase |
| Code / monospace | JetBrains Mono | 400–500 | `11–13px` | `0` |

Fonts loaded via Google Fonts in [`src/styles/fonts.css`](src/styles/fonts.css).

---

## Spacing & Layout

| Context | Value |
|---|---|
| Page max-width | `1200px` |
| Section vertical padding | `96px 24px` |
| Card border-radius (large) | `24–28px` |
| Card border-radius (small) | `12–14px` |
| Button border-radius | `10–14px` |
| Input border-radius | `10–12px` |
| Pill / badge border-radius | `999px` |
| Auth form panel width | `480px` (fixed), fluid on mobile |
| Mobile breakpoint (nav collapses) | `900px` |
| Mobile breakpoint (auth right panel hides) | `800px` |

---

## Glass Effect

Applied to cards, nav bar, and modals on the landing page.

```css
backdrop-filter: blur(40–48px) saturate(160–200%);
-webkit-backdrop-filter: blur(40–48px) saturate(160–200%);

/* lunar-dark */
background: linear-gradient(155deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%);
border: 1px solid rgba(255,255,255,0.09);
box-shadow: 0 4px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07);

/* lunar-light */
background: linear-gradient(155deg, rgba(255,255,255,0.97) 0%, rgba(240,245,255,0.82) 100%);
border: 1px solid rgba(255,255,255,0.92);
box-shadow: 0 4px 32px rgba(80,100,180,0.07), inset 0 1px 0 rgba(255,255,255,1);
```

**Top rim light** — always paired with glass cards. A 1px horizontal gradient line at the top edge simulates a light source catching the glass:

```css
/* dark */
background: linear-gradient(90deg, transparent, rgba(88,236,255,0.4), transparent);

/* light */
background: linear-gradient(90deg, transparent, rgba(255,255,255,0.98), transparent);
```

---

## Background Orbs

Animated radial gradients that create the ambient space/atmosphere. Each page uses 2–3 orbs at different positions, sizes, and animation durations so they never sync.

```tsx
// Pattern
<motion.div
  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  style={{
    position: "absolute",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(88,236,255,0.18) 0%, transparent 70%)",
    filter: "blur(40–72px)",
    pointerEvents: "none",
  }}
/>
```

Orbs are always `pointerEvents: none` and sit behind all content (`z-index` not set / below stacking context).

---

## Grid Overlay

Subtle dot/line grid used in right panels and dark backgrounds.

```svg
<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(88,236,255,1)" strokeWidth="0.5"/>
</pattern>
<!-- Applied at opacity: 0.035–0.04 -->
```

---

## Animation

All motion uses `motion/react` (Framer Motion). Standard easing for entrance animations:

```ts
ease: [0.22, 1, 0.36, 1]  // spring-like deceleration
duration: 0.5–0.65s
```

| Pattern | Config |
|---|---|
| Page / panel slide-in | `x: -20 → 0`, `opacity: 0 → 1`, duration `0.55s` |
| Card stagger | `y: 20 → 0`, delay increments `+0.10–0.18s` per item |
| Orb breathe | `scale: 1 → 1.15 → 1`, duration `8–14s`, `repeat: Infinity` |
| Pulsing dot | `opacity: 1 → 0.3 → 1`, duration `1.4–1.6s` |
| Connector particle | `top: -100% → 100%`, linear, duration `1.8s` |
| Button hover lift | `translateY(-2px)`, duration `0.16–0.18s` |
| Input focus ring | `box-shadow` transition, `0.18s ease` |
| Shimmer text | `background-position: 200% → -200%`, `6s linear infinite` |

---

## Logo

```tsx
<div style={{ width: 30, height: 30, borderRadius: 9, background: t.text,
  display: "flex", alignItems: "center", justifyContent: "center" }}>
  <Network size={15} color={t.isDark ? "#09090B" : "#ffffff"} />
</div>
<span style={{ fontSize: 16–17px, fontWeight: 800, letterSpacing: "-0.03em" }}>
  Navigator
</span>
```

- Icon: `Network` from `lucide-react`
- Container: solid square, color = `t.text` (inverts between themes automatically)
- Icon color: inverts to match — dark theme gets near-black `#09090B`, light theme gets white
- Never use a border or glass effect on the logo container

---

## Buttons

### Primary CTA

```tsx
style={{
  background: t.buttonBg,     // white (dark) / #1A1C24 (light)
  color: t.buttonText,        // #05070D (dark) / white (light)
  borderRadius: 10–14,
  fontSize: 14.5, fontWeight: 700,
  padding: "13–14px 20px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
  transition: "transform 0.16s ease, box-shadow 0.16s ease",
}}
// Hover: translateY(-2px), deeper shadow
```

### Secondary / Ghost

```tsx
style={{
  background: "transparent",
  border: `1px solid ${t.border}`,
  color: t.textFaint,
  borderRadius: 8, padding: "6px 14px",
  fontSize: 12, fontWeight: 600,
}}
```

### Google OAuth

```tsx
style={{
  background: t.isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
  border: `1px solid ${t.border}`,
  borderRadius: 10,
  // includes Google SVG logo inline (no external dependency)
}}
```

---

## Form Inputs

```tsx
style={{
  background: t.inputBg,
  border: `1px solid ${focused ? t.inputBorderFocus : t.inputBorder}`,
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 14.5,
  // on focus:
  boxShadow: "0 0 0 3px rgba(88,236,255,0.10)",   // dark
  boxShadow: "0 0 0 3px rgba(30,79,170,0.08)",    // light
}}
```

- Focus state tracked via React `useState` on `onFocus` / `onBlur`
- Password fields include a show/hide toggle (`Eye` / `EyeOff` from lucide-react)
- Register page shows a 4-segment strength bar below the password field

---

## Auth Page Layout

Split-screen — form left, visual right. Right panel always uses `lunar-dark` regardless of theme toggle (it's a dark visualization canvas).

```
┌─────────────────────┬──────────────────────────────┐
│  480px — Form panel │  flex: 1 — Visual panel      │
│  (theme-aware)      │  (always dark, animated)     │
│                     │                              │
│  [Logo + wordmark]  │  [Ambient orbs]              │
│  [Heading + sub]    │  [Grid overlay]              │
│  [Form fields]      │  [Pipeline / feature cards]  │
│  [CTA button]       │  [Stats / testimonial]       │
│  [Footer link]      │                              │
└─────────────────────┴──────────────────────────────┘

@media (max-width: 800px): right panel hidden, form full-width
```

**Login right panel** — animated agent pipeline (step nodes + traveling connector particles + stat pills)
**Register right panel** — feature highlight cards (hover glow) + testimonial quote

---

## Accent Glow on Borders (landing page pipeline cards)

Last step / active state gets an animated border glow:

```css
/* dark */
@keyframes border-glow-dark {
  0%, 100% { box-shadow: 0 0 0 1px rgba(88,236,255,0.35), 0 0 18px rgba(88,236,255,0.22); }
  50%       { box-shadow: 0 0 0 1px rgba(88,236,255,0.75), 0 0 32px rgba(88,236,255,0.45); }
}

/* light */
@keyframes border-glow-light {
  0%, 100% { box-shadow: 0 0 0 1px rgba(30,79,170,0.30), 0 0 18px rgba(30,79,170,0.18); }
  50%       { box-shadow: 0 0 0 1px rgba(30,79,170,0.65), 0 0 28px rgba(30,79,170,0.35); }
}
```

---

## File Map

```
src/
├── app/
│   ├── App.tsx                  ← Landing page (full theme + all sections)
│   ├── theme/
│   │   └── authTheme.ts         ← Shared auth theme tokens (single source of truth)
│   └── pages/
│       ├── LoginPage.tsx        ← /login  — split-screen, agent pipeline right panel
│       └── RegisterPage.tsx     ← /register — split-screen, feature cards right panel
└── styles/
    ├── fonts.css                ← Google Fonts import (Plus Jakarta Sans, JetBrains Mono)
    ├── index.css                ← Entry: imports fonts + tailwind + theme
    ├── globals.css              ← (empty / minimal)
    └── tailwind.css             ← Tailwind entry
```
