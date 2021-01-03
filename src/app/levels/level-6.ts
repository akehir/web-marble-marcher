import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.66f, 1.52f, 0.19f,                             //Scale, Angle1, Angle2
    Eigen::Vector3f(-3.83f, -1.94f, -1.09f),         //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.02f,                                           //Marble Radius
    0.0f,                                            //Start Look Direction
    3.1f,                                            //Orbit Distance
    Eigen::Vector3f(0.68147f, 2.80038f, 2.52778f),   //Marble Position
    Eigen::Vector3f(0.0f, 2.84448f, -2.71705f),      //Flag Position
    -4.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Beware Of Bumps"),                              //Description
   ---------------------------------------------------------------------------------------- */

export const Level6: Level = {
  params: [],
  scale: 1.66,
  angle1: 1.52,
  angle2: 0.19,

  offset: {
    x: -3.83,
    y: -1.94,
    z: -1.09,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.02,
    direction: 0.0,
    orbitDistance: 3.1,
    position: {
      x: 0.68147,
      y: 2.80038,
      z: 2.52778,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: 2.84448,
      z: -2.71705,
    },
    death: -4.0,
  },

  isPlanet: false,

  description: 'Beware Of Bumps',

};
