import {interpolate, useCurrentFrame} from 'remotion';
import {Glass} from '../components/Glass';
import {Headline} from '../components/Headline';
import {C, font, useSpr} from '../theme';

const Cell: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const col = i % 7;
  const row = Math.floor(i / 7);
  const d = 14 + (col + row) * 2.5;
  const o = interpolate(f, [d, d + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const today = i === 16;
  const pulse = 0.5 + Math.sin(f / 6) * 0.5;
  return (
    <div
      style={{
        aspectRatio: '1',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.03)',
        border: today ? `3px solid ${C.green}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: today ? `0 0 ${20 + pulse * 25}px rgba(0,255,106,0.7)` : 'none',
        color: today ? C.green : C.muted,
        fontSize: 30,
        fontWeight: 700,
        padding: '12px 14px',
        opacity: o,
        transform: `scale(${0.8 + 0.2 * o})`,
      }}
    >
      {i + 1}
    </div>
  );
};

export const CalendarScreen: React.FC = () => {
  const f = useCurrentFrame();
  const card = useSpr(10, 18, 90);
  const pill = useSpr(52, 9, 140);
  const scan = interpolate(f, [30, 75], [-10, 110], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 0.5 + Math.sin(f / 5) * 0.5;
  return (
    <>
      <Headline text="¿Tu negocio no tiene *página* ni *chatbot*?" />
      <div
        style={{
          position: 'absolute',
          top: 760,
          left: 60,
          right: 60,
          opacity: card,
          transform: `translateY(${(1 - card) * 120}px) scale(${0.94 + 0.06 * card})`,
          fontFamily: font,
          color: C.text,
        }}
      >
        <Glass style={{padding: 44}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}}>
            <div style={{fontSize: 52, fontWeight: 900, letterSpacing: -1}}>Octubre</div>
            <div style={{fontSize: 30, fontWeight: 700, color: C.muted}}>
              Citas online: <span style={{color: C.red}}>0</span>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, marginBottom: 14}}>
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
              <div key={d} style={{textAlign: 'center', fontSize: 26, fontWeight: 800, color: C.green}}>
                {d}
              </div>
            ))}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12}}>
            {Array.from({length: 28}).map((_, i) => (
              <Cell key={i} i={i} />
            ))}
          </div>
          {/* scan line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${scan}%`,
              height: 6,
              background: C.green,
              boxShadow: '0 0 40px 10px rgba(0,255,106,0.6)',
              opacity: 0.8,
            }}
          />
          {/* overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(0,0,0,${0.55 * pill})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 70,
              right: 70,
              top: '50%',
              marginTop: -90,
              padding: '44px 0',
              borderRadius: 36,
              textAlign: 'center',
              background: '#010302',
              border: `3px solid ${C.green}`,
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: -3,
              color: C.green,
              textShadow: `0 0 30px ${C.green}`,
              boxShadow: `0 0 ${50 + pulse * 50}px rgba(0,255,106,0.75)`,
              opacity: pill,
              transform: `scale(${0.5 + 0.5 * pill})`,
            }}
          >
            Sin citas
          </div>
        </Glass>
      </div>
    </>
  );
};
