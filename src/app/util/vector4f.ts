import { Vector3f } from './vector3f';
import { Vector } from './vector';

export class Vector4f extends Vector {

  constructor(x?: Float32Array | number[]) {
    super();

    if (x instanceof Float32Array) {
      this.dst = x;
    } else if (Array.isArray(x)) {
      this.dst = new Float32Array(x);
    } else {
      this.dst = new Float32Array(4);
    }
  }

  get x(): number {
    return this.dst[0];
  }

  set x(value: number) {
    this.dst[0] = value;
  }

  get y(): number {
    return this.dst[1];
  }

  set y(value: number) {
    this.dst[1] = value;
  }

  get z(): number {
    return this.dst[2];
  }

  set z(value: number) {
    this.dst[2] = value;
  }

  get w(): number {
    return this.dst[3];
  }

  set w(value: number) {
    this.dst[3] = value;
  }

  segment(a, b, c): Vector4f {
    return this;
  }

  cwiseAbs(): Vector4f {
    return this;
  }

  cwiseMin(value: number): Vector4f {
    return this;
  }

  cwiseMax(value: number): Vector4f {
    return this;
  }

  block(a, b, c, d): Vector4f {
    return this;
  }

  block3102(): Vector3f {
    return new Vector3f(
      this.dst[2],
      this.dst[6],
      this.dst[10],
    );
  }

  block3100(): number {
    return this.dst[2];
  }

  multiply(value: number): Vector4f {
    const dst = new Float32Array(4);
    for (let i = 0; i < dst.length; i++) {
      dst[i] = this.dst[i] * value;
    }
    return new Vector4f(dst);
  }

  setVector3f(a: Vector3f): void {
    this.dst[0] = a.x;
    this.dst[1] = a.y;
    this.dst[2] = a.z;
  }

  getVector3f(index: number = 0): Vector3f {
    return new Vector3f(this.dst[index], this.dst[1 + index], this.dst[2 + index]);
  }

  clone(): Vector4f {
    const clone = new Float32Array(4);
    clone[0] = this.dst[0];
    clone[1] = this.dst[1];
    clone[2] = this.dst[2];
    clone[3] = this.dst[3];
    return new Vector4f(clone);
  }


}
