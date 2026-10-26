import {interpolate, useCurrentFrame} from 'remotion';
import {CountUp} from '../components/CountUp';
import {Glass} from '../components/Glass';
import {Headline} from '../components/Headline';
import {C, font, useSpr} from '../theme';

/** Skeleton -> live crossfade for a widget */
const Widget: React.FC<{delay: number; height: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay,
  height,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const enter = useSpr(0, 18, 90);
  const live = useSpr(delay, 16, 100);
  const shimmer = ((f * 8) % 1400) - 300;
  return (
    <Glass
      glowing={live > 0.3}
      style={{height, opacity: enter, transform: `translateY(${(1 - enter) * 100}px)`, borderColor: undefined, ...style}}
      borderColor={live > 0.3 ? 'rgba(0,255,106,0.6)' : 'rgba(255,255,255,0.08)'}
    >
      <div style={{position: 'absolute', inset: 0, padding: 36, opacity: 1 - live}}>
        <div style={{width: '40%', height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.08)'}} />
        <div style={{width: '70%', height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.06)', marginTop: 30}} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: shimmer,
            width: 220,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: 36,
          opacity: live,
          transform: `scale(${0.92 + 0.08 * live})`,
        }}
      >
        {children}
      </div>
    </Glass>
  );
};

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 30, fontWeight: 700, color: C.muted, letterSpacing: 1, textTransform: 'uppercase'}}>
    {children}
  </div>
);

const Chart: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pts = [200, 180, 190, 140, 150, 100, 110, 60, 70, 20];
  const d = pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 100} ${y}`).join(' ');
  return (
    <svg viewBox="0 0 900 220" width="100%" height={220} style={{overflow: 'visible', marginTop: 20}}>
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#00ff6a" stopOpacity={0.4} />
          <stop offset="1" stopColor="#00ff6a" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${d} L900 220 L0 220 Z`} fill="url(#g)" opacity={p} />
      <path
        d={d}
        fill="none"
        stroke={C.green}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        style={{filter: 'drop-shadow(0 0 12px #00ff6a)'}}
      />
    </svg>
  );
};

export const DashboardScreen: React.FC = () => {
  const f = useCurrentFrame();
  const toggle = useSpr(95, 14, 120);
  const reply = useSpr(118, 12, 140);
  const pulse = 0.5 + Math.sin(f / 6) * 0.5;
  return (
    <>
      <Headline text="Landing pages + Chatbots + *Automatizaciones*" size={104} />
      <div
        style={{
          position: 'absolute',
          top: 700,
          left: 60,
          right: 60,
          fontFamily: font,
          color: C.text,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div style={{display: 'flex', gap: 28}}>
          <Widget delay={36} height={250} style={{flex: 1}}>
            <Label>Leads</Label>
            <div style={{marginTop: 10}}>
              <CountUp to={128} start={36} duration={45} size={130} />
            </div>
          </Widget>
          <Widget delay={50} height={250} style={{flex: 1}}>
            <Label>Citas agendadas</Label>
            <div style={{marginTop: 10}}>
              <CountUp to={47} start={50} duration={45} size={130} />
            </div>
          </Widget>
        </div>
        <Widget delay={64} height={340}>
          <Label>Crecimiento</Label>
          <Chart start={70} />
        </Widget>
        <Widget delay={86} height={330}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <Label>Chatbot</Label>
              <div style={{fontSize: 60, fontWeight: 900, marginTop: 6, color: C.green, textShadow: '0 0 30px #00ff6a'}}>
                ● Activo 24/7
              </div>
            </div>
            <div
              style={{
                width: 150,
                height: 80,
                borderRadius: 80,
                background: toggle > 0.5 ? C.green : '#223027',
                boxShadow: `0 0 ${30 + pulse * 30}px rgba(0,255,106,${toggle})`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8 + toggle * 70,
                  width: 64,
                  height: 64,
                  borderRadius: 64,
                  background: '#010302',
                }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: 30,
              display: 'inline-block',
              padding: '20px 36px',
              borderRadius: '32px 32px 32px 8px',
              background: C.green,
              color: '#00160a',
              fontSize: 40,
              fontWeight: 800,
              opacity: reply,
              transform: `translateY(${(1 - reply) * 30}px) scale(${0.9 + 0.1 * reply})`,
              transformOrigin: 'left',
            }}
          >
            ¡Hola! Claro, te agendo hoy ✅
          </div>
        </Widget>
      </div>
    </>
  );
};
