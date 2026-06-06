import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Marcellus";

const { fontFamily } = loadFont();

const STROKE_COLOR = "#3D2B1F";
const BACKGROUND_COLOR = "#F5F1B5";
const SAUCER_COLOR = "#F3A354";

const LogoPath: React.FC<{
  d: string;
  startFrame: number;
  duration: number;
  strokeWidth?: number;
  fill?: string;
  showFillFrom?: number;
}> = ({ d, startFrame, duration, strokeWidth = 3, fill = "none", showFillFrom }) => {
  const frame = useCurrentFrame();
  
  const progress = interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const fillOpacity = showFillFrom 
    ? interpolate(frame, [showFillFrom, showFillFrom + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <path
      d={d}
      fill={fill !== "none" ? fill : "none"}
      fillOpacity={fill !== "none" ? fillOpacity : 1}
      stroke={STROKE_COLOR}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={3500}
      strokeDashoffset={progress * 3500}
    />
  );
};

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Timing
  const mainPathStart = 15;
  const mainPathDuration = 110; 
  
  const smoke2Start = 30;
  const smoke2Duration = 35;
  
  const saucerStart = 120;
  const textStart = 120;
  const saucerDuration = 40;
  
  const circleStart = 165;
  const circleDuration = 40;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        backgroundImage: `radial-gradient(circle, ${BACKGROUND_COLOR} 0%, #EDE9A3 100%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width={width * 0.95}
        height={height * 0.95}
        viewBox="0 0 600 600"
        style={{ overflow: "visible" }}
      >
        {/* Main Continuous Path: Smoke -> Rim -> Bowl -> Heart Handle */}
        <LogoPath 
          d="M 300 80 
             C 315 110 285 130 300 160 
             C 315 190 285 210 300 240 
             Q 350 225 430 235 
             C 430 390 170 390 170 235 
             C 120 235 120 340 170 285 
             C 210 240 220 210 170 235" 
          startFrame={mainPathStart} 
          duration={mainPathDuration} 
          strokeWidth={2.5}
        />

        {/* Secondary Smoke Line */}
        <LogoPath 
          d="M 280 200 C 290 170 260 150 275 100" 
          startFrame={smoke2Start} 
          duration={smoke2Duration} 
          strokeWidth={2}
        />

        {/* Saucer */}
        <LogoPath 
          d="M 160 385 Q 300 450 440 385 Q 300 365 160 385 Z" 
          startFrame={saucerStart} 
          duration={saucerDuration} 
          fill={SAUCER_COLOR}
          showFillFrom={saucerStart + 25}
        />

        {/* Text - Marcellus for Art Deco elegance */}
        <g style={{ fontFamily, fontSize: 58, fill: STROKE_COLOR, fontWeight: 400 }}>
          <text 
            x="300" 
            y="525" 
            textAnchor="middle"
            style={{
              opacity: interpolate(frame, [textStart + 10, textStart + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              letterSpacing: "12px",
              textTransform: "uppercase"
            }}
          >
            AROMA A CAFÉ
          </text>
        </g>

        {/* Final Circle */}
        <LogoPath 
          d="M 300 30 A 270 270 0 1 1 299.9 30" 
          startFrame={circleStart} 
          duration={circleDuration} 
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};
