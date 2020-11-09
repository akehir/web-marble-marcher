import { Level } from '../types';

/* ----------------------------------------------------------------------------------------
  Level(
    1.77746f, 4.62318f, 0.0707307f,                  //Scale, Angle1, Angle2
    Eigen::Vector3f(-4.6867f, -0.84376f, 1.98158f),  //Offset
    Eigen::Vector3f(-0.35f, 1.5f, 0.48f),            //Color
    0.016f,                                          //Marble Radius
    1.570796f,                                       //Start Look Direction
    7.0f,                                            //Orbit Distance
    Eigen::Vector3f(3.03669f, 4.3497f, 0.0f),        //Marble Position
    Eigen::Vector3f(-3.03669f, 4.331f, 0.0f),        //Flag Position
    -5.0f,                                           //Death Barrier
    false,                                           //Is Planet
    "Lily Pads"),                                    //Description
   ---------------------------------------------------------------------------------------- */

export const Level23: Level = {
  scale: 1.77746,
  angle1: 4.62318,
  angle2: 0.0707307,

  offset: {
    x: -4.6867,
    y: -0.84376,
    z: 1.98158,
  },

  color: {
    x: -0.35,
    y: 1.5,
    z: 0.48,
  },

  marble: {
    radius: 0.016,
    direction: 1.570796,
    orbitDistance: 7.0,
    position: {
      x: 3.03669,
      y: 4.3497,
      z: 0.0,
    },
  },

  flag: {
    position: {
      x: -3.03669,
      y: 4.331,
      z: 0.0,
    },
    death: -5.0,
  },

  isPlanet: false,

  description: 'Lily Pads',

};
