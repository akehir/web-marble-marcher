import { Level } from '../types';

export function levelToFracParams(level: Level): number[] {
  return [
    level.scale,
    level.angle1,
    level.angle2,
    level.offset.x,
    level.offset.y,
    level.offset.z,
    level.color.x,
    level.color.y,
    level.color.z,
  ];
}
