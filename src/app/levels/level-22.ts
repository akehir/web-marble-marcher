import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.6516888f, 0.026083898f, -0.7996324f,           //Scale, Angle1, Angle2
    Eigen::Vector3f(-3.85863f, -5.13741f, -0.918303f),//Offset
    Eigen::Vector3f(0.42f, 0.38f, 0.19f),            //Color
    0.016f,                                          //Marble Radius
    0.0f,                                            //Start Look Direction
    7.0f,                                            //Orbit Distance
    Eigen::Vector3f(0.0f, 5.91936f, 4.3357f),        //Marble Position
    Eigen::Vector3f(0.0f, -1.01f, -3.94f),           //Flag Position
    -6.5f,                                           //Death Barrier
    false,                                           //Is Planet
    "Asteroid Field"),                               //Description
   ---------------------------------------------------------------------------------------- */

export const Level22: Level = {
  params: [],
  scale: 1.6516888,
  angle1: 0.026083898,
  angle2: -0.7996324,

  offset: {
    x: -3.85863,
    y: -5.13741,
    z: -0.918303,
  },

  color: {
    x: 0.42,
    y: 0.38,
    z: 0.19,
  },

  marble: {
    radius: 0.016,
    direction: 0.0,
    orbitDistance: 7.0,
    position: {
      x: 0.0,
      y: 5.91936,
      z: 4.3357,
    },
  },

  flag: {
    position: {
      x: 0.0,
      y: -1.01,
      z: -3.94,
    },
    death: -6.5,
  },

  isPlanet: false,

  description: 'Asteroid Field',

};
