import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Background} from './components/Background';
import {Scene} from './components/Scene';
import {CalendarScreen} from './screens/CalendarScreen';
import {ChatScreen} from './screens/ChatScreen';
import {DashboardScreen} from './screens/DashboardScreen';
import {StatsScreen} from './screens/StatsScreen';
import {CtaScreen} from './screens/CtaScreen';
import {sec} from './theme';

const OVERLAP = 7;
const scenes = [
  {from: 0, to: 6, el: <CalendarScreen />},
  {from: 6, to: 12, el: <ChatScreen />},
  {from: 12, to: 18, el: <DashboardScreen />},
  {from: 18, to: 25, el: <StatsScreen />},
  {from: 25, to: 30, el: <CtaScreen />},
];

export const Promo: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 900], [1, 1.05]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Background />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {scenes.map((s, i) => {
          const start = Math.max(0, sec(s.from) - (i ? OVERLAP : 0));
          const end = sec(s.to) + (i < scenes.length - 1 ? OVERLAP : 0);
          return (
            <Sequence key={s.from} from={start} durationInFrames={end - start}>
              <Scene>{s.el}</Scene>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
