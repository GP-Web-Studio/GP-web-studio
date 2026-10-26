import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {CountUp} from '../components/CountUp';
import {Glass} from '../components/Glass';
import {Headline} from '../components/Headline';
import {C, font, useSpr} from '../theme';

const Ring: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [14, 84], [0, 1], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const burst = interpolate(f, [84, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const R = 300;
  const circ = 2 * Math.PI * R;
  return (
    <svg width={760} height={760} viewBox="0 0 760 760" style={{position: 'absolute', left: 140, top: 0, overflow: 'visible'}}>
      <circle cx={380} cy={380} r={R} stroke="rgba(255,255,255,0.07)" strokeWidth={30} fill="none" />
      <circle
        cx={380}
        cy={380}
        r={R}
        stroke={C.green}
        strokeWidth={30}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - p * 0.92)}
        transform="rotate(-90 380 380)"
        style={{filter: 'drop-shadow(0 0 22px #00ff6a)'}}
      />
      <circle
        cx={380}
        cy={380}
        r={R + burst * 160}
        stroke={C.green}
        strokeWidth={6}
        fill="none"
        opacity={burst > 0 ? 1 - burst : 0}
      />
    </svg>
  );
};

const Bars: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const hs = [30, 48, 40, 70, 62, 100];
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 12, height: 110}}>
      {hs.map((h, i) => {
        const p = interpolate(f, [start + i * 4, start + i * 4 + 20], [0, 1], {
          easing: Easing.out(Easing.back(2)),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              width: 34,
              height: h * p,
              borderRadius: 10,
              background: C.green,
              boxShadow: '0 0 18px rgba(0,255,106,0.8)',
            }}
          />
        );
      })}
    </div>
  );
};

const Stat: React.FC<{delay: number; label: string; children: React.ReactNode}> = ({delay, label, children}) => {
  const s = useSpr(delay, 11, 130);
  return (
    <Glass
      borderColor="rgba(0,255,106,0.55)"
      style={{
        flex: 1,
        height: 340,
        padding: 36,
        opacity: s,
        transform: `translateY(${(1 - s) * 120}px) scale(${0.85 + 0.15 * s})`,
      }}
    >
      <div style={{fontSize: 28, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1}}>
        {label}
      </div>
      <div style={{marginTop: 20}}>{children}</div>
    </Glass>
  );
};

export const StatsScreen: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 84 && f < 94 ? Math.sin(f * 4) * 6 : 0;
  const lbl = useSpr(20, 14, 120);
  const arrow = Math.sin(f / 6) * 10;
  return (
    <>
      <Headline text="Te lo dejo listo en *pocos días*" />
      <div style={{position: 'absolute', top: 640, left: 0, width: 1080, transform: `translateX(${shake}px)`, fontFamily: font, color: C.text}}>
        <div style={{position: 'relative', height: 760}}>
          <Ring />
          <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center'}}>
            <CountUp to={340} start={14} duration={70} prefix="+" suffix="%" size={230} />
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: 'uppercase',
                opacity: lbl,
                transform: `translateY(${(1 - lbl) * 30}px)`,
              }}
            >
              Leads
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 28, padding: '0 60px'}}>
          <Stat delay={50} label="Respuestas automáticas">
            <span
              style={{
                fontSize: 150,
                fontWeight: 900,
                letterSpacing: -4,
                color: C.green,
                textShadow: '0 0 30px #00ff6a, 0 0 80px #00ff6a88',
              }}
            >
              24/7
            </span>
          </Stat>
          <Stat delay={78} label="Conversiones">
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 20}}>
              <span
                style={{
                  fontSize: 160,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: C.green,
                  textShadow: '0 0 30px #00ff6a',
                  transform: `translateY(${-arrow}px)`,
                }}
              >
                ↑
              </span>
              <Bars start={84} />
            </div>
          </Stat>
        </div>
      </div>
    </>
  );
};
