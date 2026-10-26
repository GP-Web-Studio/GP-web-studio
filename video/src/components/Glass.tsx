import {C} from '../theme';

type Props = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  glowing?: boolean;
  borderColor?: string;
};

export const Glass: React.FC<Props> = ({children, style, glowing = true, borderColor = C.border}) => (
  <div
    style={{
      position: 'relative',
      boxSizing: 'border-box',
      borderRadius: 44,
      background: `linear-gradient(160deg, rgba(14,30,20,0.85), ${C.card})`,
      border: `2px solid ${borderColor}`,
      boxShadow: glowing
        ? '0 0 60px rgba(0,255,106,0.22), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)'
        : '0 40px 100px rgba(0,0,0,0.7)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);
