import { Coordinate } from './coordinate';


export interface Level {
  scale: number;
  angle1: number;
  angle2: number;
  offset: Coordinate;
  color: Coordinate;

  marble: {
    radius: number;
    direction: number;
    orbitDistance: number;
    position: Coordinate;
  };

  flag: {
    position: Coordinate;
    death: number;
  };

  isPlanet: boolean;

  description: string;

  animation?: Coordinate;

}
