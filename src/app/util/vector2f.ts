import { Vector } from './vector';

export class Vector2f extends Vector {

  constructor(x?: number | { x: number; y: number} | number[] | Float32Array, y?: number) {
    super();

    if (x instanceof Float32Array) {
      this.dst = x;
    } else if (Array.isArray(x)) {
      this.dst = new Float32Array(x);
    } else if (typeof x === 'object') {
      this.dst = new Float32Array(2);
      this.dst[0] = x.x;
      this.dst[1] = x.y;
    } else if (typeof x === 'number' && typeof y === 'number') {
      this.dst = new Float32Array(2);
      this.dst[0] = x;
      this.dst[1] = y;
    } else {
      this.dst = new Float32Array(2);
      // todo: I think new Float32Array is initalized with all values at 0.
      this.dst[0] = 0;
      this.dst[1] = 0;
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

  setIdentity(): Vector2f {
    // todo: not sure if {1,0} or {0,1}
    this.dst[ 0] = 0;
    this.dst[ 1] = 1;
    return this;
  }

  setZero(): Vector2f {
    this.setZeros();
    return this;
  }
}
