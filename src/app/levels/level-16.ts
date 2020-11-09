import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    2.0773f, -9.66f, -1.34f,                         //Scale, Angle1, Angle2
    Eigen::Vector3f(-1.238f, -1.533f, 1.085f),       //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.005f,                                          //Marble Radius
    0.78539816339f,                                  //Start Look Direction
    2.0f,                                            //Orbit Distance
    Eigen::Vector3f(1.04172f, 1.41944f, 1.09742f),   //Marble Position
    Eigen::Vector3f(-1.04172f, 1.414f, -1.09742f),   //Flag Position
    -2.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Top Of The Citadel"),                           //Description
   ---------------------------------------------------------------------------------------- */

export const Level16: Level = {
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
    radius: 0.005,
    direction: 0.78539816339,
    orbitDistance: 2.0,
    position: {
      x: 1.04172,
      y: 1.41944,
      z: 1.09742,
    },
  },

  flag: {
    position: {
      x: -1.04172,
      y: 1.414,
      z: -1.09742,
    },
    death: -2.0,
  },

  isPlanet: false,

  description: 'Top Of The Citadel',

};
