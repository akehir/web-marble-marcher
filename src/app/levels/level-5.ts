import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.77f, -0.22f, 5.62f,                            //Scale, Angle1, Angle2
    Eigen::Vector3f(-2.08f, -1.42f, -1.93f),         //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.02f,                                           //Marble Radius
    0.545116f,                                       //Start Look Direction
    3.3f,                                            //Orbit Distance
    Eigen::Vector3f(1.98046f, 2.56955f, 2.08186f),   //Marble Position
    Eigen::Vector3f(-0.514117f, 3.14f, -2.01516f),   //Flag Position
    -3.8f,                                           //Death Barrier
    false,                                           //Is Planet
    "The Hills Are Alive",                           //Description
    0.0f, 0.06f, 0.0f),                              //Animation
   ---------------------------------------------------------------------------------------- */

export const Level5: Level = {
  params: [],
  scale: 1.77,
  angle1: -0.22,
  angle2: 5.62,

  offset: {
    x: -2.08,
    y: -1.42,
    z: -1.93,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.02,
    direction: 0.545116,
    orbitDistance: 3.3,
    position: {
      x: 1.98046,
      y: 2.56955,
      z: 2.08186,
    },
  },

  flag: {
    position: {
      x: -0.514117,
      y: 3.14,
      z: -2.01516,
    },
    death: -3.8,
  },

  isPlanet: false,

  description: 'The Hills Are Alive',

  animation: {
    x: 0.0,
    y: 0.06,
    z: 0.0,
  }

};
