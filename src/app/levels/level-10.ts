import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.93f, 1.34637f, 1.58f,                          //Scale, Angle1, Angle2
    Eigen::Vector3f(-2.31f, 1.123f, 1.56f),          //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.02f,                                           //Marble Radius
    -2.39681f,                                       //Start Look Direction
    2.7f,                                            //Orbit Distance
    Eigen::Vector3f(-1.71412f, 1.84836f, -1.70884f), //Marble Position
    Eigen::Vector3f(0.0f, 2.13651f, 1.74782f),       //Flag Position
    -3.6f,                                           //Death Barrier
    false,                                           //Is Planet
    "Don't Get Crushed",                             //Description
    0.1f, 0.0f, 0.0f),                               //Animation
   ---------------------------------------------------------------------------------------- */

export const Level10: Level = {
  scale: 1.93,
  angle1: 1.34637,
  angle2: 1.58,

  offset: {
    x: -2.31,
    y: 1.123,
    z: 1.56,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.02,
    direction: -2.39681,
    orbitDistance: 2.7,
    position: {
      x: -1.71412,
      y: 1.84836,
      z: -1.70884,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: 2.13651,
      z: 1.74782,
    },
    death: -3.6,
  },

  isPlanet: false,

  description: 'Don\'t Get Crushed',

  animation: {
    x: 0.1,
    y: 0.0,
    z: 0.0,
  }

};
