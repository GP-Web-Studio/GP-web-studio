import {interpolate, useCurrentFrame} from 'remotion';
import {Glass} from '../components/Glass';
import {Headline} from '../components/Headline';
import {C, font, useSpr} from '../theme';

const msgs = [
  {t: 24, who: 'Carla · Instagram', text: '¿Cuánto cuesta?'},
  {t: 56, who: 'Diego · WhatsApp', text: '¿Abren hoy?'},
  {t: 88, who: 'Lucía · WhatsApp', text: '¿Qué horario tienen?'},
  {t: 124, who: 'Carla · Instagram', text: '¿Hola? ¿Hay alguien?'},
];

const Bubble: React.FC<{t: number; who: string; text: string}> = ({t, who, text}) => {
  const f = useCurrentFrame();
  const s = useSpr(t, 13, 130);
  const late = interpolate(f, [t + 20, t + 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        opacity: s,
        transform: `translateX(${(1 - s) * -140}px) scale(${0.85 + 0.15 * s})`,
        transformOrigin: 'left center',
        marginBottom: 26,
      }}
    >
      <div style={{fontSize: 26, fontWeight: 700, color: C.green, marginBottom: 8, marginLeft: 12}}>{who}</div>
      <div
        style={{
          display: 'inline-block',
          padding: '26px 44px',
          borderRadius: '40px 40px 40px 8px',
          background: 'linear-gradient(135deg, #16281d, #0e1b13)',
          border: '1px solid rgba(0,255,106,0.25)',
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        {text}
      </div>
      <div style={{fontSize: 26, fontWeight: 700, color: C.red, margin: '8px 0 0 12px', opacity: late}}>
        ● Sin respuesta
      </div>
    </div>
  );
};

export const ChatScreen: React.FC = () => {
  const f = useCurrentFrame();
  const card = useSpr(6, 18, 90);
  const badgeN = Math.min(4, msgs.filter((m) => f > m.t + 20).length);
  const badge = useSpr(44, 8, 200);
  return (
    <>
      <Headline text="Estás perdiendo *clientes* todos los días" accent={C.red} />
      <div
        style={{
          position: 'absolute',
          top: 740,
          left: 60,
          right: 60,
          opacity: card,
          transform: `translateY(${(1 - card) * 120}px)`,
          fontFamily: font,
          color: C.text,
        }}
      >
        <Glass style={{padding: 44, height: 1040}} borderColor="rgba(255,59,82,0.35)">
          <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40}}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 88,
                background: `linear-gradient(135deg, ${C.green}, #007a3a)`,
                boxShadow: '0 0 30px rgba(0,255,106,0.6)',
              }}
            />
            <div style={{flex: 1}}>
              <div style={{fontSize: 44, fontWeight: 900}}>Mensajes</div>
              <div style={{fontSize: 26, color: C.muted, fontWeight: 600}}>Tu negocio · fuera de línea</div>
            </div>
            <div
              style={{
                minWidth: 84,
                height: 84,
                borderRadius: 84,
                background: C.red,
                color: '#fff',
                fontSize: 48,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(255,59,82,0.8)',
                transform: `scale(${badge})`,
              }}
            >
              {badgeN}
            </div>
          </div>
          {msgs.map((m) => (
            <Bubble key={m.t} {...m} />
          ))}
        </Glass>
      </div>
    </>
  );
};
