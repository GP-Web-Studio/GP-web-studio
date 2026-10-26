import {Composition} from 'remotion';
import {Promo} from './Promo';
import {FPS, DURATION} from './theme';

export const Root: React.FC = () => (
  <Composition
    id="Promo"
    component={Promo}
    durationInFrames={DURATION * FPS}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
