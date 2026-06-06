import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { Phone, Globe, Mail } from 'lucide-react';
import { Logo } from './Logo';

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const { fontFamily: sans } = loadMontserrat();

// Color scheme
const C = {
  espresso: '#0A1424',
  crema: '#FDF8E7',
  gold: '#fbab4a',
  darkBrown: '#2c210c',
  white: '#FFFFFF',
  grey: '#6b5e50',
};

export const TarjetaPresentacionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Entrance spring for the card itself
  const cardEntrance = spring({
    fps,
    frame,
    config: { damping: 15, stiffness: 60, mass: 1 },
  });

  const cardScale = interpolate(cardEntrance, [0, 1], [0.6, 1]);
  const cardTranslateY = interpolate(cardEntrance, [0, 1], [1000, 0]);
  const cardRotateX = interpolate(cardEntrance, [0, 1], [-25, 0]);
  const cardRotateY = interpolate(cardEntrance, [0, 1], [15, 0]);
  const cardRotateZ = interpolate(cardEntrance, [0, 1], [-8, 0]);

  // Floating ambient effect after entrance
  const floatCycle = Math.sin(frame * 0.04) * 6;
  const floatRotate = Math.cos(frame * 0.03) * 0.8;

  // 2. Staggered entrance for card elements (relative to frame 30)
  const titleSpr = spring({ fps, frame: frame - 25, config: { damping: 12 } });
  const subtitleSpr = spring({ fps, frame: frame - 32, config: { damping: 12 } });
  const dividerWidth = interpolate(spring({ fps, frame: frame - 38, config: { damping: 15 } }), [0, 1], [0, 100]);

  // Staggered contacts entrance
  const contact1Spr = spring({ fps, frame: frame - 45, config: { damping: 12 } });
  const contact2Spr = spring({ fps, frame: frame - 52, config: { damping: 12 } });
  const contact3Spr = spring({ fps, frame: frame - 59, config: { damping: 12 } });
  const contact4Spr = spring({ fps, frame: frame - 66, config: { damping: 12 } });

  // 3. CTA Button at the bottom (entrance relative to frame 90)
  const buttonSpr = spring({ fps, frame: frame - 85, config: { damping: 10, stiffness: 80 } });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.025;

  return (
    <AbsoluteFill style={{ backgroundColor: C.espresso, overflow: 'hidden' }}>
      
      {/* Background radial glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(251, 171, 74, 0.15) 0%, transparent 70%)`,
        zIndex: 1,
      }} />

      {/* Floating particles */}
      <AbsoluteFill style={{ zIndex: 2, pointerEvents: 'none' }}>
        {Array.from({ length: 15 }).map((_, i) => {
          const seed = i * 137.5;
          const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
          const speed = 0.2 + (i % 4) * 0.1;
          const y = ((frame * speed + seed * 3) % 110) - 10;
          const size = 5 + (i % 3) * 3;
          const color = [C.gold, C.crema, '#74ACDF'][i % 3];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color,
                opacity: 0.4,
                transform: `rotate(${frame * (i % 2 === 0 ? 1 : -1) + seed}deg)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* CSS Keyframes for card reflection/shine effect */}
      <style>{`
        @keyframes sweepReflection {
          0% { left: -150%; }
          50% { left: 250%; }
          100% { left: 250%; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          THE BUSINESS CARD
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 720,
        height: 1040,
        marginLeft: -360,
        marginTop: -580,
        zIndex: 10,
        transform: `perspective(1200px) translateY(${cardTranslateY + floatCycle}px) scale(${cardScale}) rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg) rotateZ(${cardRotateZ + floatRotate}deg)`,
        transformOrigin: 'center center',
      }}>
        
        {/* Card Body */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: C.crema,
          borderRadius: 36,
          border: `4px solid ${C.gold}`,
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.65), inset 0 0 40px rgba(251, 171, 74, 0.05)',
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          
          {/* Elegant sweep reflection overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '60%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
            transform: 'skewX(-30deg)',
            animation: 'sweepReflection 3.5s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 5,
          }} />

          {/* Inner luxury border */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            bottom: 16,
            border: `1.5px solid rgba(44, 33, 12, 0.12)`,
            borderRadius: 24,
            pointerEvents: 'none',
          }} />

          {/* Logo Area */}
          <div style={{
            marginTop: 40,
            transform: `scale(${interpolate(cardEntrance, [0, 1], [0.85, 1.2])})`,
            opacity: cardEntrance,
            display: 'flex',
            justifyContent: 'center',
            height: 240,
          }}>
            <Logo type="image" />
          </div>

          {/* Divider */}
          <div style={{
            width: `${dividerWidth}%`,
            height: 2,
            background: `linear-gradient(to right, transparent, ${C.gold}, ${C.darkBrown}, ${C.gold}, transparent)`,
            marginTop: 40,
            marginBottom: 35,
          }} />

          {/* Brand Name */}
          <div style={{
            opacity: titleSpr,
            transform: `translateY(${interpolate(titleSpr, [0, 1], [20, 0])}px)`,
            fontFamily: sans,
            fontSize: 64,
            fontWeight: 900,
            color: C.darkBrown,
            letterSpacing: '1px',
            lineHeight: 1,
            textAlign: 'center',
          }}>
            AROMA A CAFÉ
          </div>

          {/* Brand Subtitle / Tagline */}
          <div style={{
            opacity: subtitleSpr,
            transform: `translateY(${interpolate(subtitleSpr, [0, 1], [15, 0])}px)`,
            fontFamily: sans,
            fontSize: 26,
            fontWeight: 600,
            fontStyle: 'italic',
            color: C.grey,
            letterSpacing: '0.5px',
            marginTop: 12,
            marginBottom: 50,
            textAlign: 'center',
          }}>
            Servicio de Café de Especialidad para Eventos
          </div>

          {/* Contact Details List */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginTop: 10,
            padding: '0 10px',
          }}>
            {/* Phone / Whatsapp */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity: contact1Spr,
              transform: `translateX(${interpolate(contact1Spr, [0, 1], [-40, 0])}px)`,
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: 'rgba(251, 171, 74, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.darkBrown,
              }}>
                <Phone size={28} strokeWidth={2} />
              </div>
              <div style={{
                fontFamily: sans,
                fontSize: 30,
                fontWeight: 700,
                color: C.darkBrown,
              }}>
                +54 11 3256-4223
              </div>
            </div>

            {/* Instagram */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity: contact2Spr,
              transform: `translateX(${interpolate(contact2Spr, [0, 1], [-40, 0])}px)`,
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: 'rgba(251, 171, 74, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.darkBrown,
              }}>
                <InstagramIcon size={28} />
              </div>
              <div style={{
                fontFamily: sans,
                fontSize: 30,
                fontWeight: 700,
                color: C.darkBrown,
              }}>
                @aromaacafe_
              </div>
            </div>

            {/* Website */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity: contact3Spr,
              transform: `translateX(${interpolate(contact3Spr, [0, 1], [-40, 0])}px)`,
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: 'rgba(251, 171, 74, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.darkBrown,
              }}>
                <Globe size={28} strokeWidth={2} />
              </div>
              <div style={{
                fontFamily: sans,
                fontSize: 30,
                fontWeight: 700,
                color: C.darkBrown,
              }}>
                aromaacafe.com.ar
              </div>
            </div>

            {/* Mail */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity: contact4Spr,
              transform: `translateX(${interpolate(contact4Spr, [0, 1], [-40, 0])}px)`,
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: 'rgba(251, 171, 74, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.darkBrown,
              }}>
                <Mail size={28} strokeWidth={2} />
              </div>
              <div style={{
                fontFamily: sans,
                fontSize: 28,
                fontWeight: 700,
                color: C.darkBrown,
              }}>
                contacto@aromaacafe.com.ar
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA BUTTON AT THE BOTTOM
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 15,
        opacity: buttonSpr,
        transform: `scale(${interpolate(buttonSpr, [0, 1], [0.75, pulse])})`,
      }}>
        <div style={{
          backgroundColor: C.gold,
          color: C.espresso,
          padding: '24px 60px',
          borderRadius: 100,
          fontFamily: sans,
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          boxShadow: `0 16px 40px rgba(251, 171, 74, 0.4)`,
        }}>
          Cotizá tu evento
        </div>
      </div>

    </AbsoluteFill>
  );
};
