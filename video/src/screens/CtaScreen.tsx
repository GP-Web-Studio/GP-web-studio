import {interpolate, useCurrentFrame} from 'remotion';
import {Headline} from '../components/Headline';
import {C, font, useSpr} from '../theme';

export const CtaScreen: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpr(28, 10, 120);
  const sub = useSpr(50, 16, 110);
  const pulse = 1 + Math.sin(f / 5) * 0.025;
  const glowR = 60 + (0.5 + Math.sin(f / 5) * 0.5) * 70;
  const shine = ((f - 40) * 22) % 1500;
  return (
    <>
      <Headline text="Escríbeme y *lo vemos*" top={330} size={150} />
      <div style={{position: 'absolute', left: 60, right: 60, top: 920, fontFamily: font}}>
        {[0, 1, 2].map((i) => {
          const p = ((f + i * 20) % 60) / 60;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 80,
                border: `4px solid ${C.green}`,
                opacity: s * (1 - p) * 0.8,
                transform: `scale(${1 + p * 0.35})`,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '78px 40px',
            borderRadius: 80,
            textAlign: 'center',
            background: `linear-gradient(135deg, #3dff8f, ${C.green} 50%, #00d156)`,
            color: '#00160a',
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.05,
            opacity: s,
            transform: `scale(${interpolate(s, [0, 1], [0.5, 1]) * pulse})`,
            boxShadow: `0 0 ${glowR}px ${C.green}, 0 0 ${glowR * 2.5}px rgba(0,255,106,0.5)`,
          }}
        >
          Quiero mi página
          <br />+ chatbot
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: shine - 300,
              width: 160,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
              transform: 'skewX(-20deg)',
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1310,
          textAlign: 'center',
          fontFamily: font,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 6,
          textTransform: 'uppercase',
          color: C.text,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 30}px)`,
          textShadow: '0 0 30px rgba(0,255,106,0.6)',
        }}
      >
        Landing · Webs · Chatbots · Automatizaciones
      </div>
    </>
  );
};
