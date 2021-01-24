import { CameraMatrix, identity, lookAt, Vector3f, Vector4f } from '../util';
import {
  air_force,
  air_friction,
  default_zoom,
  fractal_iters,
  frame_deorbit,
  gravity,
  ground_force,
  ground_friction,
  ground_ratio,
  marble_bounce,
  mouse_sensitivity,
  num_phys_steps,
  screen_center,
  wheel_sensitivity
} from '../constants';
import { CamMode, Level } from '../types';
import { sf, } from '../mock';
import { Program } from '@triangular/shader/lib/common';
import { levelToFracParams } from '../util/level-to-frac-params';

export class Scene2 {
  private readonly program: Program;
  private intro_needs_snap = true;
  private play_single = false;
  private is_fullrun = false;
  private exposure = 1.0;
  private cam_mat: CameraMatrix = new CameraMatrix();
  private cam_look_x = 0.0;
  private cam_look_x_smooth = 0.0;
  private cam_look_y = 0.0;
  private cam_look_y_smooth = 0.0;
  private cam_dist = default_zoom;
  private cam_dist_smooth = default_zoom;
  private cam_pos: Vector3f = new Vector3f();
  private cam_pos_smooth: Vector3f = new Vector3f();
  private cam_mode: CamMode = CamMode.INTRO;
  private marble_rad = 1.0;
  private flag_pos: Vector3f = new Vector3f();
  private marble_pos: Vector3f = new Vector3f();
  private marble_vel: Vector3f = new Vector3f();
  private marble_mat: Vector3f = new Vector3f().setIdentity();
  private timer = 0;
  private sum_time = 0;
  private cur_level: Level;
  private frac_params: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  private frac_params_smooth: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  private all_keys: { [key: string]: boolean } = {};
  private free_camera = false;
  private disable_motion = true;

  private frac_scale = 0;
  private frac_angle1 = 0;
  private frac_angle2 = 0;
  private frac_shift = new Vector3f();
  private frac_color = new Vector3f();
  private frac_collision_factor = new Vector3f(6.0, 6.0, 6.0);
  private u_viewInverse = identity();
  private u_viewUp = [0, 1, 0];

  private final_time: number;

  private level_copy: Level;

  constructor(
    program: Program,
  ) {
    this.program = program;
    this.SnapCamera();
  }

  private keyUpListener: (e: KeyboardEvent) => void = (event) => {
    this.all_keys[event.code] = false;
  }

  private keyDownListener: (e: KeyboardEvent) => void = (event) => {
    this.all_keys[event.code] = true;
  }

  private mouseMove: (e: MouseEvent) => void = (event) => {
  }

  SnapCamera(): void {
    this.cam_look_x_smooth = this.cam_look_x;
    this.cam_look_y_smooth = this.cam_look_y;
    this.cam_dist_smooth = this.cam_dist;
    this.cam_pos_smooth = this.cam_pos;
  }

  HideObjects(): void {
    this.marble_pos = new Vector3f(999.0, 999.0, 999.0);
    this.flag_pos = new Vector3f(999.0, 999.0, 999.0);
    this.marble_vel.setZero();
  }

  AddEventListeners(): void {
    window.addEventListener('keydown', this.keyDownListener);
    window.addEventListener('keyup', this.keyUpListener);
    window.addEventListener('mousemove', this.mouseMove);
  }

  RemoveEventListeners(): void {
    window.removeEventListener('keyup', this.keyUpListener);
    window.removeEventListener('keyup', this.keyUpListener);
    window.removeEventListener('mousemove', this.mouseMove);
  }

