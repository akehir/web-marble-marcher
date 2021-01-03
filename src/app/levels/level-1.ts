import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.8f, -0.12f, 0.5f,                              //Scale, Angle1, Angle2
    Eigen::Vector3f(-2.12f, -2.75f, 0.49f),          //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.035f,                                          //Marble Radius
    -2.0f,                                           //Start Look Direction
    3.3f,                                            //Orbit Distance
    Eigen::Vector3f(-2.95862f, 2.68825f, -1.11868f), //Marble Position
    Eigen::Vector3f(2.95227f, 2.65057f, 1.11848f),   //Flag Position
    -4.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Jump The Crater"),                              //Description
   ---------------------------------------------------------------------------------------- */

export const Level1: Level = {
  params: [],
  scale: 1.8,
  angle1: -0.12,
  angle2: 0.5,

  offset: {
    x: -2.12,
    y: -2.75,
    z: 0.49,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.035,
    direction: -2.0,
    orbitDistance: 3.3,
    position: {
      x: -2.95862,
      y: 2.68825,
      z: -1.11868,
    },
  },

  flag: {
    position: {
      x: 2.95227,
      y: 2.65057,
      z: 1.11848,
    },
    death: -4.0,
  },

  isPlanet: false,

  description: 'Jump The Crater',
};
