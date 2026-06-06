import React from 'react';
import { AbsoluteFill } from 'remotion';
import { LocationPopup } from './components/LocationPopup';

// ─── Chroma Key Green ────────────────────────────────────────────────────────
// Pure broadcast chroma green (#00B140) — compatible with DaVinci Resolve,
// Adobe Premiere and Final Cut Pro keying workflows.
const CHROMA_GREEN = '#00B140';

export const GreenScreenPopupComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: CHROMA_GREEN }}>
      <LocationPopup />
    </AbsoluteFill>
  );
};
