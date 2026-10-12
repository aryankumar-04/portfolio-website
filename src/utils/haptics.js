function canVibrate() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') {
    return false;
  }
  if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) {
    return false;
  }
  return true;
}

export function hapticVeryLight() {
  try {
    if (canVibrate()) {
      navigator.vibrate(10);
    }
  } catch (e) {
    // silently ignore
  }
}

export function hapticLight() {
  try {
    if (canVibrate()) {
      navigator.vibrate(20);
    }
  } catch (e) {
    // silently ignore
  }
}

export function hapticStrong() {
  try {
    if (canVibrate()) {
      navigator.vibrate(40);
    }
  } catch (e) {
    // silently ignore
  }
}

export const veryLight = hapticVeryLight;
export const light = hapticLight;
export const strong = hapticStrong;
