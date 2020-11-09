import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.8093f, -3.165f, -3.2094777f,                   //Scale, Angle1, Angle2
    Eigen::Vector3f(-1.0939f, -0.43495f, -3.1113f),  //Offset
    Eigen::Vector3f(-0.61f, -0.92f, 0.33f),          //Color
    0.005f,                                          //Marble Radius
    0.0f,                                            //Start Look Direction
    5.0f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, -0.483245f, 2.16278f),     //Marble Position
    Eigen::Vector3f(0.0f, -0.489f, -2.16278f),       //Flag Position
    -5.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Building Bridges",                              //Description
    0.0f, 0.0f, 0.06f),                              //Animation


   ---------------------------------------------------------------------------------------- */

export const Level17: Level = {
  scale: 1.8093,
  angle1: -3.165,
  angle2: -3.2094777,

  offset: {
    x: -1.0939,
    y: -0.43495,
    z: -3.1113,
  },

  color: {
    x: -0.61,
    y: -0.92,
    z: 0.33,
  },

  marble: {
    radius: 0.005,
    direction: 0.0,
    orbitDistance: 5.0,
    position: {
      x: 0.0,
      y: -0.483245,
      z: 2.16278,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: -0.489,
      z: -2.16278,
    },
    death: -5.0,
  },

  isPlanet: false,

  description: 'Building Bridges',

  animation: {
    x: 0.0,
    y: 0.0,
    z: 0.06,
  }

};


