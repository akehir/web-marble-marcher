import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.91f, 0.06f, -0.76f,                            //Scale, Angle1, Angle2
    Eigen::Vector3f(-3.44f, -0.69f, -1.14f),         //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.012f,                                          //Marble Radius
    3.14159f,                                        //Start Look Direction
    5.0f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, 3.78299f, 0.0f),           //Marble Position
    Eigen::Vector3f(0.0f, -3.77f, 0.0f),             //Flag Position
    -999.0f,                                         //Death Barrier
    true,                                            //Is Planet
    "The Crown Jewels",                              //Description
    0.0f, 0.05f, 0.0f),                              //Animation
   ---------------------------------------------------------------------------------------- */

export const Level19: Level = {
  scale: 1.91,
  angle1: 0.06,
  angle2: -0.76,

  offset: {
    x: -3.44,
    y: -0.69,
    z: -1.14,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.012,
    direction: 3.14159,
    orbitDistance: 5.0,
    position: {
      x: 0.0,
      y: 3.78299,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: -3.77,
      z: 0.0,
    },
    death: -999.0,
  },

  isPlanet: true,

  description: 'The Crown Jewels',

  animation: {
    x: 0.0,
    y: 0.05,
    z: 0.0,
  }

};
