/**
 * BEAT 4 — "Retiros sin rastros / Montaje completo"
 * Reference: src/components/furgoneta_animada (1).html
 *
 * Layout:
 *   - Warm cream/yellow gradient background
 *   - 5 coffee beans (blurred)
 *   - Furgoneta SVG animada (inline, centrada verticalmente)
 *   - Text LEFT-ALIGNED, mid-left: "Retiros sin / rastros" + "todo en un solo pack"
 *   - Frosted gray overlay
 *   - Road animation below van
 *
 * Animations (mirrored from Beat1Scene):
 *   - Scene entrance: spring GENTLE scale 0.92→1 + opacity
 *   - Van: spring POP entrance + bounce spring
 *   - Wheels: continuous rotation
 *   - Smoke: opacity + translate
 *   - Text staggered: fade-in → POP → slide-up
 *   - Exit fade-out last 10 frames
 */
import React from 'react';
import {
    AbsoluteFill,
    Audio,
    Img,
    Sequence,
    interpolate,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { BEATS_VO_OFFSETS, COLORS, SPRINGS, SCENE_FRAMES } from '../../constants';

const { fontFamily: sans } = loadMontserrat();

const BROWN_SHADOW = [
    '-3px -3px 0 #2c210c', '3px -3px 0 #2c210c',
    '-3px 3px 0 #2c210c', '3px 3px 0 #2c210c',
    '4px 4px 0 #2c210c', '5px 5px 0 #2c210c',
].join(', ');

const GLASS_TEXT_STYLE: React.CSSProperties = {
    fontFamily: sans,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.08,
    color: '#fbab4a',
    textShadow: BROWN_SHADOW,
};

const Grain: React.FC = () => {
    const frame = useCurrentFrame();
    const op = interpolate(Math.sin(Math.floor(frame / 3)), [-1, 1], [0.03, 0.07]);
    return (
        <AbsoluteFill
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay', opacity: op, pointerEvents: 'none', zIndex: 98,
            }}
        />
    );
};

const Bean: React.FC<{
    left: number; top: number; size: number; rotate: number;
    blur: number; delay?: number; flipH?: boolean; opacity?: number;
}> = ({ left, top, size, rotate, blur, delay = 0, flipH = false, opacity = 0.9 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ fps, frame: Math.max(0, frame - delay), config: SPRINGS.SUAVE });
    const offX = left < 0 ? interpolate(spr, [0, 1], [-180, 0]) :
        left > 700 ? interpolate(spr, [0, 1], [180, 0]) : 0;
    const offY = top < 0 ? interpolate(spr, [0, 1], [-180, 0]) :
        top > 1500 ? interpolate(spr, [0, 1], [180, 0]) : 0;
    const fade = interpolate(spr, [0, 0.4], [0, opacity], { extrapolateRight: 'clamp' });

    return (
        <Img
            src={staticFile('coffee_beans.png')}
            style={{
                position: 'absolute', left, top, width: size, height: 'auto',
                opacity: fade,
                transform: `translate(${offX}px, ${offY}px) rotate(${rotate}deg) scaleX(${flipH ? -1 : 1})`,
                filter: `blur(${blur}px) drop-shadow(0 8px 16px rgba(44,33,12,0.18))`,
                pointerEvents: 'none', zIndex: 3,
            }}
        />
    );
};

