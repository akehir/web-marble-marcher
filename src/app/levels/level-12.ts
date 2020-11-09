import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.6f, 3.77f, 3.93f,                              //Scale, Angle1, Angle2
    Eigen::Vector3f(-2.0f, -0.41f, -1.43f),          //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.02f,                                           //Marble Radius
    -1.570796f,                                      //Start Look Direction
    3.5f,                                            //Orbit Distance
    Eigen::Vector3f(-2.30432f, 0.0444069f, 2.31072f),//Marble Position
    Eigen::Vector3f(2.30432f, 0.0244069f, -2.31072f),//Flag Position
    -1.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Ride The Gecko",                                //Description
    0.02f, 0.0f, 0.0f),                              //Animation
   ---------------------------------------------------------------------------------------- */

export const Level12: Level = {
  scale: 1.6,
  angle1: 3.77,
  angle2: 3.93,

  offset: {
    x: -2.0,
    y: -0.41,
    z: -1.43,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.02,
    direction: -1.570796,
    orbitDistance: 3.5,
    position: {
      x: -2.30432,
      y: 0.0444069,
      z: 2.31072,
    },
  },

  flag: {
    position: {
      x: 2.30432,
      y: 0.0244069,
      z: -2.31072,
    },
    death: -1.0,
  },

  isPlanet: false,

  description: 'Ride The Gecko',

  animation: {
    x: 0.02,
    y: 0.0,
    z: 0.0,
  }

};
