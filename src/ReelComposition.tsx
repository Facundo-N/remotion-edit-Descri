import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { REEL_TOTAL_FRAMES, SCENE_FRAMES } from './constants';
import { HookScene } from './components/reel/HookScene';
import { Beat1Scene } from './components/reel/Beat1Scene';
import { Beat2Scene } from './components/reel/Beat2Scene';
import { Beat3Scene } from './components/reel/Beat3Scene';
import { Beat4Scene } from './components/reel/Beat4Scene';

export { REEL_TOTAL_FRAMES };

// Global start frame for each scene (simple cuts — Phase 2: TransitionSeries)
const S = {
  hook: 0,
  beat1: SCENE_FRAMES.hook,
  beat2: SCENE_FRAMES.hook + SCENE_FRAMES.beat1,
  beat3: SCENE_FRAMES.hook + SCENE_FRAMES.beat1 + SCENE_FRAMES.beat2,
  beat4: SCENE_FRAMES.hook + SCENE_FRAMES.beat1 + SCENE_FRAMES.beat2 + SCENE_FRAMES.beat3,
};

/**
 * Reel de cafetería — Fase 1 (Audio: elevenlabs_beats.mp3)
 * Total: hook(113) + beat1(54) + beat2(49) + beat3(32) + beat4(191) = 439 frames (~14.6 s)
 *
 * Scene boundaries verified with Whisper base model word_timestamps (2026-06-07):
 *   - Beat1 "Máquina de café profesional":  0.00s→1.80s (54f),  offset 0
 *   - Beat2 "Cápsulas premium variadas":     2.12s→3.76s (49f),  offset 64
 *   - Beat3 "Vajilla elegante":              4.76s→5.84s (32f),  offset 143
 *   - Beat4 "Retiros sin rastros":           6.30s→12.66s (191f), offset 189
 *
 * Phase 2: replace each Sequence pair with a TransitionSeries entry
 * using TRANSITION_CONFIG from constants.ts (type/direction/durationFrames).
 */
export const ReelComposition: React.FC = () => (
  <AbsoluteFill>
    {/* ── HOOK ──────────────────────────────────────────────────────── */}
    <Sequence from={S.hook} durationInFrames={SCENE_FRAMES.hook}>
      <HookScene />
    </Sequence>

    {/* ── BEAT 1 · Máquina de café profesional ──────────────────────
        Phase 2 → hook-to-beat1: slide from-right, ~230 ms           */}
    <Sequence from={S.beat1} durationInFrames={SCENE_FRAMES.beat1}>
      <Beat1Scene />
    </Sequence>

    {/* ── BEAT 2 · Cápsulas premium variadas ────────────────────────
        Phase 2 → beat1-to-beat2: slide from-bottom, ~230 ms         */}
    <Sequence from={S.beat2} durationInFrames={SCENE_FRAMES.beat2}>
      <Beat2Scene />
    </Sequence>

    {/* ── BEAT 3 · Vajilla elegante ──────────────────────────────────
        Phase 2 → beat2-to-beat3: slide from-right, ~230 ms          */}
    <Sequence from={S.beat3} durationInFrames={SCENE_FRAMES.beat3}>
      <Beat3Scene />
    </Sequence>

    {/* ── BEAT 4 · Retiros sin rastros ───────────────────────────────
        Phase 2 → beat3-to-beat4: slide from-bottom, ~230 ms         */}
    <Sequence from={S.beat4} durationInFrames={SCENE_FRAMES.beat4}>
      <Beat4Scene />
    </Sequence>
  </AbsoluteFill>
);
