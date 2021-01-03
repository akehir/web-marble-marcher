import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.8986f, -0.4166f, 0.00683f,                     //Scale, Angle1, Angle2
    Eigen::Vector3f(-2.5130f, -5.4067f, -2.51f),     //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.01f,                                           //Marble Radius
    -1.570796f,                                      //Start Look Direction
    5.0f,                                            //Orbit Distance
    Eigen::Vector3f(1.19695f, 3.19773f, 2.8491f),    //Marble Position
    Eigen::Vector3f(1.168f, 3.195f, -2.8491f),       //Flag Position
    -5.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Expressways"),                                  //Description
   ---------------------------------------------------------------------------------------- */

export const Level20: Level = {
  params: [],
  scale: 1.8986,
  angle1: -0.4166,
  angle2: 0.00683,

  offset: {
    x: -2.5130,
    y: -5.4067,
    z: -2.51,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.01,
    direction: -1.570796,
    orbitDistance: 5.0,
    position: {
      x: 1.19695,
      y: 3.19773,
      z: 2.8491,
    },
  },

  flag: {
    position: {
      x: 1.168,
      y: 3.195,
      z: -2.8491,
    },
    death: -5.0,
  },

  isPlanet: false,

  description: 'Expressways',

};
