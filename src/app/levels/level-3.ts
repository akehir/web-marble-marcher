import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    2.02f, -1.57f, 1.62f,                            //Scale, Angle1, Angle2
    Eigen::Vector3f(-3.31f, 6.19f, 1.53f),           //Offset
    Eigen::Vector3f(0.12f, -0.09f, -0.09f),          //Color
    0.009f,                                          //Marble Radius
    1.570796f,                                       //Start Look Direction
    7.0f,                                            //Orbit Distance
    Eigen::Vector3f(3.18387f, 5.99466f, 0.0f),       //Marble Position
    Eigen::Vector3f(0.0f, -6.25f, 0.0f),             //Flag Position
    -7.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Hole In One"),                                  //Description
   ---------------------------------------------------------------------------------------- */

export const Level3: Level = {
  params: [],
  scale: 2.02,
  angle1: -1.57,
  angle2: 1.62,

  offset: {
    x: -3.31,
    y: 6.19,
    z: 1.53,
  },

  color: {
    x: 0.12,
    y: -0.09,
    z: -0.09,
  },

  marble: {
    radius: 0.009,
    direction: 1.570796,
    orbitDistance: 7.0,
    position: {
      x: 3.18387,
      y: 5.99466,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: -6.25,
      z: 0.0,
    },
    death: -7.0,
  },

  isPlanet: false,

  description: 'Hole In One',

};
