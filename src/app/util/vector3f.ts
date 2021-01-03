import { addVectors, dot, normalize, subtractVectors } from './webgl-3d-math';

export class Vector3f {
  private dst: Float32Array;

  constructor(x?: number | { x: number, y: number, z: number } | number[] | Float32Array, y?: number, z?: number) {
    if (x instanceof Float32Array) {
      this.dst = x;
    } else if (Array.isArray(x)) {
      this.dst = new Float32Array(x);
    } else if (typeof x === 'object') {
      this.dst = new Float32Array(3);
      this.dst[0] = x.x;
      this.dst[1] = x.y;
      this.dst[2] = x.z;
    } else if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
      this.dst = new Float32Array(3);
      this.dst[0] = x;
      this.dst[1] = y;
      this.dst[2] = z;
    } else {
      this.dst = new Float32Array(3);
      // todo: I think new Float32Array is initalized with all values at 0.
      this.dst[0] = 0;
      this.dst[1] = 0;
      this.dst[2] = 0;
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

  setIdentity(): Vector3f {
    // todo: not sure if {1,0,0} or {0,0,1}
    this.dst[ 0] = 0;
    this.dst[ 1] = 0;
    this.dst[ 2] = 1;
    return this;
  }

  setZero(): Vector3f{
    this.setZeros();
    return this;
  }

  dot(a: Vector3f): number {
    return dot(this.dst, a.get());
  }

  col(index: number): Vector3f {
    return this;
  }

  normalized(): Vector3f {
    return new Vector3f(normalize(this.dst));
  }

  //   Eigen::MatrixXf m(4,4);
  //   m <<  1, 2, 3, 4,
  //   5, 6, 7, 8,
  //   9,10,11,12,
  //   13,14,15,16;
  //   cout << "Block in the middle" << endl;
  //   cout << m.block<2,2>(1,1) << endl << endl;
  //   for (int i = 1; i <= 3; ++i)
  // {
  //   cout << "Block of size " << i << "x" << i << endl;
  //   cout << m.block(0,0,i,i) << endl << endl;
  // }
  block(a, b, c, d): Vector3f {
    return this;
  }

  cwiseAbs(): Vector3f {
    return new Vector3f(
      Math.abs(this.dst[0]),
      Math.abs(this.dst[1]),
      Math.abs(this.dst[2]),
    );
  }

  cwiseMax(value: number): Vector3f {
    return new Vector3f(
      Math.max(this.dst[0]),
      Math.max(this.dst[1]),
      Math.max(this.dst[2]),
    );
  }

  cwiseMin(value: number): Vector3f {
    return new Vector3f(
      Math.min(this.dst[0]),
      Math.min(this.dst[1]),
      Math.min(this.dst[2]),
    );
  }

  max(value: number): number {
    return Math.max(
      this.dst[0],
      this.dst[1],
      this.dst[2],
    );
  }

  cross(a: number): number {
    return 0;
  }

  multiplyMatrix(value: Vector3f): Vector3f {
    const a = this.dst;
    const b = value.get();
    return new Vector3f(
      a[0] * b[0] + a[0] * b[1] + a[0] * b[2],
      a[1] * b[0] + a[1] * b[1] + a[1] * b[2],
      a[2] * b[0] + a[2] * b[1] + a[2] * b[2],
    );
  }

  multiply(value: number): Vector3f {
    const dst = new Float32Array(3);
    for (let i = 0; i < dst.length; i++) {
      dst[i] = this.dst[i] * value;
    }
    return new Vector3f(dst);
  }

  divideMatrix(value: Vector3f): Vector3f {
    const a = this.get();
    const b = value.get();
    return new Vector3f(
      a[0] / b[0] + a[0] / b[1] + a[0] / b[2],
      a[1] / b[0] + a[1] / b[1] + a[1] / b[2],
      a[2] / b[0] + a[2] / b[1] + a[2] / b[2],
    );
  }

  divide(value: number): Vector3f {
    const dst = new Float32Array(3);
    for (let i = 0; i < dst.length; i++) {
      dst[i] = this.dst[i] / value;
    }
    return new Vector3f(dst);
  }

  addMatrix(value: Vector3f): Vector3f {
    return new Vector3f(addVectors(this.dst, value.get()));
  }

  add(value: number): Vector3f {
    const dst = new Float32Array(3);
    for (let i = 0; i < dst.length; i++) {
      dst[i] = this.dst[i] + value;
    }
    return new Vector3f(dst);
  }

  subtractMatrix(value: Vector3f): Vector3f {
    return new Vector3f(subtractVectors(this.dst, value.get()));
  }

  subtract(value: number): Vector3f {
    const dst = new Float32Array(3);
    for (let i = 0; i < dst.length; i++) {
      dst[i] = this.dst[i] - value;
    }
    return new Vector3f(dst);
  }

  get(): Float32Array {
    return this.dst;
  }

  setOnes(): void {
    this.setAllValuesTo(1);
  }

  setZeros(): void {
    this.setAllValuesTo(0);
  }

  setAllValuesTo(a: number): void {
    for (let i = 0; i < this.dst.length; i++) {
      this.dst[i] = a;
    }
  }
}
