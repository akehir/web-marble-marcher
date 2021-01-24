// Adapted from:
// https://webglfundamentals.org/webgl/resources/m4.js
/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * subtracts 2 vectors3s
 * @param a a
 * @param b b
 * @param dst optional vector3 to store result
 * @return dst or new Vector3 if not provided
 */
export function subtractVectors(a, b, dst?: Float32Array): Float32Array {
  dst = dst || new Float32Array(3);
  dst[0] = a[0] - b[0];
  dst[1] = a[1] - b[1];
  dst[2] = a[2] - b[2];
  return dst;
}

/**
 * adds 2 vectors3s
 * @param a a
 * @param b b
 * @param dst optional vector3 to store result
 * @return  dst or new Vector3 if not provided
 */
export function addVectors(a, b,  dst?: Float32Array): Float32Array {
  dst = dst || new Float32Array(3);
  dst[0] = a[0] + b[0];
  dst[1] = a[1] + b[1];
  dst[2] = a[2] + b[2];
  return dst;
}

/**
 * Computes the cross product of 2 vectors3s
 * @param a a
 * @param b b
 * @param dst optional vector3 to store result
 * @return dst or new Vector3 if not provided
 */
export function cross(a, b, dst?: Float32Array): Float32Array {
  dst = dst || new Float32Array(3);
  dst[0] = a[1] * b[2] - a[2] * b[1];
  dst[1] = a[2] * b[0] - a[0] * b[2];
  dst[2] = a[0] * b[1] - a[1] * b[0];
  return dst;
}

/**
 * normalizes a vector.
 * @param v vector to normalize
 * @param dst optional vector3 to store result
 * @return dst or new Vector3 if not provided
 */
export function normalize(v, dst?: Float32Array): Float32Array {
  dst = dst || new Float32Array(3);
  const l = length(v);
  // make sure we don't divide by 0.
  if (l > 0.00001) {
    dst[0] = v[0] / l;
    dst[1] = v[1] / l;
    dst[2] = v[2] / l;
  }
  return dst;
}

/**
 * Creates a lookAt matrix.
 * This is a world matrix for a camera. In other words it will transform
 * from the origin to a place and orientation in the world. For a view
 * matrix take the inverse of this.
 * @param cameraPosition position of the camera
 * @param target position of the target
 * @param up direction
 * @param [dst] optional matrix to store result
 * @return dst or a new matrix if none provided
 */
export function lookAt(cameraPosition, target, up, dst): Float32Array {
  dst = dst || new Float32Array(16);
  const zAxis = normalize(
    subtractVectors(cameraPosition, target));
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = normalize(cross(zAxis, xAxis));

  dst[ 0] = xAxis[0];
  dst[ 1] = xAxis[1];
  dst[ 2] = xAxis[2];
  dst[ 3] = 0;
  dst[ 4] = yAxis[0];
  dst[ 5] = yAxis[1];
  dst[ 6] = yAxis[2];
  dst[ 7] = 0;
  dst[ 8] = zAxis[0];
  dst[ 9] = zAxis[1];
  dst[10] = zAxis[2];
  dst[11] = 0;
  dst[12] = cameraPosition[0];
  dst[13] = cameraPosition[1];
  dst[14] = cameraPosition[2];
  dst[15] = 1;

  return dst;
}

/**
 * Makes an identity matrix.
 * @param [dst] optional matrix to store result
 * @return dst or a new matrix if none provided
 */
export function identity(dst?: Float32Array): Float32Array {
  dst = dst || new Float32Array(16);

  dst[ 0] = 1;
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = 1;
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = 0;
  dst[10] = 1;
  dst[11] = 0;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = 0;
  dst[15] = 1;

  return dst;
}


/**
 * Computes the dot product of two vectors; assumes both vectors have
 * three entries.
 * @param a Operand vector.
 * @param b Operand vector.
 * @return dot product
 */
export function dot(a: Float32Array, b: Float32Array): number {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
}

/**
 * Computes the length of a vector
 * @param v vector to take length of
 * @return length  of vector
 */
export function length(v: Float32Array): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}


/**
 * Computes the length squared of a vector
 * @param v vector to take length of
 * @return length squared of vector
 */
export function lengthSq(v: Float32Array): number {
  return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}
