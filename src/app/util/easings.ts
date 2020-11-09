export function easeOutCubic(t: number): number  {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number): number  {
  return Math.pow(t, 3);
}

export function easeInQuad(t: number): number  {  return t * t; }

export function easeOutQuad(t: number): number  { return 1 - easeInQuad(1 - t); }

export function easeInOutCubic(t: number): number  {
  if (t < 0.5) { return easeInCubic(t * 2.0) / 2.0; }
  return 1 - easeInCubic((1 - t) * 2) / 2;
}

export function easeOutElastic(t: number): number {
  const p = 0.3;
  return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
}


// // no easing, no acceleration
// linear: t => t,
// // accelerating from zero velocity
// easeInQuad: t => t*t,
// // decelerating to zero velocity
// easeOutQuad: t => t*(2-t),
// // acceleration until halfway, then deceleration
// easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
// // accelerating from zero velocity
// easeInCubic: t => t*t*t,
// // decelerating to zero velocity
// easeOutCubic: t => (--t)*t*t+1,
// // acceleration until halfway, then deceleration
// easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
// // accelerating from zero velocity
// easeInQuart: t => t*t*t*t,
// // decelerating to zero velocity
// easeOutQuart: t => 1-(--t)*t*t*t,
// // acceleration until halfway, then deceleration
// easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
// // accelerating from zero velocity
// easeInQuint: t => t*t*t*t*t,
// // decelerating to zero velocity
// easeOutQuint: t => 1+(--t)*t*t*t*t,
// // acceleration until halfway, then deceleration
// easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
