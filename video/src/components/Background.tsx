import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const orb = (x: number, y: number, size: number, speed: number, a: number, ph: number) => ({
    position: 'absolute' as const,
    left: x + Math.sin(f / speed + ph) * 120 - size / 2,
    top: y + Math.cos(f / (speed * 1.3) + ph) * 160 - size / 2,
    width: size,
    height: size,
    borderRadius: size,
    background: `radial-gradient(circle, rgba(0,255,106,${a}) 0%, transparent 65%)`,
    filter: 'blur(30px)',
  });
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <div style={orb(200, 400, 1000, 90, 0.2, 0)} />
      <div style={orb(900, 1300, 1200, 120, 0.17, 2)} />
      <div style={orb(300, 1700, 900, 100, 0.12, 4)} />
      {/* perspective grid floor */}
      <AbsoluteFill style={{perspective: 900, perspectiveOrigin: '50% 40%'}}>
        <div
          style={{
            position: 'absolute',
            left: -600,
            right: -600,
            top: 1050,
            height: 1800,
            transform: 'rotateX(68deg)',
            transformOrigin: 'top',
            backgroundImage:
              'linear-gradient(rgba(0,255,106,0.22) 2px, transparent 2px), linear-gradient(90deg, rgba(0,255,106,0.22) 2px, transparent 2px)',
            backgroundSize: '120px 120px',
            backgroundPosition: `0 ${(f * 2) % 120}px`,
            WebkitMaskImage: 'linear-gradient(transparent, #000 35%, transparent)',
            maskImage: 'linear-gradient(transparent, #000 35%, transparent)',
            opacity: 0.55,
          }}
        />
      </AbsoluteFill>
      {/* particles */}
      {Array.from({length: 36}).map((_, i) => {
        const x = (i * 263) % 1080;
        const y = 1920 - ((f * (0.5 + (i % 6) * 0.25) + i * 151) % 1980);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              borderRadius: 8,
              background: C.green,
              boxShadow: '0 0 12px #00ff6a',
              opacity: interpolate(Math.sin(f / 18 + i * 1.7), [-1, 1], [0.05, 0.6]),
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.9) 100%)'}}
      />
    </AbsoluteFill>
  );
};
