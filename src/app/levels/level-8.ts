import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.87f, -3.12f, 0.02f,                            //Scale, Angle1, Angle2
    Eigen::Vector3f(-3.57f, 0.129f, 2.95f),          //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.02f,                                           //Marble Radius
    3.14159f,                                        //Start Look Direction
    4.2f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, 3.66236f, -3.30036f),      //Marble Position
    Eigen::Vector3f(0.0f, 3.64236f, 3.80f),          //Flag Position
    -3.6f,                                           //Death Barrier
    false,                                           //Is Planet
    "The Catwalk",                                   //Description
    0.0f, 0.0f, 0.05f),                              //Animation
   ---------------------------------------------------------------------------------------- */

export const Level8: Level = {
  params: [],
  scale: 1.87,
  angle1: -3.12,
  angle2: 0.02,

  offset: {
    x: -3.57,
    y: 0.129,
    z: 2.95,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.02,
    direction: 3.14159,
    orbitDistance: 4.2,
    position: {
      x: 0.0,
      y: 3.66236,
      z: -3.30036,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: 3.64236,
      z: 3.80,
    },
    death: -3.6,
  },

  isPlanet: false,

  description: 'The Catwalk',

  animation: {
    x: 0.0,
    y: 0.0,
    z: 0.05,
  }

};
