import { identity } from './webgl-3d-math';
import { Vector4f } from './vector4f';
import { Vector3f } from './vector3f';

export class CameraMatrix extends Vector4f {
  constructor() {
    super();
  }

  setCameraPosition(position: Vector3f): void {
    // todo: equivalent to:
    // this.cam_mat.block<3, 1>(0, 3) = this.cam_pos_smooth;
  }

  getCameraY(): number {
    return 0.0;
  }

  getCameraX(): number {
    return 0.0;
  }

  setCameraY(): void {
    // todo
  }

  setCameraX(): void {
    // todo
  }
}