  Step(dt: number): void {
    // Collect keyboard input

    const force_lr =
      (this.all_keys[sf.Keyboard.Left] || this.all_keys[sf.Keyboard.A] ? -1.0 : 0.0) +
      (this.all_keys[sf.Keyboard.Right] || this.all_keys[sf.Keyboard.D] ? 1.0 : 0.0);

    const force_ud =
      (this.all_keys[sf.Keyboard.Down] || this.all_keys[sf.Keyboard.S] ? -1.0 : 0.0) +
      (this.all_keys[sf.Keyboard.Up] || this.all_keys[sf.Keyboard.W] ? 1.0 : 0.0);

    // Collect mouse input
    // const mouse_delta = {x: mouse_pos.x - screen_center.x, y: mouse_pos.y - screen_center.y};
    // sf.Mouse.setPosition(screen_center);

    // const cam_lr = -mouse_delta.x * mouse_sensitivity;
    // const cam_ud = -mouse_delta.y * mouse_sensitivity;
    // const cam_z = mouse_wheel * wheel_sensitivity;

    // Apply forces to marble and camera
    this.UpdateMarble(force_lr, force_ud);
    // this.UpdateCamera(cam_lr, cam_ud, cam_z, mouse_clicked);

    // Update the shader values
    this.Write();
  }

  SetLevel(level: Level): void { // todo: custom level object
    this.cur_level = level;
    this.level_copy = {...level};
    this.level_copy.params = levelToFracParams(this.level_copy);
  }

  LoadLevel(level: Level): void { // todo: custom level object
    this.SetLevel(level);
    this.marble_pos = new Vector3f(this.level_copy.marble.position);
    this.marble_rad = this.level_copy.marble.radius;
    this.marble_vel = new Vector3f();
    this.flag_pos =  new Vector3f(this.level_copy.flag.position);
    this.cam_look_x = this.level_copy.marble.direction;
    this.ResetLevel();
  }

  SetMarble(x: number, y: number, z: number, r: number): void {
    this.marble_rad = r;
    this.marble_pos = new Vector3f(x, y, z); // = [x, y, z];
    this.marble_vel = new Vector3f(); // = [0,0,0];
  }

  SetFlag(x: number, y: number, z: number): void {
    this.flag_pos = new Vector3f(x, y, z); // = [x, y, z];
  }

  ResetLevel(): void {
    this.timer = frame_deorbit;
    this.frac_params = levelToFracParams(this.level_copy);
    this.frac_params_smooth = [...this.frac_params];
    this.marble_pos = new Vector3f(this.level_copy.marble.position);
    this.marble_vel = new Vector3f();
    this.marble_rad = this.level_copy.marble.radius;
    this.marble_mat = new Vector3f(1, 1, 1) ;
    this.flag_pos = new Vector3f(this.level_copy.flag.position);
    this.cam_look_x = this.level_copy.marble.direction;
    this.cam_look_x_smooth = this.cam_look_x;
    this.cam_pos = new Vector3f(this.cam_pos_smooth);
    this.cam_dist = default_zoom;
    this.cam_dist_smooth = this.cam_dist;
    this.cam_look_y = -0.3;
    this.cam_look_y_smooth = this.cam_look_y;

    this.frac_scale = this.frac_params_smooth[0];
    this.frac_angle1 = this.frac_params_smooth[1];
    this.frac_angle2 = this.frac_params_smooth[2];
    this.frac_shift = new Vector3f(this.level_copy.offset);
    this.frac_color = new Vector3f(this.level_copy.color);
  }

