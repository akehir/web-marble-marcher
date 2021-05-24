
export class Vector {
  protected dst: Float32Array;

  constructor() {}

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
