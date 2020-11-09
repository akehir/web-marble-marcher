import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.88f, 1.52f, 4.91f,                             //Scale, Angle1, Angle2
    Eigen::Vector3f(-4.54f, -1.26f, 0.1f),           //Offset
    Eigen::Vector3f(-1.0f, 0.3f, -0.43f),            //Color
    0.03f,                                           //Marble Radius
    -1.570796f,                                      //Start Look Direction
    5.7f,                                            //Orbit Distance
    Eigen::Vector3f(-2.8896f, 3.76526f, 0.0f),       //Marble Position
    Eigen::Vector3f(2.88924f, 3.73f, 0.0f),          //Flag Position
    -4.5f,                                           //Death Barrier
    false,                                           //Is Planet
    "The Sponge"),                                   //Description

   ---------------------------------------------------------------------------------------- */

export const Level11: Level = {
  scale: 1.88,
  angle1: 1.52,
  angle2: 4.91,

  offset: {
    x: -4.54,
    y: -1.26,
    z: 0.1,
  },

  color: {
    x: -1.0,
    y: 0.3,
    z: -0.43,
  },

  marble: {
    radius: 0.03,
    direction: -1.570796,
    orbitDistance: 5.7,
    position: {
      x: -2.8896,
      y: 3.76526,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: 2.88924,
      y: 3.73,
      z: 0.0,
    },
    death: -4.5,
  },

  isPlanet: false,

  description: 'The Sponge',

};