export const Beat4Scene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ─── Scene entrance ───────────────────────────────────────────────────
    const sceneSpr = spring({ fps, frame, config: SPRINGS.GENTLE });
    const sceneScale = interpolate(sceneSpr, [0, 1], [0.92, 1]);
    const sceneOp = interpolate(sceneSpr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

    // ─── Exit fade-out ────────────────────────────────────────────────────
    const exitOp = interpolate(frame, [SCENE_FRAMES.beat4 - 10, SCENE_FRAMES.beat4], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // ─── Van entrance — spring POP ──────────────────────────────────────
    const vanSpr = spring({ fps, frame: Math.max(0, frame - 12), config: SPRINGS.POP });
    const vanScale = interpolate(vanSpr, [0, 1], [0.3, 1]);
    const vanOp = interpolate(vanSpr, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });

    // ─── Van bounce (continuous gentle bounce) ────────────────────────────
    const bounceY = Math.sin(frame * 0.08) * 3;

    // ─── Wheels rotation ──────────────────────────────────────────────────
    const wheelRot = interpolate(frame, [0, 30], [0, 360], { extrapolateRight: 'extend' });

    // ─── Smoke animation ──────────────────────────────────────────────────
    const smokeSpr = (delay: number) => spring({ fps, frame: Math.max(0, frame - delay), config: SPRINGS.GENTLE });
    const smokeOp = (d: number) => interpolate(smokeSpr(d), [0, 0.5, 0.8, 1], [0, 0.6, 0.3, 0], { extrapolateRight: 'clamp' });
    const smokeX = (d: number) => interpolate(smokeSpr(d), [0, 1], [0, -150], { extrapolateRight: 'clamp' });
    const smokeY2 = (d: number) => interpolate(smokeSpr(d), [0, 1], [0, -40], { extrapolateRight: 'clamp' });
    const smokeS = (d: number) => interpolate(smokeSpr(d), [0, 1], [0.5, 2.5], { extrapolateRight: 'clamp' });

    // ─── Road animation ──────────────────────────────────────────────────
    const roadOffset = interpolate(frame, [0, 30], [0, -200], { extrapolateRight: 'extend', extrapolateLeft: 'extend' });

    // ─── Sliding door ──────────────────────────────────────────────────────
    const doorCycle = frame % 210; // ~7s cycle
    const doorX = doorCycle < 15 ? 0 : doorCycle < 105 ? interpolate(doorCycle, [15, 105], [0, -160], { extrapolateRight: 'clamp' }) : doorCycle < 150 ? -160 : interpolate(doorCycle, [150, 210], [-160, 0], { extrapolateRight: 'clamp' });
    const doorOpen = doorCycle >= 30 && doorCycle <= 150;

    // ─── Title text — staggered ──────────────────────────────────────────
    const line1Op = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const line2Spr = spring({ fps, frame: Math.max(0, frame - 14), config: SPRINGS.POP });
    const line2Scale = interpolate(line2Spr, [0, 1], [0.4, 1.15]);
    const line2Rot = interpolate(line2Spr, [0, 1], [-6, 0]);
    const line2Op = interpolate(line2Spr, [0, 0.35], [0, 1], { extrapolateRight: 'clamp' });
    const line3Spr = spring({ fps, frame: Math.max(0, frame - 30), config: SPRINGS.GENTLE });
    const line3Op = interpolate(line3Spr, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
    const line3Y = interpolate(line3Spr, [0, 1], [20, 0]);

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(160deg, ${COLORS.yellow} 0%, #edddb5 100%)`,
                overflow: 'hidden',
            }}
        >
            <Grain />

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(100,100,110,0.18)',
                    backdropFilter: 'blur(1px) saturate(75%)',
                    WebkitBackdropFilter: 'blur(1px) saturate(75%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: sceneOp * exitOp,
                    transform: `scale(${sceneScale})`,
                    transformOrigin: 'center center',
                }}
            >
                {/* ── Amber glows ──────────────────────────────────────────────── */}
                <div style={{ position: 'absolute', left: -60, top: '15%', width: 220, height: 280, background: `radial-gradient(ellipse, ${COLORS.amber}33 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', right: -60, bottom: '15%', width: 220, height: 280, background: `radial-gradient(ellipse, ${COLORS.amber}33 0%, transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 2 }} />

                {/* ── Beans ─────────────────────────────────────────────────── */}
                <Bean left={-310} top={-290} size={580} rotate={-14} blur={16} delay={0} />
                <Bean left={700} top={-270} size={500} rotate={28} blur={12} delay={4} flipH />
                <Bean left={-300} top={640} size={540} rotate={6} blur={15} delay={8} />
                <Bean left={-220} top={1580} size={460} rotate={28} blur={10} delay={6} />
                <Bean left={770} top={1690} size={430} rotate={-22} blur={8} delay={3} flipH />

                {/* ── Road animation ────────────────────────────────────────────── */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        left: 0,
                        width: '100%',
                        height: 15,
                        background: `repeating-linear-gradient(90deg, #6c757d, #6c757d 40px, transparent 40px, transparent 80px)`,
                        backgroundSize: '200px 100%',
                        backgroundPosition: `${roadOffset}px 0`,
                        zIndex: 4,
                        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    }}
                />

                {/* ── Van SVG — centered ──────────────────────────────────────── */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) translateY(${bounceY}px) scale(${vanScale})`,
                        opacity: vanOp,
                        zIndex: 6,
                        width: 800,
                        height: 400,
                        marginLeft: -400,
                        marginTop: -200,
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
                        <style>{`
              .body-color { fill: #B0855A; }
              .trim-dark { fill: #2D2E2E; }
              .line-dark { stroke: #2D2E2E; stroke-linecap: round; }
              .panel-line { fill: none; stroke: #997047; stroke-width: 3; }
              .glass { fill: #596E7F; stroke: #2D2E2E; stroke-width: 4; stroke-linejoin: round; }
              .tire { fill: #333333; }
              .hub { fill: #D1D3D4; }
            `}</style>

                        {/* Shadow */}
                        <ellipse cx="400" cy="345" rx="350" ry="10" fill="rgba(0,0,0,0.15)" />

                        {/* Smoke puffs */}
                        {[0, 8, 16].map((d, i) => (
                            <circle key={i} cx="35" cy="285" r={[10, 12, 14][i]} fill="#A9A9A9" opacity={smokeOp(d)}
                                transform={`translate(${smokeX(d)}px, ${smokeY2(d)}px) scale(${smokeS(d)})`} />
                        ))}

                        {/* Chassis base */}
                        <rect x="45" y="270" width="715" height="20" rx="3" className="trim-dark" />
                        <path d="M 40 230 L 50 230 L 50 290 L 40 290 Q 35 290 35 285 L 35 235 Q 35 230 40 230 Z" className="trim-dark" />
                        <path d="M 720 235 L 755 235 L 763 245 L 763 290 L 720 290 Z" className="trim-dark" />
                        <path d="M 50 100 Q 50 80 70 80 L 420 80 Q 480 80 520 110 L 640 190 L 735 225 L 750 250 L 750 270 L 50 270 Z" className="body-color" />

                        {/* Interior */}
                        <g id="van-interior">
                            <rect x="244" y="82" width="177" height="188" fill="#1A1A1A" />
                            <rect x="244" y="82" width="177" height="15" fill="#000" opacity="0.5" />
                            {doorOpen && (
                                <>
                                    <rect x="260" y="132" width="140" height="138" fill="#C19A6B" rx="3" />
                                    <rect x="260" y="132" width="140" height="138" fill="none" stroke="#8C6239" strokeWidth="2" rx="3" />
                                    <rect x="320" y="132" width="20" height="138" fill="#D2B48C" opacity="0.8" />
                                    <rect x="270" y="160" width="40" height="25" fill="#FFF8DC" rx="2" />
                                    <line x1="275" y1="168" x2="305" y2="168" stroke="#333" strokeWidth="2" />
                                    <line x1="275" y1="176" x2="295" y2="176" stroke="#333" strokeWidth="2" />
                                    <rect x="350" y="150" width="40" height="40" fill="#E3242B" rx="2" />
                                    <text x="370" y="175" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#FFF" textAnchor="middle">FRÁGIL</text>
                                </>
                            )}
                        </g>

                        {/* Sliding door */}
                        <g transform={`translate(${doorX}, 0)`}>
                            <rect x="243" y="80" width="179" height="190" fill="#B0855A" />
                            <rect x="250" y="95" width="155" height="120" rx="6" className="panel-line" />
                            <line x1="250" y1="230" x2="415" y2="230" className="line-dark" strokeWidth="7" />
                            <rect x="360" y="178" width="35" height="8" rx="4" fill="#1A1A1A" />
                            <line x1="244" y1="80" x2="244" y2="270" stroke="#997047" strokeWidth="2" />
                            <line x1="421" y1="80" x2="421" y2="270" stroke="#997047" strokeWidth="2" />
                        </g>

                        {/* Static panels */}
                        <rect x="75" y="95" width="155" height="120" rx="6" className="panel-line" />
                        <line x1="100" y1="175" x2="242" y2="175" className="line-dark" strokeWidth="4" />
                        <line x1="242" y1="80" x2="242" y2="270" className="line-dark" strokeWidth="2.5" />
                        <line x1="423" y1="80" x2="423" y2="270" className="line-dark" strokeWidth="2.5" />
                        <line x1="600" y1="185" x2="600" y2="270" className="line-dark" strokeWidth="2.5" />
                        <line x1="75" y1="230" x2="235" y2="230" className="line-dark" strokeWidth="7" />
                        <line x1="430" y1="230" x2="590" y2="230" className="line-dark" strokeWidth="7" />

                        {/* Windows */}
                        <path d="M 435 95 L 480 95 L 580 180 L 435 180 Z" className="glass" />
                        <path d="M 590 180 L 630 180 L 595 145 Z" className="glass" />
                        <rect x="580" y="130" width="12" height="40" rx="5" className="trim-dark" />
                        <polygon points="592,145 610,155 610,165 592,175" className="trim-dark" />

                        {/* Door handle */}
                        <rect x="445" y="178" width="35" height="8" rx="4" fill="#1A1A1A" />

                        {/* Lights */}
                        <path d="M 45 170 L 52 170 L 52 230 L 45 230 Z" fill="#E6E6E6" />
                        <rect x="45" y="175" width="7" height="15" fill="#F49E00" />
                        <rect x="45" y="190" width="7" height="25" fill="#E3242B" />
                        <rect x="45" y="215" width="7" height="10" fill="#FFFFFF" />
                        <path d="M 725 220 L 743 226 L 750 250 L 730 250 L 720 235 Z" fill="#3D85C6" />
                        <path d="M 725 220 L 743 226 L 735 230 L 720 225 Z" fill="#F49E00" />

                        {/* Wheel arches */}
                        <path d="M 105 290 A 65 65 0 0 1 235 290 Z" fill="#252525" />
                        <path d="M 585 290 A 65 65 0 0 1 715 290 Z" fill="#252525" />

                        {/* Left wheel */}
                        <g transform="translate(170, 290)">
                            <circle cx="0" cy="0" r="50" className="tire" />
                            <circle cx="0" cy="0" r="38" fill="#1A1A1A" />
                            <g transform={`rotate(${wheelRot})`}>
                                <circle cx="0" cy="0" r="28" className="hub" />
                                <circle cx="0" cy="0" r="20" fill="#1A1A1A" />
                                <g stroke="#D1D3D4" strokeWidth="5" strokeLinecap="round">
                                    <line x1="0" y1="-20" x2="0" y2="20" />
                                    <line x1="-20" y1="0" x2="20" y2="0" />
                                    <line x1="-14" y1="-14" x2="14" y2="14" />
                                    <line x1="-14" y1="14" x2="14" y2="-14" />
                                </g>
                                <circle cx="0" cy="0" r="8" className="hub" />
                                <circle cx="0" cy="0" r="3" fill="#1A1A1A" />
                            </g>
                        </g>

                        {/* Right wheel */}
                        <g transform="translate(650, 290)">
                            <circle cx="0" cy="0" r="50" className="tire" />
                            <circle cx="0" cy="0" r="38" fill="#1A1A1A" />
                            <g transform={`rotate(${wheelRot})`}>
                                <circle cx="0" cy="0" r="28" className="hub" />
                                <circle cx="0" cy="0" r="20" fill="#1A1A1A" />
                                <g stroke="#D1D3D4" strokeWidth="5" strokeLinecap="round">
                                    <line x1="0" y1="-20" x2="0" y2="20" />
                                    <line x1="-20" y1="0" x2="20" y2="0" />
                                    <line x1="-14" y1="-14" x2="14" y2="14" />
                                    <line x1="-14" y1="14" x2="14" y2="-14" />
                                </g>
                                <circle cx="0" cy="0" r="8" className="hub" />
                                <circle cx="0" cy="0" r="3" fill="#1A1A1A" />
                            </g>
                        </g>
                    </svg>
                </div>

                {/* ── Title text — left aligned ────────────────────────────── */}
                <div style={{ position: 'absolute', left: 60, top: 280, zIndex: 10, pointerEvents: 'none', maxWidth: 620 }}>
                    <div style={{ ...GLASS_TEXT_STYLE, fontSize: 75, opacity: line1Op }}>Retiros sin</div>
                    <div style={{
                        ...GLASS_TEXT_STYLE, fontSize: 142, color: '#f7edb0', opacity: line2Op,
                        transform: `scale(${line2Scale}) rotate(${line2Rot}deg)`,
                        transformOrigin: 'left center',
                    }}>rastros</div>
                    <div style={{
                        ...GLASS_TEXT_STYLE, fontSize: 54, color: '#f7edb0', opacity: line3Op,
                        transform: `translateY(${line3Y}px)`,
                    }}>todo en un solo pack</div>
                </div>
            </div>

            {/* ── SFX ─────────────────────────────────────────────────────── */}
            <Sequence from={14} durationInFrames={12} layout="none">
                <Audio src={staticFile('click_clean.mp3')} volume={0.28} />
            </Sequence>

            {/* ── Beat 4 VO ────────────────────────────────────────────────── */}
            <Audio src={staticFile('elevenlabs_beats.mp3')} startFrom={BEATS_VO_OFFSETS.beat4} volume={1} />
        </AbsoluteFill>
    );
};