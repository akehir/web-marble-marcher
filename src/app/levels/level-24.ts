import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    2.13f, -1.77f, -1.62f,                           //Scale, Angle1, Angle2
    Eigen::Vector3f(-4.99f, -3.05f, -4.48f),         //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.01f,                                           //Marble Radius
    3.14159f,                                        //Start Look Direction
    6.2f,                                            //Orbit Distance
    Eigen::Vector3f(0.479104f,  2.18768f, -4.29408f),//Marble Position
    Eigen::Vector3f(0.479104f,  2.177f, 4.29408f),   //Flag Position
    -4.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Fatal Fissures"),                               //Description
   ---------------------------------------------------------------------------------------- */

export const Level24: Level = {
  params: [],
  scale: 2.13,
  angle1: -1.77,
  angle2: -1.62,

  offset: {
    x: -4.99,
    y: -3.05,
    z: -4.48,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.01,
    direction: 3.14159,
    orbitDistance: 6.2,
    position: {
      x: 0.479104,
      y: 2.18768,
      z: -4.29408,
    },
  },

  flag: {
    position: {
      x: 0.479104,
      y: 2.177,
      z: 4.29408,
    },
    death: -4.0,
  },

  isPlanet: false,

  description: 'Fatal Fissures',

};
