/**
 * SaaSRefComposition
 * Faithful recreation of "How to Edit Viral SaaS Animations in 2026"
 * Excludes all person/face scenes; reproduces every other visual element:
 *   animations, transitions, subtitles, SVGs, titles, UI cards.
 *
 * Scenes (at 30 fps):
 *   S1  0–150f   (0–5s)    Kinetic text intro — "The SAAS Animations…"
 *   S2  150–390f (5–13s)   Glowing money pill  $800 → $2,000 + "per video"
 *   S3  390–750f (13–25s)  "This is UE 2.0" card → Fastest/Easiest → In 2026
 *   S4  750–990f (25–33s)  Course grid inside browser card + cursor
 *   S5  990–1080f (33–36s) Unlock dark card + cursor click
 *   S6  1080–1140f(36–38s) Course thumbnail zoom (cream card)
 *   S7  1140–1312f(38–43.7s) "Making Ultimate Editors" CTA
 */
import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily: inter } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
});

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:          '#060c1e',
  bgGlow:      '#0e2468',
  cardBg:      'rgba(240, 242, 255, 1)',
  cardBorder:  'rgba(110, 150, 255, 0.38)',
  cardShadow:  '0 0 70px rgba(80,120,255,0.28), 0 0 140px rgba(60,90,200,0.10)',
  pillTop:     '#3e7af0',
  pillBot:     '#1a42c0',
  pillGreenGlow: '#00d4a0',
  white:       '#ffffff',
  purpleDark:  '#3b1672',
  purpleMid:   '#7c3aed',
  purpleLight: '#c084fc',
  textGray:    '#6b7280',
  textDark:    '#1f2937',
} as const;

