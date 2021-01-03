import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    2.0773f, -9.66f, -1.34f,                         //Scale, Angle1, Angle2
    Eigen::Vector3f(-1.238f, -1.533f, 1.085f),       //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.01f,                                           //Marble Radius
    1.4f,                                            //Start Look Direction
    3.0f,                                            //Orbit Distance
    Eigen::Vector3f(1.03543f, 1.06432f, 1.22698f),   //Marble Position
    Eigen::Vector3f(-1.39536f, 0.641835f, 0.0f),     //Flag Position
    -2.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Around The Citadel"),                           //Description
   ---------------------------------------------------------------------------------------- */

export const Level14: Level = {
  params: [],
  scale: 2.0773,
  angle1: -9.66,
  angle2: -1.34,

  offset: {
    x: -1.238,
    y: -1.533,
    z: 1.085,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.01,
    direction: 1.4,
    orbitDistance: 3.0,
    position: {
      x: 1.03543,
      y: 1.06432,
      z: 1.22698,
    },
  },

  flag: {
    position: {
      x: -1.39536,
      y: 0.641835,
      z: 0.0,
    },
    death: -2.0,
  },

  isPlanet: false,

  description: 'Around The Citadel',

};
