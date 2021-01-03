import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.58f, -1.45f, 3.95f,                            //Scale, Angle1, Angle2
    Eigen::Vector3f(-1.55f, -0.13f, -2.52f),         //Offset
    Eigen::Vector3f(-1.17f, -0.4f, -1.0f),           //Color
    0.02f,                                           //Marble Radius
    0.0f,                                            //Start Look Direction
    4.3f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, 3.36453f, 2.28284f),       //Marble Position
    Eigen::Vector3f(0.0f, 3.68893f, -0.604513f),     //Flag Position
    -5.5f,                                           //Death Barrier
    false,                                           //Is Planet
    "Mountain Climbing"),                            //Description
   ---------------------------------------------------------------------------------------- */

export const Level7: Level = {
  params: [],
  scale: 1.58,
  angle1: -1.45,
  angle2: 3.95,

  offset: {
    x: -1.55,
    y: -0.13,
    z: -2.52,
  },

  color: {
    x: -1.17,
    y: -0.4,
    z: -1.0,
  },

  marble: {
    radius: 0.02,
    direction: 0.0,
    orbitDistance: 4.3,
    position: {
      x: 0.0,
      y: 3.36453,
      z: 2.28284,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: 3.68893,
      z: -0.604513,
    },
    death: -5.5,
  },

  isPlanet: false,

  description: 'Mountain Climbing',

};
