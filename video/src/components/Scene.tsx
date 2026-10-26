import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const Scene: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const T = 14;
  const inP = interpolate(f, [0, T], [0, 1], {extrapolateRight: 'clamp'});
  const outP = interpolate(f, [d - T, d], [0, 1], {extrapolateLeft: 'clamp'});
  const opacity = inP * (1 - outP);
  const scale = interpolate(inP, [0, 1], [1.06, 1]) * interpolate(outP, [0, 1], [1, 0.97]);
  const blur = (1 - inP) * 14 + outP * 10;
  return (
    <div style={{position: 'absolute', inset: 0, opacity, transform: `scale(${scale})`, filter: `blur(${blur}px)`}}>
      {children}
    </div>
  );
};
