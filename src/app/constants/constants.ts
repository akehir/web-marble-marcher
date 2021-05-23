import { all_levels } from '../levels';

export const pi = 3.14159265359;
export const ground_force = 0.008;
export const air_force = 0.004;
export const ground_friction = 0.99;
export const air_friction = 0.995;
export const orbit_speed = 0.005;
export const max_marches = 10;
export const num_phys_steps = 1;
export const marble_bounce = 1.2; // Range 1.0 to 2.0
export const orbit_smooth = 0.995;
export const zoom_smooth = 0.85;
export const look_smooth = 0.75;
export const look_smooth_free_camera = 0.9;
export const frame_transition = 400;
export const frame_orbit = 600;
export const frame_deorbit = 800;
export const frame_countdown = frame_deorbit + 3 * 60;
export const default_zoom = 0.5;
export const max_zoom = 7.0;
export const min_zoom = 0.05;
export const fractal_iters = 16;
export const gravity = 0.005;
export const ground_ratio = 1.15;
export const num_levels_midpoint = 15;

// Constants
export const mouse_sensitivity = 0.001;
// export const wheel_sensitivity = 0.2;
export const wheel_sensitivity = 0.005;
export const music_vol = 75.0;
export const target_fps = 60.0;


// Mocks
export const num_levels = all_levels.length;
export const num_level_music = 4;
export const mus_switches = [9, 15, 21, 24];

export const resolution = {x: 1024, y: 768};
export const screen_size = {x: 1024, y: 768};

export const screen_center = {x: resolution.x / 2, y: resolution.y / 2};

export const fullscreen = false;

