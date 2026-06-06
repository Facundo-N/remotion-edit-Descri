import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

const BG = '#C8E4F5';
const FLAG_BLUE = '#74ACDF';
const SOL_GOLD = '#F6B40E';
const SOL_DARK = '#85340A';
const W = 1080;
const H = 1920;

// ── Sol de Mayo ──────────────────────────────────────
export const SolDeMayo: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.018 * Math.sin(frame * 0.07);
  const rRot = frame * 0.12;
  const numRays = 32;
  const innerR = r * 0.56;

  const straightRays: React.ReactElement[] = [];
  const wavyRays: React.ReactElement[] = [];

  for (let i = 0; i < numRays; i++) {
    const angle = (i * (360 / numRays) - 90) * (Math.PI / 180);
    const perp = angle + Math.PI / 2;
    const isWavy = i % 2 === 1;
    const bx = cx + Math.cos(angle) * innerR;
    const by = cy + Math.sin(angle) * innerR;
    const tx = cx + Math.cos(angle) * r;
    const ty = cy + Math.sin(angle) * r;
    const mx = cx + Math.cos(angle) * ((innerR + r) / 2);
    const my = cy + Math.sin(angle) * ((innerR + r) / 2);

    if (!isWavy) {
      const bw = r * 0.052;
      const tw = r * 0.012;
      straightRays.push(
        <polygon
          key={i}
          points={`${bx + Math.cos(perp) * bw},${by + Math.sin(perp) * bw} ${bx - Math.cos(perp) * bw},${by - Math.sin(perp) * bw} ${tx - Math.cos(perp) * tw},${ty - Math.sin(perp) * tw} ${tx + Math.cos(perp) * tw},${ty + Math.sin(perp) * tw}`}
          fill={SOL_GOLD}
          stroke={SOL_DARK}
          strokeWidth={0.7}
        />
      );
    } else {
      const bw = r * 0.056;
      const off = r * 0.09;
      wavyRays.push(
        <path
          key={i}
          d={`M ${bx + Math.cos(perp) * bw} ${by + Math.sin(perp) * bw} Q ${mx + Math.cos(perp) * off} ${my + Math.sin(perp) * off} ${tx} ${ty} Q ${mx - Math.cos(perp) * off} ${my - Math.sin(perp) * off} ${bx - Math.cos(perp) * bw} ${by - Math.sin(perp) * bw} Z`}
          fill={SOL_GOLD}
          stroke={SOL_DARK}
          strokeWidth={0.7}
        />
      );
    }
  }

  const fr = innerR * 0.84;
  return (
    <g transform={`translate(${cx},${cy}) scale(${breathe}) translate(${-cx},${-cy})`}>
      <g transform={`rotate(${rRot},${cx},${cy})`}>
        {straightRays}
        {wavyRays}
      </g>
      {/* Outer glow circle */}
      <circle cx={cx} cy={cy} r={fr + 4} fill={SOL_GOLD} opacity={0.25} />
      {/* Main face circle (empty face) */}
      <circle cx={cx} cy={cy} r={fr} fill={SOL_GOLD} stroke={SOL_DARK} strokeWidth={2} />
    </g>
  );
};

// ── Waving flag ribbon ───────────────────────────────
const WavingFlag: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame * 0.038;
  const stripeY = H * 0.38; // Center of the ribbon (same as solY)
  const ribbonHeight = 660; // Total height of the ribbon (much larger)
  const half = ribbonHeight / 2;

  const wave = (x: number, ph = 0) => Math.sin(x * 0.0035 + t + ph) * 85;
  const n = 30;

  const buildStripe = (startYOffset: number, endYOffset: number, ph: number) => {
    let path = `M -100 ${stripeY + startYOffset + wave(-100, ph)}`;
    for (let i = 1; i < n; i++) {
      const x = (i / (n - 1)) * (W + 200) - 100;
      path += ` L ${x} ${stripeY + startYOffset + wave(x, ph)}`;
    }
    for (let i = n - 1; i >= 0; i--) {
      const x = (i / (n - 1)) * (W + 200) - 100;
      path += ` L ${x} ${stripeY + endYOffset + wave(x, ph)}`;
    }
    path += ` Z`;
    return path;
  };

  const topBlue = buildStripe(-half, -half * 0.33, 0);
  const midWhite = buildStripe(-half * 0.33, half * 0.33, 0.05);
  const botBlue = buildStripe(half * 0.33, half, 0.1);

  return (
    <svg style={{ position: 'absolute', inset: 0, opacity: opacity }} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <filter id="ribbonShadow">
        <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000" floodOpacity="0.15" />
      </filter>
      <g filter="url(#ribbonShadow)">
        <path d={topBlue} fill={FLAG_BLUE} />
        <path d={midWhite} fill="#FFFFFF" />
        <path d={botBlue} fill={FLAG_BLUE} />
      </g>
    </svg>
  );
};

