import { pi } from '../constants';

// todo: review!!! Originally this was float& a. So the code relying on this has to be rewritten.
export function ModPi(a: number,  b: number): number {
  if (a - b > pi) {
    a -= 2 * pi;
  } else if (a - b < -pi) {
    a += 2 * pi;
  }

  return a;
}
