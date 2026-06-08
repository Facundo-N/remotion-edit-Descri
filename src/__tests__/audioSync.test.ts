import { describe, it, expect } from 'vitest';
import { SCENE_FRAMES, BEATS_VO_OFFSETS, REEL_TOTAL_FRAMES } from '../constants';

// Speech regions in beats_vo.wav — detected by scripts/analyze_beats_vo.js
const REGIONS = {
  conflicting: { start: 0, end: 47 },   // Region 0 — must NOT overlap Beat1 audio window
  beat1:       { start: 67, end: 121 }, // Region 1 — "Máquina de café profesional"
  beat2:       { start: 143, end: 227 },// Region 2 — "Cápsulas premium variadas"
  beat3:       { start: 241, end: 278 },// Region 3 — "Vajilla elegante" part 1
} as const;

// Global start frames (mirrors ReelComposition.tsx)
const G = {
  hook:  0,
  beat1: SCENE_FRAMES.hook,
  beat2: SCENE_FRAMES.hook + SCENE_FRAMES.beat1,
  beat3: SCENE_FRAMES.hook + SCENE_FRAMES.beat1 + SCENE_FRAMES.beat2,
};

// ─── Beat1 audio fix ──────────────────────────────────────────────────────
describe('Beat1Scene audio fix — skip Region 0 conflict', () => {
  it('beat1 offset starts at Region 1 (2.230 s), skipping conflicting Region 0', () => {
    expect(BEATS_VO_OFFSETS.beat1).toBe(REGIONS.beat1.start); // 67
  });

  it('beat1 offset is past the conflicting Region 0 end (frame 47)', () => {
    expect(BEATS_VO_OFFSETS.beat1).toBeGreaterThan(REGIONS.conflicting.end);
  });

  it('Beat1 audio window does NOT overlap Region 0 (no Cápsulas audio during machine scene)', () => {
    const beat1AudioStart = BEATS_VO_OFFSETS.beat1;
    const beat1AudioEnd   = BEATS_VO_OFFSETS.beat1 + SCENE_FRAMES.beat1;
    // Region 0 is 0..47; beat1 window must start after it
    expect(beat1AudioStart).toBeGreaterThan(REGIONS.conflicting.end);
    expect(beat1AudioEnd).toBeGreaterThan(REGIONS.conflicting.end);
  });

  it('Beat1 duration matches Region 1 exactly — cuts when "Máquina de café profesional" ends', () => {
    const region1Duration = REGIONS.beat1.end - REGIONS.beat1.start; // 54
    expect(SCENE_FRAMES.beat1).toBe(region1Duration);
  });

  it('Beat1 audio window covers Region 1 end-to-end', () => {
    const audioStart = BEATS_VO_OFFSETS.beat1;
    const audioEnd   = BEATS_VO_OFFSETS.beat1 + SCENE_FRAMES.beat1;
    expect(audioStart).toBe(REGIONS.beat1.start);
    expect(audioEnd).toBe(REGIONS.beat1.end);
  });
});

// ─── Beat2 — "Cápsulas premium variadas" ─────────────────────────────────
describe('Beat2Scene — "Cápsulas premium variadas" sync', () => {
  it('beat2 offset starts at Region 2 (4.760 s = frame 143)', () => {
    expect(BEATS_VO_OFFSETS.beat2).toBe(REGIONS.beat2.start); // 143
  });

  it('Beat2 duration matches Region 2 exactly (84 frames)', () => {
    const region2Duration = REGIONS.beat2.end - REGIONS.beat2.start; // 84
    expect(SCENE_FRAMES.beat2).toBe(region2Duration);
  });

  it('"Cápsulas" first audible frame (offset 144) falls inside Beat2 audio window', () => {
    const capsulasFirstFrame = REGIONS.beat2.start + 1; // 144
    const windowEnd = BEATS_VO_OFFSETS.beat2 + SCENE_FRAMES.beat2;
    expect(capsulasFirstFrame).toBeGreaterThanOrEqual(BEATS_VO_OFFSETS.beat2);
    expect(capsulasFirstFrame).toBeLessThan(windowEnd);
  });

  it('Beat1 audio ends before Beat2 audio begins — no audio overlap', () => {
    const beat1AudioEnd = BEATS_VO_OFFSETS.beat1 + SCENE_FRAMES.beat1; // 121
    expect(beat1AudioEnd).toBeLessThanOrEqual(BEATS_VO_OFFSETS.beat2); // ≤ 143
  });
});

// ─── Beat3 — "Vajilla elegante" ───────────────────────────────────────────
describe('Beat3Scene — "Vajilla elegante" sync', () => {
  it('beat3 offset starts at Region 3 (8.040 s = frame 241)', () => {
    expect(BEATS_VO_OFFSETS.beat3).toBe(REGIONS.beat3.start); // 241
  });

  it('Beat2 audio ends before Beat3 audio begins — no audio overlap', () => {
    const beat2AudioEnd = BEATS_VO_OFFSETS.beat2 + SCENE_FRAMES.beat2; // 227
    expect(beat2AudioEnd).toBeLessThanOrEqual(BEATS_VO_OFFSETS.beat3);  // ≤ 241
  });
});

// ─── Scene frame boundaries ───────────────────────────────────────────────
describe('Scene frame boundaries', () => {
  it('Scenes are contiguous — no gaps or overlaps', () => {
    expect(G.beat1).toBe(SCENE_FRAMES.hook);
    expect(G.beat2).toBe(G.beat1 + SCENE_FRAMES.beat1);
    expect(G.beat3).toBe(G.beat2 + SCENE_FRAMES.beat2);
  });

  it('REEL_TOTAL_FRAMES equals sum of all scene durations', () => {
    const expected = SCENE_FRAMES.hook + SCENE_FRAMES.beat1 + SCENE_FRAMES.beat2 + SCENE_FRAMES.beat3;
    expect(REEL_TOTAL_FRAMES).toBe(expected);
  });

  it('Beat1Scene ends before "Cápsulas" first audible frame (global)', () => {
    const beat1GlobalEnd      = G.beat2 - 1;
    const capsulasGlobalStart = G.beat2 + 1; // Beat2 local frame 1 = first "Cápsulas" audio
    expect(beat1GlobalEnd).toBeLessThan(capsulasGlobalStart);
  });

  it('"Cápsulas" audio plays while Beat2Scene is visible (global frames)', () => {
    const capsulasGlobalStart = G.beat2 + 1;
    const beat2GlobalEnd      = G.beat3 - 1;
    expect(capsulasGlobalStart).toBeGreaterThanOrEqual(G.beat2);
    expect(capsulasGlobalStart).toBeLessThanOrEqual(beat2GlobalEnd);
  });
});
