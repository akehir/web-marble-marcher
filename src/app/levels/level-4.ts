import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.65f, 0.37f, 5.26f,                             //Scale, Angle1, Angle2
    Eigen::Vector3f(-1.41f, -0.22f, -0.77f),         //Offset
    Eigen::Vector3f(0.14f, -1.71f, 0.31f),           //Color
    0.01f,                                           //Marble Radius
    3.14159f,                                        //Start Look Direction
    3.1f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, 2.26418f, 0.0f),           //Marble Position
    Eigen::Vector3f(0.0f, -2.25f, 0.0f),             //Flag Position
    -999.0f,                                         //Death Barrier
    true,                                            //Is Planet
    "Around The World"),                             //Description
   ---------------------------------------------------------------------------------------- */

export const Level4: Level = {
  scale: 1.65,
  angle1: 0.37,
  angle2: 5.26,

  offset: {
    x: -1.41,
    y: -0.22,
    z: -0.77,
  },

  color: {
    x: 0.14,
    y: -1.71,
    z: 0.31,
  },

  marble: {
    radius: 0.01,
    direction: 3.14159,
    orbitDistance: 3.1,
    position: {
      x: 0.0,
      y: 2.26418,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: -2.25,
      z: 0.0,
    },
    death: -999.0,
  },

  isPlanet: true,

  description: 'Around The World',

};
