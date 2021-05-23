// tslint:disable
// c++ code copied -> no linting

import { CameraMatrix, identity, ModPi, normalize } from '../util';
import { all_levels } from '../levels';
import { CamMode, Coordinate, Level } from '../types';
import {
  air_force, air_friction,
  default_zoom, fractal_iters, frame_countdown,
  frame_deorbit, frame_orbit, frame_transition,
  gravity, ground_force, ground_friction, ground_ratio, look_smooth, look_smooth_free_camera, marble_bounce,
  mus_switches,
  num_level_music,
  num_levels,
  num_levels_midpoint,
  num_phys_steps, orbit_smooth, orbit_speed,
  pi, zoom_smooth
} from '../constants';
import { buffer, high_scores, Music } from '../mock';
import { levelToFracParams } from '../util/level-to-frac-params';
import { Program } from '@triangular/shader/lib/common';
import { Vector3f } from '../util/vector3f';




class Scene {



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
  private cam_pos: Vector3f = new Vector3f(); // todo: from matrix //  number[] = [0.0, 0.0, 0.0];
  private cam_pos_smooth: Vector3f = new Vector3f(); // todo: from matrix //  number[] = [0.0, 0.0, 0.0];
  private cam_mode: CamMode = CamMode.INTRO; // todo
  private music: Music;
  private marble_rad = 1.0;
  private flag_pos: Vector3f = new Vector3f(); // todo: from matrix //  number[] = [0.0, 0.0, 0.0];
  private marble_pos: Vector3f = new Vector3f(); // todo: from matrix // number[] = [0.0, 0.0, 0.0];
  private marble_vel: Vector3f = new Vector3f(); // todo: from matrix //  number[] = [0.0, 0.0, 0.0];
  private marble_mat: Vector3f = new Vector3f().setIdentity(); // todo: from matrix //  number[] = [0.0, 0.0, 0.0]; // marble_mat(Eigen::Matrix3f::Identity()),
  private timer = 0;
  private sum_time = 0;
  private cur_level = 0;
  private frac_params: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  private frac_params_smooth: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1];


  // Cheats...
  private enable_cheats = false;
  private free_camera = false;
  private gravity_type = 0;
  private param_mod = -1;
  private ignore_goal = false;
  private hyper_speed = false;
  private disable_motion = false;
  private zoom_to_scale = false;

  private final_time: number;

  private buff_goal = buffer;
  private sound_goal = buffer;
  private buff_bounce1 = buffer;
  private sound_bounce1 = buffer;
  private buff_bounce2 = buffer;
  private sound_bounce2 = buffer;
  private buff_bounce3 = buffer;
  private sound_bounce3 = buffer;
  private buff_shatter = buffer;
  private sound_shatter = buffer;

  private level_copy: Level;

  constructor(music: Music) {

    this.music = music;

    this.ResetCheats();
    this.SnapCamera();

    this.buff_goal.loadFromFile('goal_wav');
    this.sound_goal.setBuffer('buff_goal');
    this.buff_bounce1.loadFromFile('bounce1_wav');
    this.sound_bounce1.setBuffer('buff_bounce1');
    this.buff_bounce2.loadFromFile('bounce2_wav');
    this.sound_bounce2.setBuffer('buff_bounce2');
    this.buff_bounce3.loadFromFile('bounce3_wav');
    this.sound_bounce3.setBuffer('buff_bounce3');
    this.buff_shatter.loadFromFile('shatter_wav');
    this.sound_shatter.setBuffer('buff_shatter');
  }

  SetLevel(level: number) { // todo: custom level object
    this.cur_level = level;
    this.level_copy = all_levels[level];
    this.level_copy.params = levelToFracParams(this.level_copy);
  }

  LoadLevel(level: number) { // todo: custom level object
    this.SetLevel(level);
    this.marble_pos = new Vector3f(this.level_copy.marble.position);
    this.marble_rad = this.level_copy.marble.radius;
    this.flag_pos =  new Vector3f(this.level_copy.flag.position);
    this.cam_look_x = this.level_copy.marble.direction;
  }

  SetMarble(x: number, y: number, z: number, r: number) {
    this.marble_rad = r;
    this.marble_pos = new Vector3f(x, y, z); // = [x, y, z];
    this.marble_vel = new Vector3f(0,0,0); // = [0,0,0];
  }

  SetFlag(x: number, y: number, z: number) {
    this.flag_pos = new Vector3f(x, y, z); // = [x, y, z];
  }

  SetMode(mode: CamMode) {
    // Don't reset the timer if transitioning to screen saver
    if ((this.cam_mode === CamMode.INTRO && mode === CamMode.SCREEN_SAVER) ||
      (this.cam_mode === CamMode.SCREEN_SAVER && mode === CamMode.INTRO)) {
    } else {
      this.timer = 0;
      this.intro_needs_snap = true;
    }
    this.cam_mode = mode;
  }

  GetCountdownTime() {
    if (this.cam_mode === CamMode.DEORBIT && this.timer >= frame_deorbit) {
      return this.timer - frame_deorbit;
    } else if (this.cam_mode === CamMode.MARBLE) {
      return this.timer + 3*60;
    } else if (this.cam_mode === CamMode.GOAL) {
      return this.final_time + 3*60;
    } else {
      return -1;
    }
  }


  GetGoalDirection(): Coordinate {
    const goal_delta: Coordinate = {
      x: this.flag_pos.x - this.marble_pos.x,
      y: 0.0,
      z: this.flag_pos.z - this.marble_pos.z,
    }; //  marble_mat.transpose() * (flag_pos - marble_pos);
    // goal_delta.y = 0.0;
    const goal_dir = Math.atan2(-goal_delta.z, goal_delta.x);
    const a = this.cam_look_x - goal_dir;
    const b = Math.abs(this.cam_look_y * 2.0 / pi);
    // const float d = goal_delta.norm() / this.marble_rad; // todo: verify
    const d =  normalize([goal_delta.x, goal_delta.y, goal_delta.z])[2] / this.marble_rad;

    return {x: a, y: b, z: d};
  }

  GetCurMusic() {
    for (let i = 0; i < num_level_music; ++i) {
      if (this.cur_level < (mus_switches)[i]) {
        return this.music[i];
      }
    }

    return this.music[0];
  }



  StopAllMusic() {
    for (let i = 0; i < num_level_music; ++i) {
      (this.music)[i].stop();
    }
  }

  IsHighScore() {
    if (this.cam_mode !== CamMode.GOAL) {
      return false;
    } else {
      return this.final_time === high_scores.Get(this.cur_level);
    }
  }



  StartNewGame() {
    this.sum_time = 0;
    this.play_single = false;
    this.ResetCheats();
    this.SetLevel(high_scores.GetStartLevel());
    this.is_fullrun = high_scores.HasCompleted(num_levels - 1);
    this.HideObjects();
    this.SetMode(CamMode.ORBIT);
  }


  StartNextLevel() {
    if (this.play_single) {
      this.cam_mode = CamMode.MARBLE;
      this.ResetLevel();
    } else if (this.cur_level + 1 === num_levels_midpoint && this.cam_mode !== CamMode.MIDPOINT) {
      this.cam_mode = CamMode.MIDPOINT;
    } else if (this.cur_level + 1 >= num_levels) {
      this.cam_mode = CamMode.FINAL;
    } else {
      this.SetLevel(this.cur_level + 1);
      this.HideObjects();
      this.SetMode(CamMode.ORBIT);
      for (let i = 0; i < num_level_music; ++i) {
        if (this.cur_level == mus_switches[i]) {
          this.StopAllMusic();
          this.GetCurMusic().play();
        }
      }
    }
  }


  StartSingle(level: number) {
    this.play_single = true;
    this.is_fullrun = false;
    this.ResetCheats();
    this.SetLevel(level);
    this.HideObjects();
    this.SetMode(CamMode.ORBIT);
  }

  ResetLevel(): void {
    if (this.cam_mode === CamMode.MARBLE || this.play_single) {
      this.SetMode(CamMode.DEORBIT);
      this.timer = frame_deorbit;
      this.frac_params = levelToFracParams(this.level_copy);
      this.frac_params_smooth = [...this.frac_params];
      this.marble_pos = new Vector3f(this.level_copy.marble.position);
      this.marble_vel = new Vector3f(); // todo: from matrix //  number[] = [0.0, 0.0, 0.0];
      this.marble_rad = this.level_copy.marble.radius;
      this.marble_mat = new Vector3f(); // todo: from matrix //  number[] = [0.0, 0.0, 0.0];
      this.flag_pos = new Vector3f(this.level_copy.flag.position);
      this.cam_look_x = this.level_copy.marble.direction;
      this.cam_look_x_smooth = this.cam_look_x;
      this.cam_pos = new Vector3f(this.cam_pos_smooth);
      this.cam_dist = default_zoom;
      this.cam_dist_smooth = this.cam_dist;
      this.cam_look_y = -0.3;
      this.cam_look_y_smooth = this.cam_look_y;
    }
  }

  ResetCheats() {
    this.enable_cheats = false;
    this.free_camera = false;
    this.gravity_type = 0;
    this.param_mod = -1;
    this.ignore_goal = false;
    this.hyper_speed = false;
    this.disable_motion = false;
    this.zoom_to_scale = false;
  }

  UpdateCamera(dx: number, dy: number, dz: number, speedup: boolean) {
    //Camera update depends on current mode
    const iters = speedup ? 5 : 1;
    if (this.cam_mode === CamMode.INTRO) {
      this.UpdateIntro(false);
    } else if (this.cam_mode === CamMode.SCREEN_SAVER) {
        this.UpdateIntro(true);
    } else if (this.cam_mode === CamMode.ORBIT) {
      for (let i = 0; i < iters; i++) {
        this.UpdateOrbit();
        if (this.cam_mode !== CamMode.ORBIT) {
          break;
        }
      }
    } else if (this.cam_mode === CamMode.DEORBIT) {
      for (let i = 0; i < iters; i++) {
        this.UpdateDeOrbit(dx, dy, dz);
        if (this.cam_mode !== CamMode.DEORBIT) {
          break;
        }
      }
    } else if (this.cam_mode === CamMode.MARBLE) {
        this.UpdateNormal(dx, dy, dz);
    } else if (this.cam_mode === CamMode.GOAL || this.cam_mode === CamMode.FINAL || this.cam_mode === CamMode.MIDPOINT) {
      for (let i = 0; i < iters; i++) {
        this.UpdateGoal();
        if (this.cam_mode !== CamMode.GOAL) {
          break;
        }
      }
    }
  }


  UpdateMarble(dx: number, dy: number): void {
    //Ignore other modes
    if (this.cam_mode !== CamMode.MARBLE) {
      return;
    }

  //Normalize force if too big
  const mag2 = dx*dx + dy*dy;
  if (mag2 > 1.0) {
    const mag = Math.sqrt(mag2);
    dx /= mag;
    dy /= mag;
  }

  if (this.free_camera) {
    // todo: ... Camera Matrix Multiplication
    // logically speaking, we'd only need to add to 1 vector (either y or x), instead of whatever we're doing here.
    // -> Move this to the cam_mat class / helper functions?!
    // cam_pos += cam_mat.block<3,1>(0,2) * (-marble_rad * dy * 0.5f);
    bla (error to fix todo);
    this.cam_pos = this.cam_pos.addMatrix(this.cam_mat.block3102().multiply(-this.marble_rad * dy * 0.5));
    // cam_pos += cam_mat.block<3, 1>(0,0) * (marble_rad * dx * 0.5f);
    this.cam_pos = this.cam_pos.add(this.cam_mat.block3100() * (this.marble_rad * dx * 0.5) );
    // cam_pos_smooth = cam_pos_smooth*0.8f + cam_pos*0.2f;
    this.cam_pos_smooth = this.cam_pos_smooth.multiply(.8).addMatrix(this.cam_pos.multiply(.2));
  } else {
    //Apply all physics (gravity and collision)
    let onGround = false;
    let max_delta_v = 0.0;
    for (let i = 0; i < num_phys_steps; ++i) {
      let force = this.marble_rad * gravity / num_phys_steps;
      if (this.gravity_type == 1) { force *= 0.25; } else if (this.gravity_type == 2) { force *= 4.0; }
      if (this.level_copy.isPlanet) {
        this.marble_vel = this.marble_vel.subtractMatrix(this.marble_pos.normalized().multiply(force));
      } else {
        this.marble_vel.y -= force;
      }
      this.marble_pos = this.marble_pos.addMatrix(this.marble_vel.divide(num_phys_steps));
      onGround = onGround | this.MarbleCollision(max_delta_v);
    }

    //Play bounce sound if needed
    let bounce_delta_v = max_delta_v / this.marble_rad;
    if (bounce_delta_v > 0.5) {
      this.sound_bounce1.play();
    } else if (bounce_delta_v > 0.25) {
      this.sound_bounce2.play();
    } else if (bounce_delta_v > 0.1) {
      this.sound_bounce3.setVolume(100.0 * (bounce_delta_v / 0.25));
      this.sound_bounce3.play();
    }

    //Add force from keyboard
    let f = this.marble_rad * (onGround ? ground_force : air_force);
    if (this.hyper_speed) { f *= 4.0; }
    const cs = Math.cos(this.cam_look_x);
    const sn = Math.sin(this.cam_look_x);
    const v = new Vector3f(dx*cs - dy*sn, 0.0, -dy*cs - dx*sn);
    this.marble_vel = this.marble_vel.addMatrix(this.marble_mat.multiplyMatrix(v).multiply(f));

    //Apply friction
    this.marble_vel = (onGround ? this.marble_vel.multiply(ground_friction) : this.marble_vel.multiply(air_friction));
  }

  // Update animated fractals
  if (!this.disable_motion) {// todo verify matching of algos
    this.frac_params[1] = this.level_copy.params[1] + this.level_copy.animation.x * Math.sin(this.timer * 0.015);
    this.frac_params[2] = this.level_copy.params[2] + this.level_copy.animation.y * Math.sin(this.timer * 0.015);
    this.frac_params[4] = this.level_copy.params[4] + this.level_copy.animation.z * Math.sin(this.timer * 0.015);
  }
    this.frac_params_smooth = this.frac_params;

    //Check if marble has hit flag post
    // @ts-ignore
    if (this.cam_mode !== CamMode.GOAL && !this.ignore_goal) {
      const flag_y_match = this.level_copy.isPlanet ?
        this.marble_pos.y <= this.flag_pos.y && this.marble_pos.y >= this.flag_pos.y - 7*this.marble_rad :
        this.marble_pos.y >= this.flag_pos.y && this.marble_pos.y <= this.flag_pos.y + 7*this.marble_rad;
      if (flag_y_match) {
        const fx = this.marble_pos.x - this.flag_pos.x;
        const fz = this.marble_pos.z - this.flag_pos.z;
        if (fx*fx + fz*fz < 6 * this.marble_rad*this.marble_rad) {
          this.final_time = this.timer;
          if (!this.enable_cheats) {
            high_scores.Update(this.cur_level, this.final_time);
          }
          this.SetMode(CamMode.GOAL);
          this.sound_goal.play();
        }
      }
    }

    //Check if marble passed the death barrier
    if (this.marble_pos.y < (this.enable_cheats ? -999.0 : this.level_copy.flag.death)) {
      this.ResetLevel();
    }
  }

  UpdateIntro(ssaver: boolean) {
    //Update the timer
    const t = -2.0 + this.timer * 0.002;
    this.timer += 1;

    //Get rotational parameters
    const dist = (ssaver ? 10.0 : 8.0);
    const orbit_pt = new Vector3f(0.0, 3.0, 0.0);
    const perp_vec = new Vector3f(Math.sin(t), 0.0, Math.cos(t));
    this.cam_pos = orbit_pt.addMatrix(perp_vec.multiply(dist));
    this.cam_pos_smooth = this.cam_pos_smooth.multiply(.9).addMatrix(this.cam_pos.multiply(.1));

    //Solve for the look direction
    this.cam_look_x = Math.atan2(perp_vec.x, perp_vec.z);
    if (!ssaver) { this.cam_look_x += 0.5; }
    this.cam_look_x_smooth = ModPi(this.cam_look_x_smooth, this.cam_look_x);
    this.cam_look_x_smooth = this.cam_look_x_smooth*0.9 + this.cam_look_x*0.1;

    //Update look y
    this.cam_look_y = (ssaver ? -0.25 : -0.41);
    this.cam_look_y_smooth = this.cam_look_y_smooth*0.9 + this.cam_look_y*0.1;

    //Update the camera matrix
    this.marble_mat.setIdentity();
    this.MakeCameraRotation();
    // this.cam_mat.block<3, 1>(0, 3) = this.cam_pos_smooth;

    //Update demo fractal
    this.frac_params[0] = 1.6;
    this.frac_params[1] = 2.0 + 0.5*Math.cos(this.timer * 0.0021);
    this.frac_params[2] = pi + 0.5*Math.cos(this.timer * 0.000287);
    this.frac_params[3] = -4.0 + 0.5*Math.sin(this.timer * 0.00161);
    this.frac_params[4] = -1.0 + 0.1*Math.sin(this.timer * 0.00123);
    this.frac_params[5] = -1.0 + 0.1*Math.cos(this.timer * 0.00137);
    this.frac_params[6] = -0.2;
    this.frac_params[7] = -0.1;
    this.frac_params[8] = -0.6;
    this.frac_params_smooth = this.frac_params;

    //Make sure marble and flag are hidden
    this.HideObjects();

    if (this.intro_needs_snap) {
      this.SnapCamera();
      this.intro_needs_snap = false;
    }
  }

  UpdateOrbit() {
    //Update the timer
    const t = this.timer * orbit_speed;
    let a = Math.min(this.timer / frame_transition, 1.0);
    a *= a/(2*a*(a - 1) + 1);
    this.timer += 1;
    this.sum_time += 1;

    //Get marble location and rotational parameters
    const orbit_dist = this.level_copy.marble.orbitDistance;
    const orbit_pt = new Vector3f(0.0, orbit_dist, 0.0);
    const perp_vec = new Vector3f(Math.sin(t), 0.0, Math.cos(t));
    this.cam_pos = orbit_pt.addMatrix(perp_vec.multiply(orbit_dist * 2.5));
    this.cam_pos_smooth = this.cam_pos_smooth.multiply(orbit_smooth).addMatrix(this.cam_pos.multiply(1 - orbit_smooth));

    //Solve for the look direction
    this.cam_look_x = Math.atan2(this.cam_pos_smooth.x, this.cam_pos_smooth.z);
    this.cam_look_x_smooth = ModPi(this.cam_look_x_smooth, this.cam_look_x);
    this.cam_look_x_smooth = this.cam_look_x_smooth*(1 - a) + this.cam_look_x*a;

    //Update look smoothing
    this.cam_look_y = -0.3;
    this.cam_look_y_smooth = this.cam_look_y_smooth*orbit_smooth + this.cam_look_y*(1 - orbit_smooth);

    //Update the camera matrix
    this.marble_mat.setIdentity();
    this.MakeCameraRotation();
    // todo set camera position
    this.cam_mat.block<3, 1>(0, 3) = this.cam_pos_smooth;

    //Update fractal parameters
    this.frac_params[1] = ModPi(this.frac_params[1], this.level_copy.params[1]);
    this.frac_params[2] = ModPi(this.frac_params[2], this.level_copy.params[2]);
    this.frac_params_smooth = this.frac_params * (1.0 - a) + this.level_copy.params * a;

    //When done transitioning display the marble and flag
    if (this.timer >= frame_transition) {
      this.marble_pos = new Vector3f(this.level_copy.marble.position);
      this.marble_rad = this.level_copy.marble.radius;
      this.flag_pos = new Vector3f(this.level_copy.flag.position);
    }

    //When done transitioning, setup level
    if (this.timer >= frame_orbit) {
      this.frac_params = [...this.level_copy.params];
      this.cam_look_x = this.cam_look_x_smooth;
      this.cam_pos = this.cam_pos_smooth;
      this.cam_dist = default_zoom;
      this.cam_dist_smooth = this.cam_dist;
      this.cam_mode = CamMode.DEORBIT;
    }
  }

  UpdateDeOrbit(dx: number, dy: number, dz: number) {
    //Update the timer
    const t = this.timer * orbit_speed;
    let b = Math.min(Math.max(this.timer - frame_orbit, 0) / frame_deorbit - frame_orbit, 1.0);
    b *= b/(2*b*(b - 1) + 1);
    this.timer += 1;
    this.sum_time += 1;

    if (this.timer > frame_deorbit + 1) {
      this.UpdateCameraOnly(dx, dy, dz);
    } else {
      //Get marble location and rotational parameters
      const orbit_dist = this.level_copy.marble.orbitDistance;
      const orbit_pt = new Vector3f(0.0, orbit_dist, 0.0);
      const perp_vec = new Vector3f(Math.sin(t), 0.0, Math.cos(t));
      const orbit_cam_pos = orbit_pt.addMatrix(perp_vec).multiply(orbit_dist * 2.5);
      this.cam_pos = this.cam_pos.multiply(orbit_smooth).addMatrix(orbit_cam_pos.multiply(1 - orbit_smooth));

      //Solve for the look direction
      const start_look_x = this.level_copy.marble.direction;
      this.cam_look_x = Math.atan2(this.cam_pos.x, this.cam_pos.z);
      this.cam_look_x = ModPi(this.cam_look_x, start_look_x);

      //Solve for the look direction
      this.cam_look_x_smooth = this.cam_look_x*(1 - b) + start_look_x*b;

      //Update look smoothing
      this.cam_look_y = -0.3;
      this.cam_look_y_smooth = this.cam_look_y_smooth*orbit_smooth + this.cam_look_y*(1 - orbit_smooth);

      //Update the camera rotation matrix
      this.MakeCameraRotation();

      //Update the camera position
      const marble_cam_pos = this.marble_pos + this.cam_mat.block<3, 3>(0, 0) * (new Vector3f(0.0, 0.0, this.marble_rad * this.cam_dist_smooth));
      marble_cam_pos += new Vector3f(0.0, this.marble_rad * this.cam_dist_smooth * 0.1, 0.0);
      this.cam_pos_smooth = this.cam_pos.multiply(1 - b).addMatrix(marble_cam_pos*b);
      this.cam_mat.block<3, 1>(0, 3) = this.cam_pos_smooth;

      //Required for a smooth transition later on
      this.cam_look_x = this.cam_look_x_smooth;
      this.cam_look_y = this.cam_look_y_smooth;
    }

    //When done deorbiting, transition to play
    if (this.timer > frame_countdown) {
      this.cam_mode = CamMode.MARBLE;
      this.cam_pos = this.cam_pos_smooth;
      this.timer = 0;
    }
  }

  UpdateCameraOnly(dx: number, dy: number, dz: number) {
    //Update camera zoom
    if (this.param_mod >= 0) {
      const new_param = this.level_copy.params[this.param_mod] + dz*0.01;
      this.level_copy.params[this.param_mod] = this.frac_params_smooth[this.param_mod] = this.frac_params[this.param_mod] = new_param;
    } else if (this.zoom_to_scale) {
      this.level_copy.marble.radius *= Math.pow(2.0, -dz);
      this.level_copy.marble.radius = Math.min(Math.max(this.level_copy.marble.radius, 0.0006), 0.6);
      this.marble_rad = this.marble_rad*zoom_smooth + this.level_copy.marble.radius*(1 - zoom_smooth);
    } else {
      this.cam_dist *= Math.pow(2.0, -dz);
      this.cam_dist = Math.min(Math.max(this.cam_dist, 5.0), 30.0);
    }
    this.cam_dist_smooth = this.cam_dist_smooth*zoom_smooth + this.cam_dist*(1 - zoom_smooth);

    // Update look direction
    this.cam_look_x += dx;
    this.cam_look_y += dy;
    this.cam_look_y = Math.min(Math.max(this.cam_look_y, -pi / 2), pi / 2);
    while (this.cam_look_x > pi) { this.cam_look_x -= 2 * pi; }
    while (this.cam_look_x < -pi) { this.cam_look_x += 2 * pi; }

    // Update look smoothing
    const a = (this.free_camera ? look_smooth_free_camera : look_smooth);
    this.cam_look_x_smooth = ModPi(this.cam_look_x_smooth, this.cam_look_x);
    this.cam_look_x_smooth = this.cam_look_x_smooth * a + this.cam_look_x * (1 - a);
    this.cam_look_y_smooth = this.cam_look_y_smooth * a + this.cam_look_y * (1 - a);

    //Setup rotation matrix for planets
    if (this.level_copy.isPlanet) {
      this.marble_mat.col(1) = this.marble_pos.normalized();
      this.marble_mat.col(2) = -this.marble_mat.col(1).cross(this.marble_mat.col(0)).normalized();
      this.marble_mat.col(0) = -this.marble_mat.col(2).cross(this.marble_mat.col(1)).normalized();
    } else {
      this.marble_mat.setIdentity();
    }

    //Update the camera matrix
    this.MakeCameraRotation();
    if (!this.free_camera) {
      this.cam_pos = this.marble_pos + this.cam_mat.block<3, 3>(0, 0) * Vector3f(0.0, 0.0, this.marble_rad * this.cam_dist_smooth);
      this.cam_pos += this.marble_mat.col(1) * (this.marble_rad * this.cam_dist_smooth * 0.1);
      this.cam_pos_smooth = this.cam_pos;
    }
    this.cam_mat.block<3, 1>(0, 3) = this.cam_pos_smooth;
  }

  UpdateNormal(dx: number, dy: number, dz: number) {
    //Update camera
    this.UpdateCameraOnly(dx, dy, dz);

    //Update timer
    this.timer += 1;
    this.sum_time += 1;
  }

  UpdateGoal() {
    //Update the timer
    const t = this.timer * 0.01;
    let a = Math.min(t / 75.0, 1.0);
    this.timer += 1;
    if (this.cur_level !== num_levels_midpoint - 1 && this.cur_level !== num_levels - 1) {
      this.sum_time += 1;
    }

    //Get marble location and rotational parameters
    const flag_dist = this.marble_rad * 6.5;
    const Eigen::Vector3f orbit_pt = this.flag_pos + this.marble_mat * Eigen::Vector3f(0.0, this.flag_dist, 0.0);
    const Eigen::Vector3f perp_vec = Eigen::Vector3f(Math.sin(t), 0.0, Math.cos(t));
    this.cam_pos = orbit_pt + this.marble_mat * perp_vec * (this.flag_dist * 3.5);
    this.cam_pos_smooth = this.cam_pos_smooth*(1 - a) + this.cam_pos*a;

    //Solve for the look direction
    this.cam_look_x = Math.atan2(perp_vec.x, perp_vec.z);
    this.cam_look_x_smooth = ModPi(this.cam_look_x_smooth, this.cam_look_x);
    this.cam_look_x_smooth = this.cam_look_x_smooth*(1 - a) + this.cam_look_x*a;

    //Update look smoothing
    this.cam_look_y = -0.25;
    this.cam_look_y_smooth = this.cam_look_y_smooth*0.99 + this.cam_look_y*(1 - 0.99);

    //Update the camera matrix
    this.MakeCameraRotation();
    this.cam_mat.block<3, 1>(0, 3) = this.cam_pos_smooth;

    //Animate marble
    this.marble_vel += (orbit_pt - marble_pos) * 0.005;
    this.marble_pos += this.marble_vel;
    if (this.marble_vel.norm() > this.marble_rad*0.02) {
      this.marble_vel *= 0.95;
    }

    if (this.timer > 300 && this.cam_mode !== CamMode.FINAL && this.cam_mode !== CamMode.MIDPOINT) {
      this.StartNextLevel();
    }
  }

  MakeCameraRotation(): void {
    this.cam_mat.setIdentity();
    const Eigen::AngleAxisf aa_x_smooth(this.cam_look_x_smooth, Eigen::Vector3f::UnitY());
    const Eigen::AngleAxisf aa_y_smooth(this.cam_look_y_smooth, Eigen::Vector3f::UnitX());
    this.cam_mat.block<3, 3>(0, 0) = marble_mat * (aa_x_smooth * aa_y_smooth).toRotationMatrix();
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

  Write(program: Program): void {
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

    // todo: camera matrix
    //   shader.setUniform("iMat", sf::Glsl::Mat4(cam_mat.data()));
    //


    if (this.free_camera) {
      program.gl.uniform3f(iMarblePos, 999.0, 999.0, 999.0);
      program.gl.uniform3f(iFlagPos, -999.0, -999.0, -999.0);
    } else {
      program.gl.uniform3f(iMarblePos, this.marble_pos.x, this.marble_pos.y, this.marble_pos.z);
      program.gl.uniform3f(iFlagPos, this.flag_pos.x, this.flag_pos.y, this.flag_pos.z);
    }

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

  DE(pt: Vector3f): number {
    //Easier to work with names
    const frac_scale = this.frac_params_smooth[0];
    const frac_angle1 = this.frac_params_smooth[1];
    const frac_angle2 = this.frac_params_smooth[2];
    const Eigen::Vector3f frac_shift = this.frac_params_smooth.segment<3>(3);
    const Eigen::Vector3f frac_color = this.frac_params_smooth.segment<3>(6);

    Eigen::Vector4f p;
    p << pt, 1.0f;
    for (let i = 0; i < fractal_iters; ++i) {
      //absFold
      p.segment<3>(0) = p.segment<3>(0).cwiseAbs();
      //rotZ
      const float rotz_c = Math.cos(frac_angle1);
      const float rotz_s = Math.sin(frac_angle1);
      const float rotz_x = rotz_c*p.x() + rotz_s*p.y();
      const float rotz_y = rotz_c*p.y() - rotz_s*p.x();
      p.x() = rotz_x; p.y() = rotz_y;
      //mengerFold
      float a = Math.min(p.x() - p.y(), 0.0f);
      p.x() -= a; p.y() += a;
      a = Math.min(p.x() - p.z(), 0.0f);
      p.x() -= a; p.z() += a;
      a = Math.min(p.y() - p.z(), 0.0f);
      p.y() -= a; p.z() += a;
      //rotX
      const float rotx_c = Math.cos(frac_angle2);
      const float rotx_s = Math.sin(frac_angle2);
      const float rotx_y = rotx_c*p.y() + rotx_s*p.z();
      const float rotx_z = rotx_c*p.z() - rotx_s*p.y();
      p.y() = rotx_y; p.z() = rotx_z;
      //scaleTrans
      p *= frac_scale;
      p.segment<3>(0) += frac_shift;
    }
    const Eigen::Vector3f a = p.segment<3>(0).cwiseAbs() - Eigen::Vector3f(6.0f, 6.0f, 6.0f);
    return (Math.min(Math.max(Math.max(a.x(), a.y()), a.z()), 0.0f) + a.cwiseMax(0.0f).norm()) / p.w();
  }

  NP(pt: Vector3f): Vector3f {
    //Easier to work with names
    const frac_scale = this.frac_params_smooth[0];
    const frac_angle1 = this.frac_params_smooth[1];
    const frac_angle2 = this.frac_params_smooth[2];
    const Eigen::Vector3f frac_shift = this.frac_params_smooth.segment<3>(3);
    const Eigen::Vector3f frac_color = this.frac_params_smooth.segment<3>(6);

  static std::vector<Eigen::Vector4f, Eigen::aligned_allocator<Eigen::Vector4f>> p_hist;
    p_hist.clear();
    Eigen::Vector4f p;
    p << pt, 1.0f;
  //Fold the point, keeping history
    for (let i = 0; i < fractal_iters; ++i) {
      //absFold
      p_hist.push_back(p);
      p.segment<3>(0) = p.segment<3>(0).cwiseAbs();
      //rotZ
      const float rotz_c = Math.cos(frac_angle1);
      const float rotz_s = Math.sin(frac_angle1);
      const float rotz_x = rotz_c*p.x() + rotz_s*p.y();
      const float rotz_y = rotz_c*p.y() - rotz_s*p.x();
      p.x() = rotz_x; p.y() = rotz_y;
      //mengerFold
      p_hist.push_back(p);
      float a = Math.min(p.x() - p.y(), 0.0f);
      p.x() -= a; p.y() += a;
      a = Math.min(p.x() - p.z(), 0.0f);
      p.x() -= a; p.z() += a;
      a = Math.min(p.y() - p.z(), 0.0f);
      p.y() -= a; p.z() += a;
      //rotX
      const float rotx_c = Math.cos(frac_angle2);
      const float rotx_s = Math.sin(frac_angle2);
      const float rotx_y = rotx_c*p.y() + rotx_s*p.z();
      const float rotx_z = rotx_c*p.z() - rotx_s*p.y();
      p.y() = rotx_y; p.z() = rotx_z;
      //scaleTrans
      p *= frac_scale;
      p.segment<3>(0) += frac_shift;
    }
    //Get the nearest point
    Eigen::Vector3f n = p.segment<3>(0).cwiseMax(-6.0).cwiseMin(6.0);
    //Then unfold the nearest point (reverse order)
    for (let i = 0; i < fractal_iters; ++i) {
      //scaleTrans
      n.segment<3>(0) -= frac_shift;
      n /= frac_scale;
      //rotX
      const float rotx_c = Math.cos(-frac_angle2);
      const float rotx_s = Math.sin(-frac_angle2);
      const float rotx_y = rotx_c*n.y() + rotx_s*n.z();
      const float rotx_z = rotx_c*n.z() - rotx_s*n.y();
      n.y() = rotx_y; n.z() = rotx_z;
      //mengerUnfold
      p = p_hist.back(); p_hist.pop_back();
      const float mx = Math.max(p[0], p[1]);
      if (Math.min(p[0], p[1]) < Math.min(mx, p[2])) {
        Math.swap(n[1], n[2]);
      }
      if (mx < p[2]) {
        Math.swap(n[0], n[2]);
      }
      if (p[0] < p[1]) {
        Math.swap(n[0], n[1]);
      }
      //rotZ
      const float rotz_c = Math.cos(-frac_angle1);
      const float rotz_s = Math.sin(-frac_angle1);
      const float rotz_x = rotz_c*n.x() + rotz_s*n.y();
      const float rotz_y = rotz_c*n.y() - rotz_s*n.x();
      n.x() = rotz_x; n.y() = rotz_y;
      //absUnfold
      p = p_hist.back(); p_hist.pop_back();
      if (p[0] < 0.0f) {
        n[0] = -n[0];
      }
      if (p[1] < 0.0f) {
        n[1] = -n[1];
      }
      if (p[2] < 0.0f) {
        n[2] = -n[2];
      }
    }
    return n;
  }

  MarbleCollision(delta_v: number): boolean {
    //Check if the distance estimate indicates a collision
    const de = this.DE(this.marble_pos);
    if (de >= this.marble_rad) {
      return de < marble_rad * ground_ratio;
    }

    //Check if the marble has been crushed by the fractal
    if (de < this.marble_rad * 0.001) {
      this.sound_shatter.play();
      this.marble_pos.y = -9999.0;
      return false;
    }

    //Find the nearest point and compute offset
    const Eigen::Vector3f np = NP(marble_pos);
    const Eigen::Vector3f d = np - marble_pos;
    const Eigen::Vector3f dn = d.normalized();

    //Apply the offset to the marble's position and velocity
    const dv = this.marble_vel.dot(dn);
    delta_v = Math.max(delta_v, dv);
    this.marble_pos -= dn * this.marble_rad - d;
    this.marble_vel -= dn * (dv * marble_bounce);
    return true;
  }

}



void Scene::Cheat_ColorChange() {
  if (!enable_cheats) { return; }
  level_copy.params[6] = frac_params_smooth[6] = frac_params[6] = float((rand() % 201) - 100) * 0.01f;
  level_copy.params[7] = frac_params_smooth[7] = frac_params[7] = float((rand() % 201) - 100) * 0.01f;
  level_copy.params[8] = frac_params_smooth[8] = frac_params[8] = float((rand() % 201) - 100) * 0.01f;
}
void Scene::Cheat_FreeCamera() {
  if (!enable_cheats) { return; }
  free_camera = !free_camera;
}
void Scene::Cheat_Gravity() {
  if (!enable_cheats) { return; }
  gravity_type = (gravity_type + 1) % 3;
}
void Scene::Cheat_HyperSpeed() {
  if (!enable_cheats) { return; }
  hyper_speed = !hyper_speed;
}
void Scene::Cheat_IgnoreGoal() {
  if (!enable_cheats) { return; }
  ignore_goal = !ignore_goal;
}
void Scene::Cheat_Motion() {
  if (!enable_cheats) { return; }
  disable_motion = !disable_motion;
}
void Scene::Cheat_Planet() {
  if (!enable_cheats) { return; }
  level_copy.planet = !level_copy.planet;
}
void Scene::Cheat_Zoom() {
  if (!enable_cheats) { return; }
  zoom_to_scale = !zoom_to_scale;
}
void Scene::Cheat_Param(int param) {
  if (!enable_cheats) { return; }
  param_mod = param;
}

