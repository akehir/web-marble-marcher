import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.95f, 1.570796f, 0.0f,                          //Scale, Angle1, Angle2
    Eigen::Vector3f(-6.75f, -3.0f, 0.0f),            //Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.022f,                                          //Marble Radius
    0.0f,                                            //Start Look Direction
    6.3f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, 3.96637f, 4.54647f),       //Marble Position
    Eigen::Vector3f(0.0f, 0.396f, -2.38815f),        //Flag Position
    -5.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Pylon Palace"),                                 //Description
   ---------------------------------------------------------------------------------------- */

export const Level18: Level = {
  scale: 1.95,
  angle1: 1.570796,
  angle2: 0.0,

  offset: {
    x: -6.75,
    y: -3.0,
    z: 0.0,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.022,
    direction: 0.0,
    orbitDistance: 6.3,
    position: {
      x: 0.0,
      y: 3.96637,
      z: 4.54647,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: 0.396,
      z: -2.38815,
    },
    death: -5.0,
  },

  isPlanet: false,

  description: 'Pylon Palac',

};
