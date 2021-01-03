import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    2.03413f, 1.688f, -1.57798f,                     //Scale, Angle1, Angle2
    Eigen::Vector3f(-4.803822f, -4.1f, -1.39063f),   //Offset
    Eigen::Vector3f(-0.95f, -0.16f, 0.14f),          //Color
    0.005f,                                          //Marble Radius
    1.570796f,                                       //Start Look Direction
    7.0f,                                            //Orbit Distance
    Eigen::Vector3f(3.77655f, 4.7211f, 0.0f),        //Marble Position
    Eigen::Vector3f(-3.77655f, 4.716f, 0.0f),        //Flag Position
    -5.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Bunny Hops"),                                   //Description
   ---------------------------------------------------------------------------------------- */

export const Level21: Level = {
  params: [],
  scale: 2.03413,
  angle1: 1.688,
  angle2: -1.57798,

  offset: {
    x: -4.803822,
    y: -4.1,
    z: -1.39063,
  },

  color: {
    x: -0.95,
    y: -0.16,
    z: 0.14,
  },

  marble: {
    radius: 0.005,
    direction: 1.570796,
    orbitDistance: 7.0,
    position: {
      x: 3.77655,
      y: 4.7211,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: -3.77655,
      y: 4.716,
      z: 0.0,
    },
    death: -5.0,
  },

  isPlanet: false,

  description: 'Bunny Hops',

};