const SP = {
  GENTLE: { damping: 200, mass: 1,   stiffness: 80  },
  POP:    { damping: 14,  mass: 0.9, stiffness: 110 },
  SNAP:   { damping: 20,  mass: 1,   stiffness: 200 },
} as const;

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Dark navy background with radial blue glow */
const DarkBg: React.FC<{ gx?: number; gy?: number; gr?: number }> = ({
  gx = 50, gy = 50, gr = 65,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse ${gr}% ${Math.round(gr * 0.6)}% at ${gx}% ${gy}%, ${C.bgGlow} 0%, ${C.bg} 68%)`,
    }}
  />
);

/** Floating rounded white card, centered on screen */
const Card: React.FC<{
  w?: number; h?: number;
  scale?: number; opacity?: number;
  dark?: boolean;
  rotateX?: number;
  rotateY?: number;
  children: React.ReactNode;
}> = ({ w = 760, h = 450, scale = 1, opacity = 1, dark = false, rotateX = 0, rotateY = 0, children }) => (
  <div
    style={{
      position: 'absolute',
      left: '50%', top: '50%',
      width: w, height: h,
      transform: `translate(-50%, -50%) perspective(1200px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      opacity,
      backgroundColor: dark ? '#0e1526' : C.cardBg,
      borderRadius: 26,
      border: `1.5px solid ${dark ? 'rgba(90,130,255,0.55)' : C.cardBorder}`,
      boxShadow: dark
        ? '0 0 60px rgba(80,120,255,0.38), 0 0 120px rgba(60,90,200,0.18), inset 0 0 80px rgba(0,0,0,0.55)'
        : C.cardShadow,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

/** UE App icon — dark purple square with star + "UE" */
const UEIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <div
    style={{
      width: size, height: size,
      background: 'linear-gradient(145deg, #2d1b50 0%, #160e2e 100%)',
      borderRadius: size * 0.22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 3px 10px rgba(0,0,0,0.45)',
      position: 'relative',
      flexShrink: 0,
    }}
  >
    {/* Star sparkle top-left */}
    <svg
      width={size * 0.36}
      height={size * 0.36}
      viewBox="0 0 20 20"
      style={{ position: 'absolute', top: '7%', left: '7%' }}
    >
      <path
        d="M10 1L12 8H19L13.5 12.5L15.5 19.5L10 15L4.5 19.5L6.5 12.5L1 8H8Z"
        fill="#c084fc"
      />
    </svg>
    <span
      style={{
        color: '#ffffff',
        fontFamily: inter,
        fontWeight: 800,
        fontSize: size * 0.3,
        letterSpacing: '-0.5px',
        marginTop: size * 0.14,
      }}
    >
      UE
    </span>
  </div>
);

/** Animated mouse cursor SVG */
const Cursor: React.FC<{ x: number; y: number; opacity?: number; clicking?: boolean }> = ({
  x, y, opacity = 1, clicking = false,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x, top: y,
      opacity,
      zIndex: 50,
      pointerEvents: 'none',
      transform: clicking ? 'scale(0.88)' : 'scale(1)',
      transition: 'transform 0.08s',
    }}
  >
    <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
      <path
        d="M2 2L2 22L8 16L12 26L15.5 24.5L11.5 14.5L19 14.5Z"
        fill="white"
        stroke="#1a1a2e"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// ─── S1: Kinetic Text Intro ───────────────────────────────────────────────────
const KINETIC_TEXT = 'The SAAS Animations';
const CHARS = KINETIC_TEXT.split('');
const CHAR_STAGGER = 3; // frames per character
// Estimated average px width per character for Inter 900 at 74px (mixed case)
const AVG_CHAR_W = 42;
const TEXT_CENTER = (CHARS.length * AVG_CHAR_W) / 2;

const KineticIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Single zoom-out spring: starts zoomed in as first chars appear, settles to 1.0
  // No lateral movement \u2014 text is always horizontally centered.
  const scaleSpr = spring({ fps, frame, config: { damping: 22, mass: 1.2, stiffness: 58 } });
  const scaleVal = interpolate(scaleSpr, [0, 1], [1.4, 1.0]);

  // Exit at frame 88: text drifts UP while blurring out (matches reference at 0:04)
  const exitOp   = interpolate(frame, [85, 114], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitY    = interpolate(frame, [85, 116], [0, -55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exitBlur = interpolate(frame, [85, 112], [0, 26],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // "is absolutely" \u2014 appears at frame 100, upper area (\u224833% from top like the reference).
  // Tiny quick zoom-in then zoom-out pulse, starts blurry then clears.
  // "is absolutely" — 3 phases:
  // Phase 1 (frame 85+): LARGE (2.4x) + BLURRY at screen center (zoom-in state)
  // Phase 2: POP spring zooms OUT to 1x + focuses + rises 168px to upper area, with bounce
  // Phase 3 (frame 138-150): exits UP with blur before the flash cut
  const absSpr = spring({ fps, frame: Math.max(0, frame - 85), config: SP.POP });
  // No extrapolateRight clamp on scale/moveY so the overshoot creates the bounce
  const absScale  = interpolate(absSpr, [0, 1], [2.4, 1.0]);
  const absMoveY  = interpolate(absSpr, [0, 1], [0, -168]);
  const absBlur   = interpolate(absSpr, [0, 0.55], [24, 0], { extrapolateRight: 'clamp' });
  const absOp     = interpolate(absSpr, [0, 0.15], [0, 1],  { extrapolateRight: 'clamp' });
  const absExitY    = interpolate(frame, [138, 150], [0, -44], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const absExitBlur = interpolate(frame, [138, 150], [0, 18],  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const absExitOp   = interpolate(frame, [136, 150], [1, 0],   { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <DarkBg gx={50} gy={48} gr={72} />

      {/* Kinetic title \u2014 always centered, NO lateral camera movement.
          Exits upward with blur at frame 88. */}
      <div
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: `translate(-50%, -50%) translateY(${exitY}px)`,
          opacity: exitOp,
          filter: exitBlur > 0 ? `blur(${exitBlur}px)` : undefined,
        }}
      >
        <div
          style={{
            transform: `scale(${scaleVal})`,
            display: 'flex',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            alignItems: 'center',
          }}
        >
          {CHARS.map((ch, i) => {
            const f   = Math.max(0, frame - i * CHAR_STAGGER);
            const spr = spring({ fps, frame: f, config: SP.GENTLE });
            const op  = interpolate(spr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
            const bl  = interpolate(spr, [0, 1],   [10, 0]);
            const sc  = interpolate(spr, [0, 1],   [1.5, 1]);
            // Spread-from-center: chars start clustered at the text midpoint, fly to natural positions
            const naturalX = i * AVG_CHAR_W + AVG_CHAR_W / 2 - TEXT_CENTER;
            const spreadX  = interpolate(spr, [0, 1], [-naturalX * 0.85, 0]);
            return (
              <span key={i} style={{ display: 'inline-block', transform: `translateX(${spreadX}px)` }}>
                <span
                  style={{
                    fontFamily: inter,
                    fontSize: 74,
                    fontWeight: 900,
                    color: C.white,
                    display: 'inline-block',
                    opacity: op,
                    filter: `blur(${bl}px)`,
                    transform: `scale(${sc})`,
                    textShadow: '0 0 22px rgba(120,170,255,0.85), 0 0 50px rgba(90,140,255,0.45)',
                    letterSpacing: '1.5px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* "is absolutely" \u2014 upper third of screen (\u224833% from top), plain text.
          Quick zoom-in \u2192 zoom-out pulse with blur clear, matching the reference at 0:05. */}
      {/* "is absolutely": large+blurry at center, POP spring zooms out to upper area with bounce,
          then exits upward with blur at frame 138. */}
      <div
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: `translate(-50%, -50%) translateY(${absMoveY + absExitY}px) scale(${absScale})`,
          opacity: absOp * absExitOp,
          filter: (absBlur + absExitBlur) > 0 ? `blur(${absBlur + absExitBlur}px)` : undefined,
        }}
      >
        <span style={{
          fontFamily: inter,
          fontSize: 32,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '2px',
          textShadow: '0 0 20px rgba(140,180,255,0.55)',
          whiteSpace: 'nowrap',
        }}>is absolutely</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── S2: Money Pill Counter ───────────────────────────────────────────────────
const MoneyPillScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pill entrance (pop)
  const enterSpr = spring({ fps, frame, config: SP.POP });
  const pillScale = interpolate(enterSpr, [0, 1], [0.15, 1]);
  const pillOp    = interpolate(enterSpr, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' });

  // Counter: blurry  → $1,081 (frame 30) → $2,000 (frame 90)
  const amount = Math.round(
    interpolate(frame, [0, 30, 90], [820, 1081, 2000], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );
  const isBlurring = frame < 18;
  const numBlur    = interpolate(frame, [0, 20], [12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Green border line pulses in at frame 80
  const greenOp = interpolate(frame, [72, 92], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Pill glow pulse
  const pulse = 0.90 + 0.10 * Math.sin(frame * 0.09);

  // "per video" slides in at frame 90 with ghost echo
  const pvOp = interpolate(frame, [90, 112], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const pvX  = interpolate(frame, [90, 118], [28, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Camera dynamic zoom-in
  const camScale = interpolate(frame, [0, 240], [0.96, 1.10]);

  // Transition out
  const outScale = interpolate(frame, [230, 240], [1, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outOp = interpolate(frame, [234, 240], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: outOp }}>
      <DarkBg gx={50} gy={50} gr={68} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${camScale * outScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${pillScale})`,
            opacity: pillOp,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          {/* ── Pill ── */}
          <div style={{ position: 'relative' }}>
            {/* Outer gradient border ring */}
            <div
              style={{
                position: 'absolute',
                inset: -2.5,
                borderRadius: 999,
                background: `linear-gradient(175deg, rgba(110,170,255,0.9) 0%, ${C.pillGreenGlow} 100%)`,
                opacity: 0.7 + 0.3 * pulse,
              }}
            />
            {/* Inner fill */}
            <div
              style={{
                position: 'relative',
                background: `linear-gradient(180deg, ${C.pillTop} 0%, ${C.pillBot} 100%)`,
                borderRadius: 999,
                padding: '22px 72px',
                boxShadow: `0 0 ${44 * pulse}px rgba(62,122,240,0.72),
                            0 0 ${88 * pulse}px rgba(62,122,240,0.36),
                            inset 0 1px 0 rgba(255,255,255,0.22)`,
              }}
            >
              {/* Green glow line bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -5, left: '12%', right: '12%',
                  height: 3.5,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, transparent, ${C.pillGreenGlow}, transparent)`,
                  filter: 'blur(2px)',
                  opacity: greenOp,
                }}
              />
              <span
                style={{
                  fontFamily: inter,
                  fontSize: 78,
                  fontWeight: 900,
                  color: C.white,
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  display: 'block',
                  filter: isBlurring ? `blur(${numBlur}px)` : undefined,
                  textShadow: '0 2px 6px rgba(0,0,0,0.35)',
                }}
              >
                ${amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* "per video" with ghost echo */}
          <div
            style={{
              opacity: pvOp,
              transform: `translateX(${pvX}px)`,
              position: 'relative',
            }}
          >
            {/* Ghost (one line above) */}
            <div
              style={{
                position: 'absolute',
                top: -24,
                left: 0,
                fontFamily: inter,
                fontSize: 22,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.18)',
                whiteSpace: 'nowrap',
              }}
            >
              per video
            </div>
            {/* Main */}
            <div
              style={{
                fontFamily: inter,
                fontSize: 22,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.90)',
                whiteSpace: 'nowrap',
              }}
            >
              per video
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── S3: UE Card — 3 sub-phases ──────────────────────────────────────────────

/**
 * Animated concentric ROUNDED-RECTANGLE rings that expand outward from the "2.0" badge.
 * Shape matches the reference: pill-ish rounded rect, NOT circular. Colors run from
 * dark purple (inner) to white/lavender (outer).
 */
const AnimatedRings: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // maxW / maxH define final size; br is fixed border-radius in px (rounded rect, not pill)
  // Array order = render order = z-order: index 0 renders BEHIND, last renders IN FRONT.
  // Outermost (white) is index 0 (behind); innermost (dark purple) is index 3 (in front).
  // Delays: outermost appears last (delay 18), innermost appears first (delay 0),
  // so the ripple starts tight around the badge and expands outward with lighter layers behind.
  const rings = [
    { delay: 18, fill: 'rgba(248,244,255,0.82)', maxW: 688, maxH: 200, br: 56 }, // outermost — white
    { delay: 12, fill: 'rgba(215,185,255,0.78)', maxW: 524, maxH: 154, br: 50 }, // lavender
    { delay: 6,  fill: 'rgba(165,100,255,0.82)', maxW: 378, maxH: 114, br: 44 }, // medium purple
    { delay: 0,  fill: 'rgba(112,48,238,0.92)',  maxW: 240, maxH: 76,  br: 38 }, // innermost — dark purple
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 26 }}>
      {rings.map((ring, i) => {
        const ringSpr = spring({
          fps,
          frame: Math.max(0, frame - ring.delay),
          config: { damping: 32, mass: 1, stiffness: 55 },
        });
        const w  = interpolate(ringSpr, [0, 1], [0, ring.maxW]);
        const h  = interpolate(ringSpr, [0, 1], [0, ring.maxH]);
        const op = interpolate(ringSpr, [0, 0.12, 0.65, 1], [0, 1, 0.90, 0.75]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: w,
              height: h,
              transform: 'translate(-50%, -50%)',
              borderRadius: ring.br,
              backgroundColor: ring.fill,
              opacity: op,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Compact rounded pill-card for Fastest / Easiest
 * Matches the reference: small lavender rounded rect with icon + label.
 */
const FeaturePill: React.FC<{
  label: string;
  icon: React.ReactNode;
  side: 'left' | 'right';
  slideX: number;
  opacity: number;
}> = ({ label, icon, side, slideX, opacity }) => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      [side]: 32,
      transform: `translateY(-50%) translateX(${side === 'left' ? slideX : -slideX}px)`,
      opacity,
      width: 190,
      height: 200,
      background: 'linear-gradient(145deg, rgba(235,220,255,0.95) 0%, rgba(215,190,255,0.85) 100%)',
      borderRadius: 28,
      border: '1.5px solid rgba(190,155,255,0.45)',
      boxShadow: '0 6px 30px rgba(140,90,255,0.14)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    }}
  >
    {icon}
    <span
      style={{
        fontFamily: inter,
        fontSize: 20,
        fontWeight: 700,
        color: '#7c3aed',
        letterSpacing: '0.2px',
      }}
    >
      {label}
    </span>
  </div>
);

const BoltIcon = (id: string) => (
  <svg width={58} height={58} viewBox="0 0 40 40">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#fbbf24" />
        <stop offset="50%"  stopColor="#f97316" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>
    <path d="M23 2 L9 23 H20 L17 38 L31 17 H20 Z" fill={`url(#${id})`} />
  </svg>
);

const HandIcon = (id: string) => (
  <svg width={58} height={58} viewBox="0 0 40 40">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path
      d="M20 5 C18 5 17 6.5 17 8 L17 20 C15 19 12.5 19.5 12.5 22 L12.5 29 C12.5 34 16 38 20 38 C24 38 27.5 34 27.5 29 L27.5 11 C27.5 9 26.5 8 25 8 L25 14 C25 12 24 11 22.5 11 L22.5 8 C22.5 6.5 21.5 5 20 5 Z"
      fill={`url(#${id})`}
    />
  </svg>
);

const UECardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cSpr    = spring({ fps, frame, config: SP.GENTLE });
  const cScale  = interpolate(cSpr, [0, 1], [0.84, 1]);
  const cOp     = interpolate(cSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Phase 1 — "This is UE 2.0"  (frames 0-85)
  const p1Op = interpolate(frame, [0, 14, 68, 84], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // "2.0" badge pop
  const badgeSpr = spring({ fps, frame: Math.max(0, frame - 18), config: SP.POP });
  const badgeX   = interpolate(badgeSpr, [0, 1], [24, 0]);
  const badgeOp  = interpolate(badgeSpr, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });

  // Phase 2 — Fastest / UE / Easiest  (frames 80-245)
  const p2Op = interpolate(frame, [78, 98, 230, 248], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const colOp = interpolate(frame, [82, 105], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const leftSpr  = spring({ fps, frame: Math.max(0, frame - 83), config: SP.POP });
  const leftX    = interpolate(leftSpr, [0, 1], [-70, 0]);
  const rightSpr = spring({ fps, frame: Math.max(0, frame - 90), config: SP.POP });
  const rightX   = interpolate(rightSpr, [0, 1], [-70, 0]);

  // Phase 3 — "In 2026"  (frames 240-360)
  const p3Op = interpolate(frame, [238, 260], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const in2026Spr   = spring({ fps, frame: Math.max(0, frame - 242), config: SP.POP });
  const in2026Scale = interpolate(in2026Spr, [0, 1], [0.4, 1]);
  const in2026Op    = interpolate(in2026Spr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Subtle 3D tilt transformation
  const tiltX = interpolate(frame, [0, 360], [-2.5, 2.5]);
  const tiltY = interpolate(frame, [0, 360], [4, -4]);

  // Transition out
  const outScale = interpolate(frame, [350, 360], [1, 0.92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outOp = interpolate(frame, [354, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: outOp }}>
      <DarkBg gx={50} gy={50} gr={62} />

      <Card scale={cScale * outScale} opacity={cOp} rotateX={tiltX} rotateY={tiltY}>

        {/* Card bg: light lavender/white */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #f8f6ff 0%, #ede9fd 100%)',
        }} />

        {/* ── Phase 1: "This is UE 2.0" ── */}
        <div style={{ position: 'absolute', inset: 0, opacity: p1Op }}>
          {/* Animated expanding concentric rings */}
          <AnimatedRings frame={frame} fps={fps} />

          {/* Purple blob glow at sides */}
          {[
            { left: -35, top: '28%', w: 170, h: 130 },
            { right: -35, top: '32%', w: 170, h: 130 },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: s.w, height: s.h,
                ...s,
                background: 'radial-gradient(ellipse, rgba(165,90,255,0.22) 0%, transparent 70%)',
                filter: 'blur(18px)',
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 16, zIndex: 5,
            }}
          >
            <span
              style={{
                fontFamily: inter, fontSize: 22, fontWeight: 500,
                color: '#6b7280',
              }}
            >
              This is
            </span>
            <UEIcon size={54} />
            {/* 2.0 badge — pill shaped */}
            <div
              style={{
                opacity: badgeOp,
                transform: `translateX(${badgeX}px)`,
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                borderRadius: 999,
                padding: '8px 24px',
                color: C.white,
                fontFamily: inter,
                fontWeight: 700,
                fontSize: 21,
                letterSpacing: '0.5px',
                boxShadow: '0 4px 18px rgba(124,58,237,0.55)',
              }}
            >
              2.0
            </div>
          </div>
        </div>

        {/* ── Phase 2: Fastest / UE center / Easiest ── */}
        <div style={{ position: 'absolute', inset: 0, opacity: p2Op }}>
          {/* Left pill card: Fastest */}
          <FeaturePill
            label="Fastest"
            icon={BoltIcon('bolt-a')}
            side="left"
            slideX={leftX}
            opacity={colOp}
          />

          {/* Center: UE icon */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <UEIcon size={62} />
          </div>

          {/* Right pill card: Easiest */}
          <FeaturePill
            label="Easiest"
            icon={HandIcon('hand-a')}
            side="right"
            slideX={rightX}
            opacity={colOp}
          />
        </div>

        {/* ── Phase 3: "In 2026" replaces center icon ── */}
        <div style={{ position: 'absolute', inset: 0, opacity: p3Op }}>
          {/* Keep side pills */}
          <FeaturePill label="Fastest" icon={BoltIcon('bolt-b')} side="left"  slideX={0} opacity={1} />
          <FeaturePill label="Easiest" icon={HandIcon('hand-b')} side="right" slideX={0} opacity={1} />

          {/* Center: "In 2026" box pops in */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 90, height: 90,
                background: C.white,
                borderRadius: 20,
                border: '1.5px solid rgba(180,140,255,0.35)',
                boxShadow: '0 4px 22px rgba(120,80,255,0.12)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                transform: `scale(${in2026Scale})`,
                opacity: in2026Op,
              }}
            >
              <span style={{
                fontFamily: inter, fontSize: 13, fontWeight: 400,
                color: C.textGray, lineHeight: 1,
              }}>In</span>
              <span style={{
                fontFamily: inter, fontSize: 24, fontWeight: 800,
                color: '#7c3aed', lineHeight: 1.1,
              }}>2026</span>
            </div>
          </div>
        </div>

      </Card>
    </AbsoluteFill>
  );
};

// ─── S4: Course Grid ──────────────────────────────────────────────────────────
interface CourseData {
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
  tag?: string;
}

const COURSES_ROW1: CourseData[] = [
  {
    title: 'Cinematic Short-Film',
    subtitle: 'Cinematic Short-Film Editing Style. Go from beginner to pro…',
    bg: 'linear-gradient(145deg, #111827 0%, #1a2035 100%)',
    accent: '#c084fc',
    tag: '$1,000/mo',
  },
  {
    title: 'Editing Fundamentals',
    subtitle: 'The Editing Fundamentals. Learn the Fundamentals of High-Level Video Editing.',
    bg: 'linear-gradient(145deg, #131320 0%, #1c1c35 100%)',
    accent: '#818cf8',
    tag: 'The Premiere Pro Masterclass',
  },
  {
    title: 'Minimal Animations',
    subtitle: 'The Minimal Animation Masterclass. Master the Professional Minimal…',
    bg: 'linear-gradient(145deg, #1e1040 0%, #2d1668 100%)',
    accent: '#c084fc',
    tag: 'The After Effects Masterclass',
  },
];

const COURSES_ROW2: CourseData[] = [
  {
    title: 'SAAS Animations',
    subtitle: 'SaaS Animations Masterclass.',
    bg: 'linear-gradient(145deg, #1a0e3c 0%, #2c1268 100%)',
    accent: '#a855f7',
    tag: '',
  },
  {
    title: 'Viral Animation Breakdowns',
    subtitle: 'Viral Animation Breakdowns.',
    bg: 'linear-gradient(145deg, #0e0e0e 0%, #1a1a1a 100%)',
    accent: '#c084fc',
    tag: '',
  },
  {
    title: '$2,000/mo Editor Blueprint',
    subtitle: 'The $2,000/mo Editor SaaS Blueprint.',
    bg: 'linear-gradient(145deg, #1a0a08 0%, #2c1008 100%)',
    accent: '#f97316',
    tag: '',
  },
];

const Thumb: React.FC<CourseData> = ({ title, subtitle, bg, accent, tag }) => (
  <div
    style={{
      flex: '1 1 0',
      minWidth: 0,
      height: 118,
      background: bg,
      borderRadius: 10,
      padding: '11px 13px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    {tag && (
      <span style={{
        fontFamily: inter, fontSize: 8.5, fontWeight: 500,
        color: 'rgba(255,255,255,0.45)',
        textTransform: 'uppercase', letterSpacing: '0.6px',
      }}>{tag}</span>
    )}
    <span style={{
      fontFamily: inter, fontSize: 12.5, fontWeight: 700,
      color: C.white, lineHeight: 1.3,
    }}>{title}</span>
    <span style={{
      fontFamily: inter, fontSize: 8.5, fontWeight: 400,
      color: 'rgba(255,255,255,0.50)', lineHeight: 1.3,
    }}>{subtitle.slice(0, 60)}</span>
    {/* Accent glow circle */}
    <div style={{
      position: 'absolute', right: -18, bottom: -18,
      width: 66, height: 66, borderRadius: '50%',
      background: `radial-gradient(circle, ${accent}35 0%, transparent 70%)`,
    }} />
  </div>
);

const CourseGridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cSpr   = spring({ fps, frame, config: SP.GENTLE });
  const cScale = interpolate(cSpr, [0, 1], [0.91, 1]);
  const cOp    = interpolate(cSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Content scrolls up
  const scrollY = interpolate(frame, [55, 190], [0, -118], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Cursor coordinates
  const cursorOp = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cursorX = interpolate(
    frame, [60, 130, 200, 240],
    [420, 320, 328, 320],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cursorY = interpolate(
    frame, [60, 130, 200, 240],
    [170, 174, 175, 178],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const clicking = frame > 180 && frame < 210;

  // Camera zoom-in spring as the cursor enters and moves
  const zoomSpr = spring({ fps, frame: Math.max(0, frame - 60), config: SP.GENTLE });
  const zoomScale = interpolate(zoomSpr, [0, 1], [1, 1.15]);

  // Center of card is (380, 225). Shift camera to follow cursor.
  const targetDx = -(cursorX - 380) * 0.45;
  const targetDy = -(cursorY - 225) * 0.45;

  const camDx = interpolate(zoomSpr, [0, 1], [0, targetDx]);
  const camDy = interpolate(zoomSpr, [0, 1], [0, targetDy]);

  // Subtle 3D tilt transformation based on cursor
  const tiltX = interpolate(cursorY, [0, 450], [2.2, -2.2]);
  const tiltY = interpolate(cursorX, [0, 760], [-3.2, 3.2]);
  // Transition out
  const outScale = interpolate(frame, [230, 240], [1, 0.92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const outOp = interpolate(frame, [234, 240], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: outOp }}>
      <DarkBg gx={50} gy={50} gr={62} />

      {/* Camera zoom/pan wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoomScale}) translate(${camDx}px, ${camDy}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card scale={cScale * outScale} opacity={cOp} rotateX={tiltX} rotateY={tiltY}>
          {/* Browser-style top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 30,
            background: 'rgba(235,237,255,0.95)',
            borderBottom: '1px solid rgba(180,185,230,0.32)',
            display: 'flex', alignItems: 'center',
            paddingLeft: 12, gap: 5, zIndex: 10,
          }}>
            {['#ff5f57', '#ffbd2e', '#28ca41'].map((col, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: col }} />
            ))}
          </div>

          {/* Scrollable grid */}
          <div style={{
            position: 'absolute', top: 30, left: 0, right: 0, bottom: 0, overflow: 'hidden',
          }}>
            <div style={{
              transform: `translateY(${scrollY}px)`,
              padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 10 }}>
                {COURSES_ROW1.map((c, i) => <Thumb key={i} {...c} />)}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {COURSES_ROW2.map((c, i) => <Thumb key={i} {...c} />)}
              </div>
            </div>
          </div>

          <Cursor x={cursorX} y={cursorY} opacity={cursorOp} clicking={clicking} />
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ─── S5: Unlock Scene ─────────────────────────────────────────────────────────
const UnlockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cSpr   = spring({ fps, frame, config: SP.GENTLE });
  const cScale = interpolate(cSpr, [0, 1], [0.90, 1]);
  const cOp    = interpolate(cSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  const btnSpr   = spring({ fps, frame: Math.max(0, frame - 18), config: SP.POP });
  const btnScale = interpolate(btnSpr, [0, 1], [0.35, 1]);
  const btnOp    = interpolate(btnSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Camera zoom in as the scene proceeds
  const zoomSpr = spring({ fps, frame, config: SP.GENTLE });
  const zoomScale = interpolate(zoomSpr, [0, 1], [1, 1.22]);

  // Click impact shake/bounce at frame 80
  const clickImpactSpr = spring({ fps, frame: Math.max(0, frame - 80), config: SP.SNAP });
  const clickScale = interpolate(clickImpactSpr, [0, 0.15, 0.7, 1], [1, 0.95, 1.01, 1]);
  const clickRotate = interpolate(clickImpactSpr, [0, 0.08, 0.22, 0.4, 1], [0, -1.8, 1.2, -0.4, 0]);

  // Button compression when clicked
  const btnClickScale = interpolate(clickImpactSpr, [0, 0.1, 0.4], [1, 0.88, 1]);

  const glowPulse = 0.85 + 0.15 * Math.sin(frame * 0.14);

  // Cursor moves toward the button
  const cursorX = interpolate(frame, [0, 50, 80], [110, 238, 284], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [0, 50, 80], [170, 206, 222], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const clicking = frame >= 80;

  // Subtle 3D tilt transformation based on cursor
  const tiltX = interpolate(cursorY, [0, 450], [2.2, -2.2]);
  const tiltY = interpolate(cursorX, [0, 760], [-3.2, 3.2]);

  return (
    <AbsoluteFill>
      <DarkBg gx={50} gy={50} gr={58} />

      {/* Camera wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoomScale * clickScale}) rotate(${clickRotate}deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card scale={cScale} opacity={cOp} dark rotateX={tiltX} rotateY={tiltY}>
          {/* Radial flare */}
          <div
            style={{
              position: 'absolute',
              left: '22%', top: '38%',
              width: 200, height: 200,
              background: `radial-gradient(circle, rgba(255,255,255,${0.14 * glowPulse}) 0%, transparent 65%)`,
              filter: 'blur(10px)',
            }}
          />

          {/* Unlock button */}
          <div
            style={{
              position: 'absolute',
              left: '50%', top: '50%',
              transform: `translate(-50%, -50%) scale(${btnScale * btnClickScale})`,
              opacity: btnOp,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 999,
              padding: '15px 50px',
              boxShadow: '0 5px 28px rgba(0,0,0,0.30)',
            }}
          >
            <span style={{
              fontFamily: inter,
              fontSize: 28,
              fontWeight: 600,
              color: C.textDark,
              letterSpacing: '0.3px',
            }}>Unlock</span>
          </div>

          <Cursor x={cursorX} y={cursorY} opacity={1} clicking={clicking} />
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ─── S6: Course Thumbnail Zoom ────────────────────────────────────────────────
const CourseThumbnailZoomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cSpr   = spring({ fps, frame, config: SP.GENTLE });
  const cScale = interpolate(cSpr, [0, 1], [0.92, 1]);
  const cOp    = interpolate(cSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Thumbnail pops in
  const innerSpr   = spring({ fps, frame: Math.max(0, frame - 8), config: SP.POP });
  const innerScale = interpolate(innerSpr, [0, 1], [0.38, 1]);
  const innerOp    = interpolate(innerSpr, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });

  // Progressive zoom-in on the thumbnail (camera pull)
  const camZoom = interpolate(frame, [0, 60], [1, 1.18], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Warm glow bloom that expands around the thumbnail
  const glowBloom = interpolate(frame, [0, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <DarkBg gx={50} gy={50} gr={58} />

      <Card scale={cScale} opacity={cOp}>
        {/* Cream/warm card background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(145deg, #fffaf3 0%, #fef4ee 100%)',
        }} />

        {/* Camera zoom wrapper */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${camZoom})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Warm peach/pink glow bloom */}
          <div style={{
            position: 'absolute',
            width: 420, height: 260,
            borderRadius: 28,
            background: `radial-gradient(ellipse, rgba(255,160,120,${0.32 * glowBloom}) 0%, rgba(255,100,120,${0.14 * glowBloom}) 45%, transparent 72%)`,
            filter: 'blur(22px)',
          }} />

          {/* Inner dark course card */}
          <div
            style={{
              transform: `scale(${innerScale})`,
              opacity: innerOp,
              width: 330, height: 196,
              background: 'linear-gradient(145deg, #1c0a08 0%, #2e1208 100%)',
              borderRadius: 14,
              padding: '18px 22px',
              boxShadow: '0 14px 55px rgba(205,100,55,0.30), 0 2px 10px rgba(0,0,0,0.55)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 5,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Amber warm gradient inside thumbnail */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 14,
              background: 'radial-gradient(ellipse at 60% 80%, rgba(255,140,60,0.28) 0%, transparent 60%)',
            }} />
            <span style={{
              fontFamily: inter, fontSize: 10.5, fontWeight: 500,
              color: 'rgba(255,255,255,0.38)',
              textTransform: 'uppercase', letterSpacing: '0.9px',
            }}>#6</span>
            <span style={{
              fontFamily: inter, fontSize: 19, fontWeight: 800,
              color: C.white, lineHeight: 1.22,
            }}>
              $2,000/mo Editor{`\n`}Blueprint
            </span>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ─── S7: Making Ultimate Editors CTA ─────────────────────────────────────────
const MakingCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cSpr   = spring({ fps, frame, config: SP.GENTLE });
  const cScale = interpolate(cSpr, [0, 1], [0.90, 1]);
  const cOp    = interpolate(cSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // "Making" fades in (frame 0-18)
  const makingOp = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // "Ultimate Editors" pops in inline with "Making" at frame 30
  const titleSpr   = spring({ fps, frame: Math.max(0, frame - 30), config: SP.POP });
  const titleScale = interpolate(titleSpr, [0, 1], [0.50, 1]);
  const titleOp    = interpolate(titleSpr, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });

  // UE icon pops in at frame 58
  const iconSpr   = spring({ fps, frame: Math.max(0, frame - 58), config: SP.POP });
  const iconScale = interpolate(iconSpr, [0, 1], [0.20, 1]);
  const iconOp    = interpolate(iconSpr, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });

  // "The Best way" appears at frame 80 — part of a second row that slides in
  const tagSpr  = spring({ fps, frame: Math.max(0, frame - 80), config: SP.GENTLE });
  const tagOp   = interpolate(tagSpr, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const tagX    = interpolate(tagSpr, [0, 1], [18, 0]);

  // "Learn Video Editing In 2026" appears slightly after the first tag line
  const tag2Spr = spring({ fps, frame: Math.max(0, frame - 105), config: SP.GENTLE });
  const tag2Op  = interpolate(tag2Spr, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const tag2Y   = interpolate(tag2Spr, [0, 1], [10, 0]);

  return (
    <AbsoluteFill>
      <DarkBg gx={50} gy={50} gr={62} />

      <Card scale={cScale} opacity={cOp}>
        {/* Cream/light card background matching reference */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)',
        }} />

        {/* Purple ambient blobs on sides */}
        {[
          { left: -28, top: '18%', w: 145, h: 200 },
          { right: -28, top: '28%', w: 145, h: 200 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: s.w, height: s.h, ...s,
              background: 'radial-gradient(ellipse, rgba(160,85,255,0.22) 0%, transparent 70%)',
              filter: 'blur(26px)',
            }}
          />
        ))}

        {/* Content: all inline text centered */}
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 6,
          }}
        >
          {/* Row 1: "Making" + "Ultimate Editors" + [UE icon] inline */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'nowrap',
          }}>
            {/* Making */}
            <span style={{
              opacity: makingOp,
              fontFamily: inter,
              fontSize: 22,
              fontWeight: 400,
              color: '#6b7280',
              letterSpacing: '0.2px',
            }}>Making</span>

            {/* Ultimate Editors — purple bold stacked inline */}
            <div style={{
              opacity: titleOp,
              transform: `scale(${titleScale})`,
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              lineHeight: 1.15,
            }}>
              <span style={{
                fontFamily: inter,
                fontSize: 20,
                fontWeight: 800,
                color: C.purpleMid,
                letterSpacing: '-0.2px',
                lineHeight: 1.1,
              }}>Ultimate</span>
              <span style={{
                fontFamily: inter,
                fontSize: 20,
                fontWeight: 800,
                color: C.purpleMid,
                letterSpacing: '-0.2px',
                lineHeight: 1.1,
              }}>Editors</span>
            </div>

            {/* UE icon inline */}
            <div style={{
              opacity: iconOp,
              transform: `scale(${iconScale})`,
              display: 'inline-block',
            }}>
              <UEIcon size={40} />
            </div>

            {/* "The Best way" inline */}
            <div style={{
              opacity: tagOp,
              transform: `translateX(${tagX}px)`,
              display: 'inline-block',
            }}>
              <span style={{
                fontFamily: inter,
                fontSize: 22,
                fontWeight: 400,
                color: '#6b7280',
                letterSpacing: '0.2px',
              }}>The Best way to</span>
            </div>
          </div>

          {/* Row 2: "Learn Video Editing In 2026" — slides in below */}
          <div style={{
            opacity: tag2Op,
            transform: `translateY(${tag2Y}px)`,
          }}>
            <span style={{
              fontFamily: inter,
              fontSize: 22,
              fontWeight: 400,
              color: '#6b7280',
              letterSpacing: '0.2px',
            }}>Learn Video Editing In 2026</span>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ─── S_speaker: Speaker container (empty box) ────────────────────────────────
/**
 * The rounded-rectangle "window" that frames the speaker in the original video.
 * We render it empty (no person content). Appears between the kinetic intro and
 * the money-pill counter.
 */
const SpeakerBoxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance spring
  const cSpr   = spring({ fps, frame, config: SP.GENTLE });
  const cScale = interpolate(cSpr, [0, 1], [0.82, 1]);
  const cOp    = interpolate(cSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // Slow zoom that builds anticipation before the money-pill scene
  const camZoom = interpolate(frame, [0, 120], [1, 1.07], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Border glow pulse
  const pulse = 0.75 + 0.25 * Math.sin(frame * 0.09);

  return (
    <AbsoluteFill>
      <DarkBg gx={50} gy={52} gr={65} />

      {/* Camera zoom wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${camZoom})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Portrait rectangle — matches the vertical speaker box in the reference (0:06-0:07) */}
        <Card w={340} h={480} scale={cScale} opacity={cOp} dark>
          {/* Ambient inner glow — box is intentionally empty (no person content) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 50% 50%, rgba(80,120,255,${0.09 * pulse}) 0%, transparent 65%)`,
            }}
          />
        </Card>

        {/* Extra pulsing glow halo around the portrait box */}
        <div
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 344, height: 484,
            transform: 'translate(-50%, -50%)',
            borderRadius: 30,
            border: `1px solid rgba(90,140,255,${0.30 * pulse})`,
            boxShadow: `0 0 ${42 * pulse}px rgba(70,110,255,0.34), 0 0 ${85 * pulse}px rgba(50,90,200,0.16)`,
            pointerEvents: 'none',
            opacity: cOp,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene timing map ─────────────────────────────────────────────────────────
const T = {
  s1:        { from: 0,    dur: 150 },  // 0–5s    Kinetic intro
  s_speaker: { from: 150,  dur: 120 },  // 5–9s    Speaker box (empty)
  s2:        { from: 270,  dur: 240 },  // 9–17s   Money pill
  s3:        { from: 510,  dur: 360 },  // 17–29s  UE card phases
  s4:        { from: 870,  dur: 240 },  // 29–37s  Course grid
  s5:        { from: 1110, dur: 90  },  // 37–40s  Unlock
  s6:        { from: 1200, dur: 60  },  // 40–42s  Course zoom
  s7:        { from: 1260, dur: 172 },  // 42–47.7s Making CTA
} as const;

export const SAAS_TOTAL_FRAMES = T.s7.from + T.s7.dur; // 1432

// ─── Transition Overlay for screen flashes ──────────────────────────────────
const TransitionOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // White flash transitions at scene boundaries (updated for s_speaker insertion)
  const flash1 = interpolate(frame, [146,  150,  154 ], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // s1 → s_speaker
  const flash2 = interpolate(frame, [266,  270,  274 ], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // s_speaker → s2
  const flash3 = interpolate(frame, [506,  510,  514 ], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // s2 → s3
  const flash4 = interpolate(frame, [866,  870,  874 ], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // s3 → s4
  const flash5 = interpolate(frame, [1106, 1110, 1114], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // s4 → s5
  const flash6 = interpolate(frame, [1196, 1200, 1204], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // s5 → s6
  const flash7 = interpolate(frame, [1256, 1260, 1264], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }); // s6 → s7

  const totalFlash = Math.max(flash1, flash2, flash3, flash4, flash5, flash6, flash7);

  if (totalFlash <= 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#ffffff',
        opacity: totalFlash,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────
export const SaaSRefComposition: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Audio src={staticFile("saas_ref_audio.mp4")} />
    <TransitionOverlay />
    <Sequence from={T.s1.from} durationInFrames={T.s1.dur}>
      <KineticIntroScene />
    </Sequence>
    <Sequence from={T.s_speaker.from} durationInFrames={T.s_speaker.dur}>
      <SpeakerBoxScene />
    </Sequence>
    <Sequence from={T.s2.from} durationInFrames={T.s2.dur}>
      <MoneyPillScene />
    </Sequence>
    <Sequence from={T.s3.from} durationInFrames={T.s3.dur}>
      <UECardScene />
    </Sequence>
    <Sequence from={T.s4.from} durationInFrames={T.s4.dur}>
      <CourseGridScene />
    </Sequence>
    <Sequence from={T.s5.from} durationInFrames={T.s5.dur}>
      <UnlockScene />
    </Sequence>
    <Sequence from={T.s6.from} durationInFrames={T.s6.dur}>
      <CourseThumbnailZoomScene />
    </Sequence>
    <Sequence from={T.s7.from} durationInFrames={T.s7.dur}>
      <MakingCTAScene />
    </Sequence>
  </AbsoluteFill>
);
