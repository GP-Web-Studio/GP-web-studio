import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

type Props = {
  to: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
};

export const CountUp: React.FC<Props> = ({
  to,
  start = 0,
  duration = 45,
  prefix = '',
  suffix = '',
  size = 96,
  color = C.green,
}) => {
  const f = useCurrentFrame() - start;
  const {fps} = useVideoConfig();
  const v = interpolate(f, [0, duration], [0, to], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pop = spring({frame: f - duration, fps, config: {damping: 5, stiffness: 220}});
  const scale = f < duration ? 1 : 1 + 0.22 * (1 - pop);
  const vis = interpolate(f, [-4, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: size,
        fontWeight: 900,
        letterSpacing: -2,
        color,
        opacity: vis,
        transform: `scale(${scale})`,
        textShadow: `0 0 24px ${color}, 0 0 70px ${color}aa`,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {prefix}
      {Math.round(v)}
      {suffix}
    </span>
  );
};
