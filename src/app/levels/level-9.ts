import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.81f, -4.84f, -2.99f,                           //Scale, Angle1, Angle2
    Eigen::Vector3f(-2.905f, 0.765f, -4.165f),       //Offset
    Eigen::Vector3f(0.16f, 0.38f, 0.15f),            //Color
    0.022f,                                          //Marble Radius
    -1.570796f,                                      //Start Look Direction
    4.5f,                                            //Orbit Distance
    Eigen::Vector3f(-4.63064f, 3.6365f, 0.0f),       //Marble Position
    Eigen::Vector3f(4.63f, 3.61f, 0.0f),             //Flag Position
    -5.5f,                                           //Death Barrier
    false,                                           //Is Planet
    "Mind The Gap"),                                 //Description
   ---------------------------------------------------------------------------------------- */

export const Level9: Level = {
  scale: 1.81,
  angle1: -4.84,
  angle2: -2.99,

  offset: {
    x: -2.905,
    y: 0.765,
    z: -4.165,
  },

  color: {
    x: 0.16,
    y: 0.38,
    z: 0.15,
  },

  marble: {
    radius: 0.022,
    direction: -1.570796,
    orbitDistance: 4.5,

    position: {
      x: -4.63064,
      y: 3.6365,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: 4.63,
      y: 3.61,
      z: 0.0,
    },
    death: -5.5,
  },

  isPlanet: false,

  description: 'Mind The Gap',

};
