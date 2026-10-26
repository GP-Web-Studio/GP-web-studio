import {loadFont} from '@remotion/google-fonts/Inter';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const {fontFamily} = loadFont('normal', {weights: ['500', '700', '800', '900'], subsets: ['latin', 'latin-ext']});

export const FPS = 30;
export const DURATION = 30;
export const sec = (s: number) => Math.round(s * FPS);

export const C = {
  bg: '#010302',
  card: 'rgba(8,18,12,0.72)',
  cardSolid: '#08120c',
  border: 'rgba(0,255,106,0.28)',
  green: '#00ff6a',
  greenDeep: '#00c853',
  text: '#f2fff7',
  muted: '#7f9d8b',
  red: '#ff3b52',
};

export const font = `${fontFamily}, 'Segoe UI', system-ui, sans-serif`;

export const glow = (a = 0.7, r = 40) => `0 0 ${r}px rgba(0,255,106,${a})`;

export const useSpr = (delay = 0, damping = 15, stiffness = 110) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness}});
};
