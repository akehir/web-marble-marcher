import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.9073f, -9.83f, -1.16f,                         //Scale, Angle1, Angle2
    Eigen::Vector3f(-3.508f, -3.593f, 3.295f),       //Offset
    Eigen::Vector3f(-0.34f, 0.12f, -0.08f),          //Color
    0.04f,                                           //Marble Radius
    -2.365f,                                         //Start Look Direction
    5.8f,                                            //Orbit Distance
    Eigen::Vector3f(-3.40191f, 4.14347f, -3.48312f), //Marble Position
    Eigen::Vector3f(3.40191f, 4.065f, 3.48312f),     //Flag Position
    -4.5f,                                           //Death Barrier
    false,                                           //Is Planet
    "Too Many Trees"),                               //Description
   ---------------------------------------------------------------------------------------- */

export const Level2: Level = {
  params: [],
  scale: 1.9073,
  angle1: -9.83,
  angle2: -1.16,

  offset: {
    x: -3.508,
    y: -3.593,
    z: 3.295,
  },

  color: {
    x: -0.34,
    y: 0.12,
    z: -0.08,
  },

  marble: {
    radius: 0.04,
    direction: -2.365,
    orbitDistance: 5.8,
    position: {
      x: -3.40191,
      y: 4.14347,
      z: -3.48312,
    },
  },

  flag: {
    position: {
      x: 3.40191,
      y: 4.065,
      z: 3.48312,
    },
    death: -4.5,
  },

  isPlanet: false,

  description: 'Too Many Trees',

};