// ── Sparkle star ─────────────────────────────────────
const Sparkle: React.FC<{ x: number; y: number; size: number; delay: number; color: string }> = ({ x, y, size, delay, color }) => {
  const frame = useCurrentFrame();
  const op = 0.4 + 0.6 * Math.abs(Math.sin((frame + delay) * 0.08));
  const s = size * (0.85 + 0.15 * Math.sin((frame + delay) * 0.12));
  return (
    <g transform={`translate(${x},${y})`} opacity={op}>
      <line x1={-s} y1={0} x2={s} y2={0} stroke={color} strokeWidth={s * 0.22} strokeLinecap="round" />
      <line x1={0} y1={-s} x2={0} y2={s} stroke={color} strokeWidth={s * 0.22} strokeLinecap="round" />
      <line x1={-s * 0.6} y1={-s * 0.6} x2={s * 0.6} y2={s * 0.6} stroke={color} strokeWidth={s * 0.1} strokeLinecap="round" />
      <line x1={s * 0.6} y1={-s * 0.6} x2={-s * 0.6} y2={s * 0.6} stroke={color} strokeWidth={s * 0.1} strokeLinecap="round" />
    </g>
  );
};

// ── Arc decorator ─────────────────────────────────────
const ArcDeco: React.FC<{ cx: number; cy: number; r: number; opacity?: number }> = ({ cx, cy, r, opacity = 0.6 }) => (
  <g opacity={opacity}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
    <circle cx={cx} cy={cy} r={r * 0.75} fill="none" stroke="#FFFFFF" strokeWidth={1.5} />
    <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="#FFFFFF" strokeWidth={1} />
  </g>
);

// ── Main export ───────────────────────────────────────
export const PatrioticScene: React.FC<{ children?: React.ReactNode; transparent?: boolean; flagOpacity?: number }> = ({ children, transparent = false, flagOpacity = 1 }) => {
  const solY = H * 0.38;

  const sparkles = [
    { x: 180, y: 260,  size: 22, delay: 0,   color: SOL_GOLD },
    { x: 860, y: 190,  size: 18, delay: 15,  color: SOL_GOLD },
    { x: 95,  y: 750,  size: 16, delay: 30,  color: FLAG_BLUE },
    { x: 950, y: 620,  size: 20, delay: 8,   color: SOL_GOLD },
    { x: 310, y: 1100, size: 15, delay: 22,  color: FLAG_BLUE },
    { x: 820, y: 980,  size: 18, delay: 40,  color: SOL_GOLD },
    { x: 130, y: 1400, size: 14, delay: 5,   color: SOL_GOLD },
    { x: 940, y: 1350, size: 17, delay: 35,  color: FLAG_BLUE },
    { x: 550, y: 130,  size: 13, delay: 18,  color: FLAG_BLUE },
    { x: 700, y: 1600, size: 16, delay: 12,  color: SOL_GOLD },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: transparent ? 'transparent' : BG }}>
      {/* White background blobs */}
      <svg style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        {/* Top left */}
        <path d="M 0 0 L 500 0 C 400 250, 200 350, 0 300 Z" fill="white" opacity={0.55} />
        {/* Top right */}
        <path d="M 1080 0 L 500 0 C 700 150, 850 400, 1080 350 Z" fill="white" opacity={0.55} />
        {/* Mid right */}
        <path d="M 1080 400 C 850 450, 750 750, 1080 900 Z" fill="white" opacity={0.55} />
        {/* Mid left */}
        <path d="M 0 500 C 250 600, 350 900, 0 1000 Z" fill="white" opacity={0.55} />
        {/* Bottom left */}
        <path d="M 0 1100 C 300 1200, 400 1550, 0 1650 Z" fill="white" opacity={0.55} />
        {/* Bottom right */}
        <path d="M 1080 1200 C 750 1250, 650 1650, 1080 1800 Z" fill="white" opacity={0.55} />
        {/* Bottom center */}
        <path d="M 0 1920 L 1080 1920 L 1080 1700 C 750 1500, 350 1650, 0 1550 Z" fill="white" opacity={0.55} />
      </svg>

      {/* Background arc decorators */}
      <svg style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <ArcDeco cx={180} cy={220} r={200} opacity={0.7} />
        <ArcDeco cx={900} cy={800} r={240} opacity={0.6} />
        <ArcDeco cx={150} cy={1400} r={280} opacity={0.7} />
        <ArcDeco cx={850} cy={1650} r={220} opacity={0.6} />
      </svg>

      {/* Waving flag stripe */}
      <WavingFlag opacity={flagOpacity} />

      {/* Sparkles overlay */}
      <svg style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        {sparkles.map((s, i) => (
          <Sparkle key={i} {...s} />
        ))}
      </svg>

      {/* Sol de Mayo centered on flag */}
      <svg style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <SolDeMayo cx={W / 2} cy={solY} r={220} />
      </svg>

      {/* Children overlay (text, etc.) */}
      {children}
    </AbsoluteFill>
  );
};
