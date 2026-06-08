// ─── Spring physics presets ────────────────────────────────────────────────
export const SPRINGS = {
  SUAVE: { damping: 200, mass: 1, stiffness: 100 },
  GENTLE: { damping: 200, mass: 1, stiffness: 80 },
  POP: { damping: 14, mass: 0.9, stiffness: 110 },
  SNAP: { damping: 20, mass: 1, stiffness: 200 },
  // WHIP: springTiming({ config: { damping: 200, stiffness: 120 } }) — Phase 2
} as const;

// ─── Brand palette ─────────────────────────────────────────────────────────
export const COLORS = {
  dark: '#2c210c',
  amber: '#fbab4a',
  yellow: '#f7edb0',
  cream: '#FDF8E7',
} as const;

// ─── Scene durations — calibrated with Whisper word_timestamps (2026-06-07) ──
// elevenlabs_beats.mp3: 13.27s — Whisper base model, language=es
//   "máquina de café profesional" → 0.00s  – 1.40s  (Beat1, +12f breath)
//   "cápsulas premium variadas"   → 2.12s  – 3.76s  (Beat2)
//   "vajilla elegante"            → 4.76s  – 5.84s  (Beat3)
//   "montaje completo, retiros..."→ 6.30s  – 12.66s (Beat4 — furgoneta scene)
export const SCENE_FRAMES = {
  hook: 113,  // = hook_vo.mp3 duration  (3.76 s)
  beat1: 54,  // 0.00s → 1.80s — "Máquina de café profesional"
  beat2: 49,  // 2.12s → 3.76s — "Cápsulas premium variadas"
  beat3: 32,  // 4.76s → 5.84s — "Vajilla elegante"
  beat4: 191, // 6.30s → 12.66s — "Retiros sin rastros / Montaje completo"
} as const;

export const REEL_TOTAL_FRAMES =
  SCENE_FRAMES.hook + SCENE_FRAMES.beat1 + SCENE_FRAMES.beat2 + SCENE_FRAMES.beat3 + SCENE_FRAMES.beat4;

// ─── startFrom offsets (frames) into elevenlabs_beats.mp3 ───────────────────
export const BEATS_VO_OFFSETS = {
  beat1: 0,    // 0.00s — "Máquina de café profesional"
  beat2: 64,   // 2.12s — "Cápsulas premium variadas"
  beat3: 143,  // 4.76s — "Vajilla elegante"
  beat4: 189,  // 6.30s — "Montaje completo, retiros sin rastros..."
} as const;

// ─── Phase 2 transition placeholders ──────────────────────────────────────
export const TRANSITION_CONFIG = [
  { id: 'hook-to-beat1', type: 'slide', direction: 'from-right', durationFrames: 0 },
  { id: 'beat1-to-beat2', type: 'slide', direction: 'from-bottom', durationFrames: 0 },
  { id: 'beat2-to-beat3', type: 'slide', direction: 'from-right', durationFrames: 0 },
  { id: 'beat3-to-beat4', type: 'slide', direction: 'from-bottom', durationFrames: 0 },
] as const;
