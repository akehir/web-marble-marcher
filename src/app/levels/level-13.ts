import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    2.08f, -4.79f, 3.16f,                            //Scale, Angle1, Angle2
    Eigen::Vector3f(-7.43f, 5.96f, -6.23f),          //Offset
    Eigen::Vector3f(0.16f, 0.38f, 0.15f),            //Color
    0.023f,                                          //Marble Radius
    1.570796f,                                       //Start Look Direction
    7.6f,                                            //Orbit Distance
    Eigen::Vector3f(6.06325f, 6.32712f, 0.0f),       //Marble Position
    Eigen::Vector3f(0.0f, 6.72f, 0.0f),              //Flag Position
    -7.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Build Up Speed"),                               //Description
   ---------------------------------------------------------------------------------------- */

export const Level13: Level = {
  params: [],
  scale: 2.08,
  angle1: -4.79,
  angle2: 3.16,

  offset: {
    x: -7.43,
    y: 5.96,
    z: -6.23,
  },

  color: {
    x: 0.16,
    y: 0.38,
    z: 0.15,
  },

  marble: {
    radius: 0.023,
    direction: 1.570796,
    orbitDistance: 7.6,
    position: {
      x: 6.06325,
      y: 6.32712,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: 6.72,
      z: 0.0,
    },
    death: -7.0,
  },

  isPlanet: false,

  description: 'Build Up Speed',

};