  UpdateMarble(dx: number, dy: number): void {
    // Normalize force if too big
    const mag2 = dx * dx + dy * dy;
    if (mag2 > 1.0) {
      const mag = Math.sqrt(mag2);
      dx /= mag;
      dy /= mag;
    }

    // Apply all physics (gravity and collision)
    let onGround = false;
    const max_delta_v = 0.0;
    for (let i = 0; i < num_phys_steps; ++i) {
      const force = this.marble_rad * gravity / num_phys_steps;

      if (this.level_copy.isPlanet) {
        this.marble_vel = this.marble_vel.subtractMatrix(this.marble_pos.normalized().multiply(force));
      } else {
        this.marble_vel.y -= force;
      }
      this.marble_pos = this.marble_pos.addMatrix(this.marble_vel.divide(num_phys_steps));
      onGround = onGround || this.MarbleCollision(max_delta_v);
    }

    // Add force from keyboard
    const f = this.marble_rad * (onGround ? ground_force : air_force);
    const cs = Math.cos(this.cam_look_x);
    const sn = Math.sin(this.cam_look_x);
    const v = new Vector3f(dx * cs - dy * sn, 0.0, -dy * cs - dx * sn);
    // const v = new Vector3f(1, 1, 1);
    this.marble_vel = this.marble_vel.addMatrix(v.multiply(f));
    // this.marble_vel = this.marble_vel.addMatrix(v);

    // Apply friction
    this.marble_vel = (onGround ? this.marble_vel.multiply(ground_friction) : this.marble_vel.multiply(air_friction));

    // Update animated fractals
    // if (!this.disable_motion) {// todo verify matching of algos
    //   this.frac_params[1] = this.level_copy.params[1] + this.level_copy.animation.x * Math.sin(this.timer * 0.015);
    //   this.frac_params[2] = this.level_copy.params[2] + this.level_copy.animation.y * Math.sin(this.timer * 0.015);
    //   this.frac_params[4] = this.level_copy.params[4] + this.level_copy.animation.z * Math.sin(this.timer * 0.015);
    // }
    this.frac_params_smooth = this.frac_params;

    // Check if marble has hit flag post
    const flag_y_match = this.level_copy.isPlanet ?
      this.marble_pos.y <= this.flag_pos.y && this.marble_pos.y >= this.flag_pos.y - 7 * this.marble_rad :
      this.marble_pos.y >= this.flag_pos.y && this.marble_pos.y <= this.flag_pos.y + 7 * this.marble_rad;
    if (flag_y_match) {
      const fx = this.marble_pos.x - this.flag_pos.x;
      const fz = this.marble_pos.z - this.flag_pos.z;
      if (fx * fx + fz * fz < 6 * this.marble_rad * this.marble_rad) {
        this.final_time = this.timer;
      }
    }

    // Check if marble passed the death barrier
    if (this.marble_pos.y < this.level_copy.flag.death) {
      this.ResetLevel();
    }
  }

  Write(program: Program = this.program): void {
    const iMat = program.gl.getUniformLocation(program.program, 'iMat');

    const iFracScale = program.gl.getUniformLocation(program.program, 'iFracScale');
    const iFracAng1 = program.gl.getUniformLocation(program.program, 'iFracAng1');
    const iFracAng2 = program.gl.getUniformLocation(program.program, 'iFracAng2');
    const iFracShift = program.gl.getUniformLocation(program.program, 'iFracShift');
    const iFracCol = program.gl.getUniformLocation(program.program, 'iFracCol');
    const iMarblePos = program.gl.getUniformLocation(program.program, 'iMarblePos');
    const iMarbleRad = program.gl.getUniformLocation(program.program, 'iMarbleRad');
    const iFlagScale = program.gl.getUniformLocation(program.program, 'iFlagScale');
    const iFlagPos = program.gl.getUniformLocation(program.program, 'iFlagPos');
    const iExposure = program.gl.getUniformLocation(program.program, 'iExposure');

    // before setting any uniforms, we need to bind the program.
    program.bind();
    const camPos = this.marble_pos.subtract(.5).get();
    camPos[1] = camPos[1] + .5;
    camPos[2] = camPos[2] + .25;

    const cameraMatrix = lookAt(camPos, this.marble_pos.get(), this.u_viewUp, this.u_viewInverse);

    program.gl.uniformMatrix4fv(iMat, false, cameraMatrix);

    // if (this.free_camera) {
    //   program.gl.uniform3f(iMarblePos, 999.0, 999.0, 999.0);
    //   program.gl.uniform3f(iFlagPos, -999.0, -999.0, -999.0);
    // } else {
    program.gl.uniform3f(iMarblePos, this.marble_pos.x, this.marble_pos.y, this.marble_pos.z);
    program.gl.uniform3f(iFlagPos, this.flag_pos.x, this.flag_pos.y, this.flag_pos.z);
    // }

    program.gl.uniform1f(iMarbleRad, this.marble_rad);

    program.gl.uniform1f(iFlagScale, this.level_copy.isPlanet ? -this.marble_rad : this.marble_rad);
    // if planet -> Minus
    program.gl.uniform1f(iFracScale, this.frac_params_smooth[0]);
    program.gl.uniform1f(iFracAng1, this.frac_params_smooth[1]);
    program.gl.uniform1f(iFracAng2, this.frac_params_smooth[2]);

    program.gl.uniform3f(iFracShift, this.frac_params_smooth[3], this.frac_params_smooth[4], this.frac_params_smooth[5]);
    program.gl.uniform3f(iFracCol, this.frac_params_smooth[6], this.frac_params_smooth[7], this.frac_params_smooth[8]);

    program.gl.uniform1f(iExposure, this.exposure);
  }


