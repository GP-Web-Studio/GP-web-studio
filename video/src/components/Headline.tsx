import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, font} from '../theme';

type Props = {text: string; delay?: number; top?: number; size?: number; accent?: string};

/** Kinetic headline. Wrap words in *asterisks* to highlight them in neon green. */
export const Headline: React.FC<Props> = ({text, delay = 8, top = 150, size = 124, accent = C.green}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text
    .split('*')
    .flatMap((seg, i) => seg.split(' ').filter(Boolean).map((w) => ({w, a: i % 2 === 1})));
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 56,
        right: 56,
        textAlign: 'center',
        fontFamily: font,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: -3,
        color: '#fff',
      }}
    >
      {words.map((x, i) => {
        const s = spring({frame: f - delay - i * 4, fps, config: {damping: 16, stiffness: 120}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: size * 0.22,
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [70, 0])}px) scale(${interpolate(s, [0, 1], [0.88, 1])})`,
              filter: `blur(${interpolate(s, [0, 1], [16, 0])}px)`,
              color: x.a ? accent : '#fff',
              textShadow: x.a
                ? `0 0 28px ${accent}, 0 0 80px ${accent}99, 0 4px 0 rgba(0,0,0,0.5)`
                : '0 6px 30px rgba(0,0,0,0.8)',
            }}
          >
            {x.w}
          </span>
        );
      })}
    </div>
  );
};
