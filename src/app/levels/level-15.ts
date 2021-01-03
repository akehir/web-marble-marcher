import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.78f, -0.1f, 3.28f,                             //Scale, Angle1, Angle2
    Eigen::Vector3f(-1.47f, 1.7f, -0.4f),            //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.02f,                                           //Marble Radius
    3.14159f,                                        //Start Look Direction
    2.9f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, 2.1431f, 0.0f),            //Marble Position
    Eigen::Vector3f(0.0, -2.12f, 0.0),               //Flag Position
    -999.0f,                                         //Death Barrier
    true,                                            //Is Planet
    "Planet Crusher",                                //Description
    0.0f, 0.08f, 0.0f),                              //Animation
   ---------------------------------------------------------------------------------------- */

export const Level15: Level = {
  params: [],
  scale: 1.78,
  angle1: -0.1,
  angle2: 3.28,

  offset: {
    x: -1.47,
    y: 1.7,
    z: -0.4,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.02,
    direction: 3.14159,
    orbitDistance: 2.9,
    position: {
      x: 0.0,
      y: 2.1431,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: -2.12,
      z: 0.0,
    },
    death: -999.0,
  },

  isPlanet: true,

  description: 'Planet Crusher',

  animation: {
    x: 0.0,
    y: 0.08,
    z: 0.0,
  }
};
