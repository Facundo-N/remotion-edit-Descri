/**
 * KineticIntroCafe
 *
 * A standalone kinetic text intro scene for the "ReelCafetería" brand.
 * Faithful recreation of the SaaSRefComposition kinetic intro pattern,
 * adapted to vertical 9:16 (1080×1920) with café theme colors.
 *
 * SCENE STRUCTURE (150 frames at 30fps):
 *   Frames 0–85:   Kinetic text entrance — "ReelCafetería" spreads from center
 *   Frames 85–150: Exit + secondary text "para empresas" rack-focus zoom
 *
 * Canvas: 1080×1920, 30fps, 150 frames
 */
import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily: inter } = loadFont('normal', {
    weights: ['400', '500', '600', '700', '800', '900'],
});

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
    bgDark: '#1a1006',
    bgGlow: '#fbab4a',
    textShadow: 'rgba(251,171,74,0.85)',
    textShadowDim: 'rgba(251,171,74,0.45)',
    secondaryShadow: 'rgba(251,171,74,0.55)',
    white: '#ffffff',
    whiteSoft: 'rgba(255,255,255,0.92)',
} as const;

const SP = {
    GENTLE: { damping: 200, mass: 1, stiffness: 80 },
    POP: { damping: 14, mass: 0.9, stiffness: 110 },
    SNAP: { damping: 20, mass: 1, stiffness: 200 },
} as const;

// ─── Kinetic text ─────────────────────────────────────────────────────────────
const KINETIC_TEXT = 'ReelCafetería';
const CHARS = KINETIC_TEXT.split('');
const CHAR_STAGGER = 3; // frames per character
const AVG_CHAR_W = 42; // estimated px per char for Inter 900 at 74px
const TEXT_CENTER = (CHARS.length * AVG_CHAR_W) / 2;

export const TOTAL_FRAMES = 150;

const KineticIntroCafe: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ── Global zoom-out spring ──────────────────────────────────────────────
    const scaleSpr = spring({ fps, frame, config: { damping: 22, mass: 1.2, stiffness: 58 } });
    const scaleVal = interpolate(scaleSpr, [0, 1], [1.4, 1.0]);

    // ── Exit — kinetic text drifts UP while fading & blurring out ───────────
    const exitOp = interpolate(frame, [85, 114], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const exitY = interpolate(frame, [85, 116], [0, -55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const exitBlur = interpolate(frame, [85, 112], [0, 26], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // ── Secondary: "para empresas" — 3-phase rack-focus zoom ───────────────
    const absSpr = spring({ fps, frame: Math.max(0, frame - 85), config: SP.POP });
    const absScale = interpolate(absSpr, [0, 1], [2.4, 1.0]);
    const absMoveY = interpolate(absSpr, [0, 1], [0, -168]);
    const absBlur = interpolate(absSpr, [0, 0.55], [24, 0], { extrapolateRight: 'clamp' });
    const absOp = interpolate(absSpr, [0, 0.15], [0, 1], { extrapolateRight: 'clamp' });
    const absExitY = interpolate(frame, [138, 150], [0, -44], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const absExitBlur = interpolate(frame, [138, 150], [0, 18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const absExitOp = interpolate(frame, [136, 150], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill
            style={{
                background: `radial-gradient(ellipse 72% 43% at 50% 48%, ${C.bgGlow}22 0%, ${C.bgDark} 68%)`,
                overflow: 'hidden',
            }}
        >
            {/* ── Kinetic title — always centered, NO lateral camera movement ── */}
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
                        const f = Math.max(0, frame - i * CHAR_STAGGER);
                        const spr = spring({ fps, frame: f, config: SP.GENTLE });
                        const op = interpolate(spr, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
                        const bl = interpolate(spr, [0, 1], [10, 0]);
                        const sc = interpolate(spr, [0, 1], [1.5, 1]);
                        // Spread-from-center: chars cluster at text midpoint, fly to natural positions
                        const naturalX = i * AVG_CHAR_W + AVG_CHAR_W / 2 - TEXT_CENTER;
                        const spreadX = interpolate(spr, [0, 1], [-naturalX * 0.85, 0]);
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
                                        textShadow: `0 0 22px ${C.textShadow}, 0 0 50px ${C.textShadowDim}`,
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

            {/* ── Secondary: "para empresas" — rack-focus zoom ──────────────── */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%', top: '50%',
                    transform: `translate(-50%, -50%) translateY(${absMoveY + absExitY}px) scale(${absScale})`,
                    opacity: absOp * absExitOp,
                    filter: (absBlur + absExitBlur) > 0 ? `blur(${absBlur + absExitBlur}px)` : undefined,
                }}
            >
                <span
                    style={{
                        fontFamily: inter,
                        fontSize: 32,
                        fontWeight: 500,
                        color: C.whiteSoft,
                        letterSpacing: '2px',
                        textShadow: `0 0 20px ${C.secondaryShadow}`,
                        whiteSpace: 'nowrap',
                    }}
                >
                    para empresas
                </span>
            </div>
        </AbsoluteFill>
    );
};

export default KineticIntroCafe;