  MarbleCollision(delta_v: number): boolean { // todo: cpp code has pass by ref here...
    // Check if the distance estimate indicates a collision
    const de = this.DE(this.marble_pos);
    if (de >= this.marble_rad) {
      return de < this.marble_rad * ground_ratio;
    }

    // Check if the marble has been crushed by the fractal
    if (de < this.marble_rad * 0.001) {
      this.marble_pos.y = -9999.0;
      return false;
    }

    // Find the nearest point and compute offset
    const np = this.NP(this.marble_pos);
    const d = np.subtractMatrix(this.marble_pos);
    const dn = d.normalized();

    // Apply the offset to the marble's position and velocity
    const dv = this.marble_vel.dot(dn);
    delta_v = Math.max(delta_v, dv); // todo: ref passed number is updated here in cpp
    this.marble_pos = this.marble_pos.subtractMatrix(dn.multiply(this.marble_rad).subtractMatrix(d));
    this.marble_vel = this.marble_vel.subtractMatrix(dn.multiply(dv * marble_bounce));
    return true;
  }

  DE(pt: Vector3f): number {

    let p: Vector4f = new Vector4f();
    p.setOnes();
    p.setVector3f(pt); // p << pt, 1.0; // todo: not sure what this does

    for (let i = 0; i < fractal_iters; ++i) {
      // absFold
      // p.segment<3>(0) = p.segment<3>(0).cwiseAbs();
      p.setVector3f(p.getVector3f().cwiseAbs());

      // rotZ
      const rotz_c = Math.cos(this.frac_angle1);
      const rotz_s = Math.sin(this.frac_angle1);
      const rotz_x = rotz_c * p.x + rotz_s * p.y;
      const rotz_y = rotz_c * p.y - rotz_s * p.x;
      p.x = rotz_x;
      p.y = rotz_y;

      // mengerFold
      let a = Math.min(p.x - p.y, 0.0);
      p.x -= a;
      p.y += a;

      a = Math.min(p.x - p.z, 0.0);
      p.x -= a;
      p.z += a;

      a = Math.min(p.y - p.z, 0.0);
      p.y -= a;
      p.z += a;

      // rotX
      const rotx_c = Math.cos(this.frac_angle2);
      const rotx_s = Math.sin(this.frac_angle2);
      const rotx_y = rotx_c * p.y + rotx_s * p.z;
      const rotx_z = rotx_c * p.z - rotx_s * p.y;
      p.y = rotx_y;
      p.z = rotx_z;

      // scaleTrans
      p = p.multiply(this.frac_scale);
      // p.segment<3>(0) += this.frac_shift;
      p.setVector3f(p.getVector3f().addMatrix(this.frac_shift));
    }

    // const Eigen::Vector3f a = p.segment<3>(0).cwiseAbs() - Eigen::Vector3f(6.0f, 6.0f, 6.0f);
    const b = p.getVector3f().cwiseAbs().subtractMatrix(this.frac_collision_factor);
    // return (std::min(std::max(std::max(a.x(), a.y()), a.z()), 0.0f) + a.cwiseMax(0.0f).norm()) / p.w();
    return (Math.min(Math.max(b.x, b.y, b.z), 0.0) + b.cwiseMax(new Vector3f()).length()) / p.w;
  }

  NP(pt: Vector3f): Vector3f {
    const p_hist: Vector4f[] = [];

    let p: Vector4f = new Vector4f();
    p.setOnes();
    p.setVector3f(pt); // p << pt, 1.0; // todo: not sure what this does
    // Fold the point, keeping history
    for (let i = 0; i < fractal_iters; ++i) {
      // absFold
      p_hist.push(p.clone());
      // p.segment<3>(0) = p.segment<3>(0).cwiseAbs();
      p.setVector3f(p.getVector3f().cwiseAbs());
      // rotZ
      const rotz_c = Math.cos(this.frac_angle1);
      const rotz_s = Math.sin(this.frac_angle1);
      const rotz_x = rotz_c * p.x + rotz_s * p.y;
      const rotz_y = rotz_c * p.y - rotz_s * p.x;
      p.x = rotz_x;
      p.y = rotz_y;

      // mengerFold
      p_hist.push(p.clone());

      let a = Math.min(p.x - p.y, 0.0);
      p.x -= a;
      p.y += a;

      a = Math.min(p.x - p.z, 0.0);
      p.x -= a;
      p.z += a;

      a = Math.min(p.y - p.z, 0.0);
      p.y -= a;
      p.z += a;

      // rotX
      const rotx_c = Math.cos(this.frac_angle2);
      const rotx_s = Math.sin(this.frac_angle2);
      const rotx_y = rotx_c * p.y + rotx_s * p.z;
      const rotx_z = rotx_c * p.z - rotx_s * p.y;
      p.y = rotx_y;
      p.z = rotx_z;

      // scaleTrans
      p = p.multiply(this.frac_scale);
      p.setVector3f(p.getVector3f().addMatrix(this.frac_shift));
    }

    // Get the nearest point
    let n = p.getVector3f().cwiseMax(new Vector3f(-6.0, -6.0, -6.0)).cwiseMin(new Vector3f(6.0, 6.0, 6.0));
    // Then unfold the nearest point (reverse order)
    for (let i = 0; i < fractal_iters; ++i) {
      // scaleTrans
      // n.segment<3>(0) -= frac_shift;
      n = n.subtractMatrix(this.frac_shift);
      n = n.divide(this.frac_scale);

      // rotX
      const rotx_c = Math.cos(-this.frac_angle2);
      const rotx_s = Math.sin(-this.frac_angle2);
      const rotx_y = rotx_c * n.y + rotx_s * n.z;
      const rotx_z = rotx_c * n.z - rotx_s * n.y;
      n.y = rotx_y;
      n.z = rotx_z;

      // mengerUnfold
      p = p_hist.pop();
      const mx = Math.max(p.x, p.y);

      if (Math.min(p.x, p.y) < Math.min(mx, p.z)) {
        const tmp = n.y;
        n.y = n.z;
        n.z = tmp;
      }

      if (mx < p.z) {
        const tmp = n.x;
        n.x = n.z;
        n.z = tmp;
      }

      if (p.x < p.y) {
        const tmp = n.x;
        n.x = n.y;
        n.y = tmp;
      }

      // rotZ
      const rotz_c = Math.cos(-this.frac_angle1);
      const rotz_s = Math.sin(-this.frac_angle1);
      const rotz_x = rotz_c * n.x + rotz_s * n.y;
      const rotz_y = rotz_c * n.y - rotz_s * n.x;
      n.x = rotz_x;
      n.y = rotz_y;

      // absUnfold
      p = p_hist.pop();

      if (p.x < 0.0) {
        n.x = -n.x;
      }

      if (p.y < 0.0) {
        n.y = -n.y;
      }

      if (p.z < 0.0) {
        n.z = -n.z;
      }
    }

    return n;
  }

}

