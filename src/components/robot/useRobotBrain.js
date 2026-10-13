// useRobotBrain.js
// Central brain controller for 3D Mini Robot:
// - Synced expressions and motions
// - Dynamic mood drift & bias
// - 40 behavior combos & chains with true non-repeating randomness
// - Priority command API & smooth blending without popping
// - Cursor tracking & interaction handling (hover, click, double-click, touch, spam error)

import { useRef, useEffect, useCallback } from 'react';
import { personalityTracker } from './personalitySystem';

// Priority hierarchy
export const PRIORITY = {
  IDLE: 0,
  HOVER: 1,
  CLICK: 2,
  DOUBLE_CLICK: 3,
  ERROR: 4,
  GREETING: 5,
};

// Session storage key and in-memory flag for one-time greeting
const SESSION_GREETED_KEY = 'robotGreeted';
let inMemoryGreeted = false;

export function hasBeenGreeted() {
  try {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_GREETED_KEY) === 'true') {
      return true;
    }
  } catch (e) {
    // sessionStorage unavailable
  }
  return inMemoryGreeted;
}

export function markAsGreeted() {
  inMemoryGreeted = true;
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_GREETED_KEY, 'true');
    }
  } catch (e) {
    // sessionStorage unavailable
  }
}

// Morph target expression map
export function getExpressionWeights(expressionName) {
  switch (expressionName) {
    case 'blink_both': return { blink_both: 1.0 };
    case 'blink_left': return { blink_left: 1.0 };
    case 'blink_right': return { blink_right: 1.0 };
    case 'look_left': return { look_left: 1.0 };
    case 'look_right': return { look_right: 1.0 };
    case 'shocked': return { eyes_shocked: 1.0 };
    case 'heart': return { eyes_heart: 1.0 };
    case 'sleepy': return { eyes_sleepy: 1.0 };
    case 'loading': return { eyes_loading: 1.0 };
    case 'eyes_error': return { eyes_error: 1.0 };
    case 'eyes_namaste': return { eyes_namaste: 1.0, hands_namaste: 1.0 };
    case 'default':
    default:
      return { eyes_default: 1.0 };
  }
}

// 40 Behavioral combos (combining the 7 motions + expressions + micro chains)
export const COMBOS = [
  // Shake combos
  { id: 'shake_blink', motion: 'shake', expression: 'blink_both', duration: 0.55, category: 'shy', baseWeight: 6 },
  { id: 'shake_heart', motion: 'shake', expression: 'heart', duration: 0.7, category: 'happy', baseWeight: 5 },
  { id: 'shake_shocked', motion: 'shake', expression: 'shocked', duration: 0.6, category: 'excited', baseWeight: 6 },
  { id: 'shake_sleepy', motion: 'shake', expression: 'sleepy', duration: 0.8, category: 'sleepy', baseWeight: 5 },

  // Grow combos
  { id: 'grow_shocked', motion: 'grow', expression: 'shocked', duration: 1.1, category: 'excited', baseWeight: 6 },
  { id: 'grow_heart', motion: 'grow', expression: 'heart', duration: 1.2, category: 'happy', baseWeight: 7 },
  { id: 'grow_default', motion: 'grow', expression: 'default', duration: 1.0, category: 'neutral', baseWeight: 6 },
  { id: 'grow_wink', motion: 'grow', expression: 'blink_left', duration: 1.1, category: 'playful', baseWeight: 6 },

  // Sway combos
  { id: 'sway_sleepy', motion: 'sway', expression: 'sleepy', duration: 1.3, category: 'sleepy', baseWeight: 7 },
  { id: 'sway_heart', motion: 'sway', expression: 'heart', duration: 1.2, category: 'happy', baseWeight: 7 },
  { id: 'sway_look_left', motion: 'sway', expression: 'look_left', duration: 1.2, category: 'curious', baseWeight: 6 },
  { id: 'sway_look_right', motion: 'sway', expression: 'look_right', duration: 1.2, category: 'curious', baseWeight: 6 },
  { id: 'sway_default', motion: 'sway', expression: 'default', duration: 1.1, category: 'neutral', baseWeight: 6 },

  // Jiggle combos
  { id: 'jiggle_heart', motion: 'jiggle', expression: 'heart', duration: 0.85, category: 'happy', baseWeight: 6 },
  { id: 'jiggle_wink_left', motion: 'jiggle', expression: 'blink_left', duration: 0.8, category: 'playful', baseWeight: 6 },
  { id: 'jiggle_wink_right', motion: 'jiggle', expression: 'blink_right', duration: 0.8, category: 'playful', baseWeight: 6 },
  { id: 'jiggle_shocked', motion: 'jiggle', expression: 'shocked', duration: 0.8, category: 'excited', baseWeight: 5 },

  // Bounce combos
  { id: 'bounce_heart', motion: 'bounce', expression: 'heart', duration: 0.85, category: 'happy', baseWeight: 7 },
  { id: 'bounce_wink', motion: 'bounce', expression: 'blink_right', duration: 0.8, category: 'playful', baseWeight: 6 },
  { id: 'bounce_shocked', motion: 'bounce', expression: 'shocked', duration: 0.8, category: 'excited', baseWeight: 6 },
  { id: 'bounce_default', motion: 'bounce', expression: 'default', duration: 0.75, category: 'neutral', baseWeight: 6 },

  // Peek turn combos
  { id: 'peek_turn_left', motion: 'peek_turn', expression: 'look_left', duration: 1.2, dir: -1, category: 'curious', baseWeight: 7 },
  { id: 'peek_turn_right', motion: 'peek_turn', expression: 'look_right', duration: 1.2, dir: 1, category: 'curious', baseWeight: 7 },
  { id: 'peek_turn_thinking', motion: 'peek_turn', expression: 'loading', duration: 1.3, category: 'thinking', baseWeight: 6 },
  { id: 'peek_turn_shy', motion: 'peek_turn', expression: 'blink_both', duration: 1.2, category: 'shy', baseWeight: 6 },

  // Revolve combos (1.2 to 1.8s total duration)
  { id: 'revolve_loading', motion: 'revolve', expression: 'loading', duration: 1.5, category: 'thinking', baseWeight: 7 },
  { id: 'revolve_heart', motion: 'revolve', expression: 'heart', duration: 1.5, category: 'happy', baseWeight: 6 },
  { id: 'revolve_shocked', motion: 'revolve', expression: 'shocked', duration: 1.45, category: 'excited', baseWeight: 6 },
  { id: 'revolve_default', motion: 'revolve', expression: 'default', duration: 1.5, category: 'neutral', baseWeight: 7 },

  // Expression-only moments (motion: none)
  { id: 'expr_wink_left', motion: 'none', expression: 'blink_left', duration: 0.35, category: 'playful', baseWeight: 6 },
  { id: 'expr_wink_right', motion: 'none', expression: 'blink_right', duration: 0.35, category: 'playful', baseWeight: 6 },
  { id: 'expr_blink_both', motion: 'none', expression: 'blink_both', duration: 0.35, category: 'neutral', baseWeight: 7 },
  { id: 'expr_look_left', motion: 'none', expression: 'look_left', duration: 1.1, category: 'curious', baseWeight: 5 },
  { id: 'expr_look_right', motion: 'none', expression: 'look_right', duration: 1.1, category: 'curious', baseWeight: 5 },
  { id: 'expr_sleepy_yawn', motion: 'none', expression: 'sleepy', duration: 2.0, category: 'sleepy', baseWeight: 6 },
  { id: 'expr_thinking', motion: 'none', expression: 'loading', duration: 1.8, category: 'thinking', baseWeight: 6 },
  { id: 'expr_heart_pulse', motion: 'none', expression: 'heart', duration: 1.6, category: 'happy', baseWeight: 6 },

  // Short chains (multi-step compositions)
  {
    id: 'chain_grow_jiggle',
    category: 'excited',
    baseWeight: 5,
    chain: [
      { motion: 'grow', expression: 'shocked', duration: 0.85 },
      { motion: 'jiggle', expression: 'heart', duration: 0.7 },
    ],
  },
  {
    id: 'chain_peek_sway',
    category: 'curious',
    baseWeight: 5,
    chain: [
      { motion: 'peek_turn', expression: 'look_left', duration: 0.9, dir: -1 },
      { motion: 'sway', expression: 'heart', duration: 0.9 },
    ],
  },
  {
    id: 'chain_bounce_revolve',
    category: 'playful',
    baseWeight: 5,
    chain: [
      { motion: 'bounce', expression: 'blink_right', duration: 0.65 },
      { motion: 'revolve', expression: 'default', duration: 1.4 },
    ],
  },
];

// Interaction reaction pools
export const HOVER_REACTIONS = [
  {
    id: 'hover_curious',
    chain: [
      { motion: 'sway', expression: 'look_left', duration: 0.85, intensity: 0.9 },
      { motion: 'none', expression: 'heart', duration: 0.75, intensity: 1.0 },
    ],
  },
  {
    id: 'hover_excited',
    chain: [
      { motion: 'grow', expression: 'shocked', duration: 0.7, intensity: 1.1 },
      { motion: 'jiggle', expression: 'heart', duration: 0.75, intensity: 1.0 },
    ],
  },
  {
    id: 'hover_shy',
    chain: [
      { motion: 'none', expression: 'blink_both', duration: 0.4, intensity: 1.0 },
      { motion: 'peek_turn', expression: 'look_right', duration: 1.1, dir: 1, intensity: 0.8 },
    ],
  },
  {
    id: 'hover_playful',
    chain: [
      { motion: 'bounce', expression: 'blink_right', duration: 0.75, intensity: 0.9 },
      { motion: 'none', expression: 'heart', duration: 0.65, intensity: 1.0 },
    ],
  },
  {
    id: 'hover_tilt_smile',
    chain: [
      { motion: 'sway', expression: 'default', duration: 0.9, intensity: 1.1 },
      { motion: 'jiggle', expression: 'heart', duration: 0.6, intensity: 0.8 },
    ],
  },
  {
    id: 'hover_peek_curious',
    chain: [
      { motion: 'peek_turn', expression: 'look_left', duration: 0.95, dir: -1, intensity: 1.0 },
      { motion: 'bounce', expression: 'heart', duration: 0.7, intensity: 0.9 },
    ],
  },
];

export const CLICK_REACTIONS = [
  {
    id: 'click_bounce_heart_jiggle',
    chain: [
      { motion: 'bounce', expression: 'heart', duration: 0.85, intensity: 1.2 },
      { motion: 'jiggle', expression: 'blink_left', duration: 0.75, intensity: 0.9 },
    ],
  },
  {
    id: 'click_peek_shock_grow',
    chain: [
      { motion: 'peek_turn', expression: 'shocked', duration: 0.9, dir: 1, intensity: 1.1 },
      { motion: 'grow', expression: 'heart', duration: 0.85, intensity: 1.15 },
    ],
  },
  {
    id: 'click_revolve_happy',
    chain: [
      { motion: 'revolve', expression: 'heart', duration: 1.45, intensity: 1.0 },
      { motion: 'bounce', expression: 'default', duration: 0.65, intensity: 1.1 },
    ],
  },
  {
    id: 'click_shake_blink_wink',
    chain: [
      { motion: 'shake', expression: 'blink_both', duration: 0.55, intensity: 1.2 },
      { motion: 'sway', expression: 'blink_right', duration: 0.95, intensity: 1.0 },
    ],
  },
  {
    id: 'click_jiggle_heart_bounce',
    chain: [
      { motion: 'jiggle', expression: 'heart', duration: 0.8, intensity: 1.1 },
      { motion: 'bounce', expression: 'shocked', duration: 0.75, intensity: 1.0 },
    ],
  },
  {
    id: 'click_grow_shock_heart',
    chain: [
      { motion: 'grow', expression: 'shocked', duration: 0.8, intensity: 1.2 },
      { motion: 'sway', expression: 'heart', duration: 0.95, intensity: 1.0 },
    ],
  },
];

export const DOUBLE_CLICK_REACTIONS = [
  {
    id: 'dclick_celebration',
    chain: [
      { motion: 'grow', expression: 'shocked', duration: 0.8, intensity: 1.3 },
      { motion: 'revolve', expression: 'heart', duration: 1.45, intensity: 1.0 },
      { motion: 'jiggle', expression: 'blink_right', duration: 0.8, intensity: 1.1 },
    ],
  },
  {
    id: 'dclick_super_bounce',
    chain: [
      { motion: 'bounce', expression: 'heart', duration: 0.8, intensity: 1.35 },
      { motion: 'sway', expression: 'look_left', duration: 0.9, dir: -1, intensity: 1.2 },
      { motion: 'bounce', expression: 'blink_left', duration: 0.75, intensity: 1.0 },
    ],
  },
  {
    id: 'dclick_spin_jiggle',
    chain: [
      { motion: 'revolve', expression: 'shocked', duration: 1.4, intensity: 1.1 },
      { motion: 'jiggle', expression: 'heart', duration: 0.8, intensity: 1.2 },
      { motion: 'grow', expression: 'default', duration: 0.75, intensity: 1.0 },
    ],
  },
  {
    id: 'dclick_peek_party',
    chain: [
      { motion: 'peek_turn', expression: 'look_left', duration: 0.7, dir: -1, intensity: 1.1 },
      { motion: 'peek_turn', expression: 'look_right', duration: 0.7, dir: 1, intensity: 1.1 },
      { motion: 'bounce', expression: 'heart', duration: 0.8, intensity: 1.2 },
    ],
  },
];

// Spam click Error Easter Egg (Shake with glitch twitch, freeze, slow sleepy-relieved recovery)
export const ERROR_EASTER_EGG = {
  id: 'error_easter_egg',
  chain: [
    { motion: 'shake', expression: 'eyes_error', duration: 0.75, intensity: 1.3, extra: { glitchFlicker: true } },
    { motion: 'jiggle', expression: 'eyes_error', duration: 0.65, intensity: 1.1 },
    { motion: 'none', expression: 'eyes_error', duration: 0.5, intensity: 1.0 },
    { motion: 'sway', expression: 'blink_both', duration: 0.85, intensity: 0.6 },
    { motion: 'none', expression: 'default', duration: 0.45, intensity: 1.0 },
  ],
};

// Motion evaluation function: outputs transform offsets
export function evaluateMotion(type, p, intensity = 1.0, direction = 1, extra = {}) {
  const result = {
    pos: [0, 0, 0],
    rot: [0, 0, 0],
    scale: [1, 1, 1],
  };

  switch (type) {
    case 'revolve': {
      // Smooth cosine ease-in-out over the whole revolve (0 to 2*PI in direction)
      const eased = 0.5 * (1 - Math.cos(Math.PI * p));
      result.rot[1] = direction * eased * Math.PI * 2;
      break;
    }

    case 'grow': {
      // Scale up to ~1.28x with soft overshoot, hold, scale back
      let sc = 1;
      const peak = 1.0 + 0.28 * intensity;
      if (p < 0.4) {
        const t = p / 0.4;
        sc = 1.0 + (peak - 1.0) * Math.sin(t * Math.PI * 0.5);
      } else if (p < 0.6) {
        const t = (p - 0.4) / 0.2;
        sc = peak - 0.03 * t;
      } else {
        const t = (p - 0.6) / 0.4;
        const easedReturn = 0.5 * (1 - Math.cos(Math.PI * t));
        sc = peak - (peak - 1.0) * easedReturn;
      }
      result.scale = [sc, sc, sc];
      break;
    }

    case 'sway': {
      // Side-to-side tilt on Z axis (+/-15 deg ≈ 0.26 rad) with decay
      const maxRad = ((15 * Math.PI) / 180) * intensity * direction;
      const decay = Math.sin(p * Math.PI);
      result.rot[2] = maxRad * Math.sin(p * Math.PI * 5) * decay;
      break;
    }

    case 'jiggle': {
      // Squash and stretch wobble (+/-8% scale)
      const wobble = 0.08 * intensity * Math.sin(p * Math.PI * 14) * (1 - p);
      result.scale = [1 + wobble, 1 - wobble, 1 + wobble * 0.5];
      break;
    }

    case 'shake': {
      // Left-right position shake (+/-0.05) with rotation twitch (+/-0.08)
      const decay = 1 - p;
      result.pos[0] = 0.05 * intensity * Math.sin(p * Math.PI * 18) * decay;
      result.rot[2] = 0.08 * intensity * Math.cos(p * Math.PI * 18) * decay;
      break;
    }

    case 'bounce': {
      // Quick hop up and down with squash on landing
      let y = 0;
      let scX = 1;
      let scY = 1;
      if (p < 0.7) {
        const hopP = p / 0.7;
        y = 0.1 * intensity * Math.sin(hopP * Math.PI);
        scY = 1 + 0.06 * intensity * Math.sin(hopP * Math.PI);
        scX = 1 - 0.03 * intensity * Math.sin(hopP * Math.PI);
      } else {
        const landP = (p - 0.7) / 0.3;
        const squash = 0.12 * intensity * Math.sin(landP * Math.PI * 2) * (1 - landP);
        scY = 1 - squash;
        scX = 1 + squash * 0.5;
        y = 0;
      }
      result.pos[1] = y;
      result.scale = [scX, scY, scX];
      break;
    }

    case 'peek_turn': {
      // Partial Y turn (40° to 70°), pause, turn back
      const targetAngle = (extra.peekAngle || ((55 * Math.PI) / 180)) * direction * intensity;
      let angle = 0;
      if (p < 0.35) {
        const t = p / 0.35;
        const eased = 0.5 * (1 - Math.cos(Math.PI * t));
        angle = targetAngle * eased;
      } else if (p < 0.65) {
        angle = targetAngle;
      } else {
        const t = (p - 0.65) / 0.35;
        const eased = 0.5 * (1 + Math.cos(Math.PI * t));
        angle = targetAngle * eased;
      }
      result.rot[1] = angle;
      break;
    }

    case 'bow': {
      // Gentle cute bow/nod synchronized with Namaste gesture (3.8s total):
      // Bow starts as hands meet (~0.7s, p ~ 0.184), holds during hold phase, returns to base before hands release (3.0s, p ~ 0.789)
      const maxTilt = ((12 * Math.PI) / 180) * intensity;
      let tilt = 0;
      let yDip = 0;
      if (p < 0.184) {
        tilt = 0;
        yDip = 0;
      } else if (p < 0.32) {
        const t = (p - 0.184) / 0.136;
        const eased = 0.5 * (1 - Math.cos(Math.PI * t));
        tilt = maxTilt * eased;
        yDip = -0.02 * intensity * eased;
      } else if (p < 0.68) {
        const t = (p - 0.32) / 0.36;
        const breath = Math.sin(t * Math.PI * 2) * 0.012 * intensity;
        tilt = maxTilt + breath;
        yDip = -0.02 * intensity;
      } else if (p < 0.78) {
        const t = (p - 0.68) / 0.10;
        const eased = 0.5 * (1 + Math.cos(Math.PI * t));
        tilt = maxTilt * eased;
        yDip = -0.02 * intensity * eased;
      } else {
        tilt = 0;
        yDip = 0;
      }
      result.rot[0] = tilt;
      result.pos[1] = yDip;
      break;
    }

    case 'none':
    default:
      break;
  }

  return result;
}

export function useRobotBrain(options = {}) {
  const { onRobotClick, onRobotError } = options;
  const onRobotClickRef = useRef(onRobotClick);
  onRobotClickRef.current = onRobotClick;
  const onRobotErrorRef = useRef(onRobotError);
  onRobotErrorRef.current = onRobotError;

  // Mood state: happy, curious, sleepy, excited, shy, playful, thinking
  const moodRef = useRef('happy');
  const moodTimerRef = useRef(0);
  const nextMoodChangeRef = useRef(15 + Math.random() * 25); // 15 to 40s

  // Command API & Active execution state
  const activeExecutionRef = useRef({
    priority: PRIORITY.IDLE,
    id: null,
    steps: [],
    stepIndex: 0,
    timer: 0,
    duration: 1.0,
    intensity: 1.0,
    direction: 1,
    extra: {},
    isMicro: false,
    activeTargets: getExpressionWeights('default'),
    onComplete: null,
  });

  // Idle timer & rolling history
  const idleStateRef = useRef({
    timer: 0,
    duration: 2.0 + Math.random() * 3.0,
    lastCombos: [], // Last 4 combo IDs
    lastMotion: null,
    lastExpression: null,
  });

  // Cursor tracking for eyes
  const cursorTrackRef = useRef({
    isHovering: false,
    cursorX: 0, // -1 (left) to +1 (right)
    lastHoverReactionTime: 0,
  });

  // Interaction queuing & spam detection
  const interactionStateRef = useRef({
    clickTimestamps: [],
    isErrorActive: false,
    errorCooldownUntil: 0,
    singleClickTimer: null,
    lastClickReactionId: null,
    lastHoverReactionId: null,
    touchStartTime: 0,
    touchPos: { x: 0, y: 0 },
    longPressTimer: null,
    lastTapTime: 0,
  });

  // Tab visibility
  const isVisibleRef = useRef(true);

  // Small Command API: playCombo({ steps, priority, intensity, onComplete })
  const playCombo = useCallback((options) => {
    const {
      id = 'custom',
      priority = PRIORITY.IDLE,
      steps = [],
      intensity = 1.0,
      direction = 1,
      extra = {},
      onComplete = null,
    } = options;

    const current = activeExecutionRef.current;

    // Reject if current running task has strictly higher priority
    if (current.priority > priority) {
      return false;
    }

    if (steps.length === 0) return false;

    // Configure steps with duration and safety defaults
    const configuredSteps = steps.map((st) => {
      if (st.motion === 'revolve') {
        const stepDir = st.direction !== undefined
          ? st.direction
          : (st.dir !== undefined ? st.dir : (Math.random() < 0.5 ? 1 : -1));
        return {
          ...st,
          direction: stepDir,
        };
      }
      return st;
    });

    const firstStep = configuredSteps[0];
    const duration = firstStep.duration || 1.0;

    activeExecutionRef.current = {
      priority,
      id,
      steps: configuredSteps,
      stepIndex: 0,
      timer: 0,
      duration,
      intensity,
      direction,
      extra: { ...extra, ...(firstStep.extra || {}) },
      isMicro: !!firstStep.isMicro,
      activeTargets: getExpressionWeights(firstStep.expression || 'default'),
      onComplete,
    };

    return true;
  }, []);

  // Trigger one-time Namaste greeting
  const playGreeting = useCallback(() => {
    markAsGreeted();
    const { amplitudeFactor, prefersReducedMotion } = personalityTracker.evaluate();

    playCombo({
      id: 'greeting_namaste',
      priority: PRIORITY.GREETING,
      steps: [
        {
          motion: prefersReducedMotion ? 'none' : 'bow',
          expression: 'eyes_namaste',
          duration: 3.8,
          intensity: amplitudeFactor,
        },
      ],
      onComplete: () => {
        // Resume idle brain smoothly after greeting finishes
        idleStateRef.current.timer = 0;
        idleStateRef.current.duration = 2.5; // Short calm hold after greeting
      },
    });
  }, [playCombo]);

  // Initialize personality tracker & tab visibility & schedule one-time session greeting
  useEffect(() => {
    personalityTracker.init();

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Schedule one-time Namaste greeting (1.2s after mount when tab is visible)
    let greetingTimer = null;
    const scheduleGreeting = () => {
      if (hasBeenGreeted()) return;
      if (document.hidden) return; // Wait until tab is visible

      greetingTimer = setTimeout(() => {
        if (!hasBeenGreeted() && !document.hidden) {
          playGreeting();
        }
      }, 1200);
    };

    const handleVisibilityForGreeting = () => {
      if (!document.hidden && !hasBeenGreeted() && !greetingTimer) {
        scheduleGreeting();
      }
    };

    if (document.hidden) {
      document.addEventListener('visibilitychange', handleVisibilityForGreeting);
    } else {
      scheduleGreeting();
    }

    return () => {
      personalityTracker.cleanup();
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibilityForGreeting);
      if (greetingTimer) clearTimeout(greetingTimer);
      if (interactionStateRef.current.singleClickTimer) {
        clearTimeout(interactionStateRef.current.singleClickTimer);
      }
      if (interactionStateRef.current.longPressTimer) {
        clearTimeout(interactionStateRef.current.longPressTimer);
      }
    };
  }, [playGreeting]);

  // Mood drift engine (every 15 to 40 seconds, biased by personality signals)
  const updateMood = useCallback((delta) => {
    moodTimerRef.current += delta;
    if (moodTimerRef.current >= nextMoodChangeRef.current) {
      moodTimerRef.current = 0;
      nextMoodChangeRef.current = 15 + Math.random() * 25; // Random 15-40s

      const { moodBias } = personalityTracker.evaluate();
      const moods = ['happy', 'curious', 'sleepy', 'excited', 'shy', 'playful', 'thinking'];
      
      // Calculate total weighted pool
      let totalWeight = 0;
      for (const m of moods) {
        totalWeight += moodBias[m] || 1.0;
      }

      let rnd = Math.random() * totalWeight;
      for (const m of moods) {
        const w = moodBias[m] || 1.0;
        if (rnd < w) {
          moodRef.current = m;
          break;
        }
        rnd -= w;
      }
    }
  }, []);

  // Pick next random idle combo adhering strictly to non-repeating rules
  const pickNextIdleCombo = useCallback(() => {
    const { scores, paceFactor, amplitudeFactor, prefersReducedMotion } = personalityTracker.evaluate();
    const idle = idleStateRef.current;
    const currentMood = moodRef.current;

    // Filter out:
    // 1. Last combo
    // 2. Rolling history of last 4 combos
    // 3. Same motion or expression back-to-back
    let candidates = COMBOS.filter((c) => {
      if (idle.lastCombos.includes(c.id)) return false;
      const motion = c.chain ? c.chain[0].motion : c.motion;
      const expr = c.chain ? c.chain[0].expression : c.expression;
      if (idle.lastMotion && motion !== 'none' && motion === idle.lastMotion) return false;
      if (idle.lastExpression && expr !== 'default' && expr === idle.lastExpression) return false;
      return true;
    });

    if (candidates.length === 0) {
      // Fallback if filter is too tight: only exclude the immediate last combo
      candidates = COMBOS.filter((c) => c.id !== idle.lastCombos[idle.lastCombos.length - 1]);
    }

    // Calculate weights based on mood + personality biases
    let totalWeight = 0;
    const weightedList = candidates.map((combo) => {
      let w = combo.baseWeight || 5;

      // Category / Mood synergy
      if (combo.category === currentMood) w *= 2.2;
      if (currentMood === 'excited' && ['bounce', 'jiggle', 'grow'].includes(combo.motion)) w *= 1.8;
      if (currentMood === 'sleepy' && ['sway', 'expr_sleepy_yawn'].includes(combo.id)) w *= 2.5;
      if (currentMood === 'curious' && ['peek_turn', 'look_left', 'look_right'].includes(combo.motion)) w *= 2.0;

      // Personality score influence
      if (scores.energetic > 0.25 && ['revolve', 'bounce', 'grow'].includes(combo.motion)) w *= 1.6;
      if (scores.calm_chill > 0.25 && ['sway', 'expr_thinking', 'peek_turn'].includes(combo.category)) w *= 1.7;
      if (scores.playful_teaser > 0.25 && ['playful', 'happy'].includes(combo.category)) w *= 1.8;

      // Never reduce any combo chance below 0.5
      w = Math.max(w, 0.5);
      totalWeight += w;
      return { combo, weight: w };
    });

    let rnd = Math.random() * totalWeight;
    let selected = weightedList[0].combo;
    for (const item of weightedList) {
      if (rnd < item.weight) {
        selected = item.combo;
        break;
      }
      rnd -= item.weight;
    }

    // Update rolling history (keep last 4)
    idle.lastCombos.push(selected.id);
    if (idle.lastCombos.length > 4) idle.lastCombos.shift();

    const selectedMotion = selected.chain ? selected.chain[0].motion : selected.motion;
    const selectedExpr = selected.chain ? selected.chain[0].expression : selected.expression;
    idle.lastMotion = selectedMotion;
    idle.lastExpression = selectedExpr;

    // Convert combo to steps with duration/intensity randomization (+/- 20% duration, +/- 15% intensity)
    const durationVar = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const intensityVar = (0.85 + Math.random() * 0.3) * amplitudeFactor; // +/-15% * amplitude
    const dir = selected.dir !== undefined ? selected.dir : (Math.random() < 0.5 ? -1 : 1);

    const steps = selected.chain
      ? selected.chain.map((st) => ({
          motion: prefersReducedMotion ? 'none' : st.motion,
          expression: st.expression,
          duration: st.motion === 'revolve' ? Math.max(1.2, Math.min(1.8, st.duration * durationVar)) : st.duration * durationVar,
          intensity: (st.intensity || 1.0) * intensityVar,
          direction: st.dir !== undefined ? st.dir : dir,
        }))
      : [
          {
            motion: prefersReducedMotion ? 'none' : selected.motion,
            expression: selected.expression,
            duration: selected.motion === 'revolve' ? Math.max(1.2, Math.min(1.8, selected.duration * durationVar)) : selected.duration * durationVar,
            intensity: intensityVar,
            direction: dir,
          },
        ];

    playCombo({
      id: selected.id,
      priority: PRIORITY.IDLE,
      steps,
      intensity: intensityVar,
      direction: dir,
      onComplete: () => {
        // Idle gap: 2 to 9s non-uniform, with 10% chance of long calm gap (10 to 18s)
        const isLongCalm = Math.random() < 0.1;
        const gap = (isLongCalm ? (10 + Math.random() * 8) : (2 + Math.pow(Math.random(), 1.6) * 7)) * paceFactor;
        idleStateRef.current.duration = gap;
        idleStateRef.current.timer = 0;
      },
    });
  }, [playCombo]);

  // Main frame updater called from RobotInner's useFrame
  const updateFrame = useCallback((delta, transformState, morphTargetState) => {
    if (!isVisibleRef.current) return;

    updateMood(delta);

    const exec = activeExecutionRef.current;
    const idle = idleStateRef.current;
    const { prefersReducedMotion } = personalityTracker.evaluate();

    // 1. Is an active combo/reaction running?
    if (exec.id !== null) {
      exec.timer += delta;
      const curStep = exec.steps[exec.stepIndex];
      const p = Math.min(exec.timer / exec.duration, 1);

      // Evaluate procedural motion
      const motionType = prefersReducedMotion ? 'none' : curStep.motion;
      const dir = curStep.direction !== undefined ? curStep.direction : exec.direction;
      const intensity = curStep.intensity !== undefined ? curStep.intensity : exec.intensity;
      const computed = evaluateMotion(motionType, p, intensity, dir, { ...exec.extra, ...(curStep.extra || {}) });

      transformState.targetPos = computed.pos;
      transformState.targetRot = computed.rot;
      transformState.targetScale = computed.scale;

      if (motionType === 'revolve') {
        transformState.isRevolve = true;
        transformState.revolveAngle = computed.rot[1];
        transformState.revolveDir = dir;
      } else {
        transformState.isRevolve = false;
      }

      // Handle eye glitch flicker in error easter egg
      if (curStep.extra && curStep.extra.glitchFlicker) {
        const flicker = Math.sin(p * Math.PI * 14) > 0.15;
        morphTargetState.targetWeights = getExpressionWeights(flicker ? 'eyes_error' : 'default');
      } else {
        morphTargetState.targetWeights = getExpressionWeights(curStep.expression);
      }

      // Check step completion
      if (p >= 1) {
        if (curStep.motion === 'revolve') {
          transformState.revolveCompleted = true;
          transformState.isRevolve = false;
        }
        if (exec.stepIndex < exec.steps.length - 1) {
          // Advance to next step in chain
          exec.stepIndex += 1;
          exec.timer = 0;
          const nextStep = exec.steps[exec.stepIndex];
          exec.duration = nextStep.duration || 1.0;
        } else {
          // Combo finished! Ease cleanly back to base transform and default eyes
          if (exec.onComplete) exec.onComplete();

          exec.id = null;
          exec.priority = PRIORITY.IDLE;
          exec.steps = [];
          exec.stepIndex = 0;
          exec.timer = 0;

          transformState.targetPos = [0, 0, 0];
          transformState.targetRot = [0, 0, 0];
          transformState.targetScale = [1, 1, 1];
          morphTargetState.targetWeights = getExpressionWeights('default');
        }
      }
    } else {
      // 2. Idle State: counting down to next behavior or micro-behavior
      idle.timer += delta;
      transformState.isRevolve = false;

      // Ensure base transforms are targeted in idle
      transformState.targetPos = [0, 0, 0];
      transformState.targetRot = [0, 0, 0];
      transformState.targetScale = [1, 1, 1];
      morphTargetState.targetWeights = getExpressionWeights('default');

      // Micro-behavior trigger during long idle gaps (tiny blink, look, or breath scale)
      if (idle.timer > 1.8 && idle.timer < idle.duration - 1.2 && Math.random() < delta * 0.35) {
        const microType = Math.random();
        if (microType < 0.45) {
          // Micro-blink
          morphTargetState.targetWeights = getExpressionWeights('blink_both');
        } else if (microType < 0.75) {
          // Micro-look
          morphTargetState.targetWeights = getExpressionWeights(Math.random() < 0.5 ? 'look_left' : 'look_right');
        }
      }

      if (idle.timer >= idle.duration) {
        idle.timer = 0;
        pickNextIdleCombo();
      }
    }

    // 3. Cursor eye tracking while hovering (soft horizontal gaze)
    const cursor = cursorTrackRef.current;
    if (cursor.isHovering && exec.priority !== PRIORITY.GREETING) {
      const gaze = cursor.cursorX; // -1 to 1
      if (gaze < -0.15) {
        const weight = Math.min(Math.abs(gaze) * 0.85, 0.75);
        morphTargetState.targetWeights = {
          ...morphTargetState.targetWeights,
          look_left: Math.max(morphTargetState.targetWeights.look_left || 0, weight),
        };
      } else if (gaze > 0.15) {
        const weight = Math.min(gaze * 0.85, 0.75);
        morphTargetState.targetWeights = {
          ...morphTargetState.targetWeights,
          look_right: Math.max(morphTargetState.targetWeights.look_right || 0, weight),
        };
      }
    }
  }, [pickNextIdleCombo, updateMood]);

  // Trigger Hover Reaction (pool of 6 variants, throttled to 2.5s)
  const triggerHoverReaction = useCallback(() => {
    personalityTracker.recordInteraction('hover');
    const now = Date.now();
    const cursor = cursorTrackRef.current;
    if (now - cursor.lastHoverReactionTime < 2400) return;
    cursor.lastHoverReactionTime = now;

    // Pick a hover reaction different from the last one
    const istate = interactionStateRef.current;
    const candidates = HOVER_REACTIONS.filter((r) => r.id !== istate.lastHoverReactionId);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || HOVER_REACTIONS[0];
    istate.lastHoverReactionId = chosen.id;

    const { amplitudeFactor, prefersReducedMotion } = personalityTracker.evaluate();

    playCombo({
      id: chosen.id,
      priority: PRIORITY.HOVER,
      steps: chosen.chain.map((st) => ({
        ...st,
        motion: prefersReducedMotion ? 'none' : st.motion,
        intensity: (st.intensity || 1.0) * amplitudeFactor,
      })),
      onComplete: () => {
        idleStateRef.current.timer = 0;
      },
    });
  }, [playCombo]);

  // Trigger Click Reaction (pool of 6 variants)
  const triggerClickReaction = useCallback(() => {
    personalityTracker.recordInteraction('click');
    onRobotClickRef.current?.();
    const istate = interactionStateRef.current;
    const candidates = CLICK_REACTIONS.filter((r) => r.id !== istate.lastClickReactionId);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || CLICK_REACTIONS[0];
    istate.lastClickReactionId = chosen.id;

    const { amplitudeFactor, prefersReducedMotion } = personalityTracker.evaluate();

    playCombo({
      id: chosen.id,
      priority: PRIORITY.CLICK,
      steps: chosen.chain.map((st) => ({
        ...st,
        motion: prefersReducedMotion ? 'none' : st.motion,
        intensity: (st.intensity || 1.0) * amplitudeFactor,
      })),
      onComplete: () => {
        idleStateRef.current.timer = 0;
      },
    });
  }, [playCombo]);

  // Trigger Double-Click Reaction (pool of 4 variants)
  const triggerDoubleClickReaction = useCallback(() => {
    personalityTracker.recordInteraction('double_click');
    onRobotClickRef.current?.();
    const chosen = DOUBLE_CLICK_REACTIONS[Math.floor(Math.random() * DOUBLE_CLICK_REACTIONS.length)];
    const { amplitudeFactor, prefersReducedMotion } = personalityTracker.evaluate();

    playCombo({
      id: chosen.id,
      priority: PRIORITY.DOUBLE_CLICK,
      steps: chosen.chain.map((st) => ({
        ...st,
        motion: prefersReducedMotion ? 'none' : st.motion,
        intensity: (st.intensity || 1.0) * amplitudeFactor,
      })),
      onComplete: () => {
        idleStateRef.current.timer = 0;
      },
    });
  }, [playCombo]);

  // Trigger Error Easter Egg (spam clicks)
  const triggerErrorEasterEgg = useCallback(() => {
    const istate = interactionStateRef.current;
    istate.isErrorActive = true;
    onRobotErrorRef.current?.();

    playCombo({
      id: ERROR_EASTER_EGG.id,
      priority: PRIORITY.ERROR,
      steps: ERROR_EASTER_EGG.chain,
      onComplete: () => {
        istate.isErrorActive = false;
        istate.errorCooldownUntil = Date.now() + 7000; // 7s cooldown
        idleStateRef.current.timer = 0;
      },
    });
  }, [playCombo]);

  // Handle interaction input click/tap with spam & double-click detection
  const handleUserClick = useCallback(() => {
    // Ignore if error or greeting is currently active
    if (activeExecutionRef.current.priority === PRIORITY.GREETING) return;
    const now = Date.now();
    const istate = interactionStateRef.current;

    if (istate.isErrorActive) return;

    // Check spam clicks (>= 5 clicks within 2.0s)
    istate.clickTimestamps = istate.clickTimestamps.filter((t) => now - t < 2000);
    istate.clickTimestamps.push(now);

    if (istate.clickTimestamps.length >= 5 && now >= istate.errorCooldownUntil) {
      if (istate.singleClickTimer) {
        clearTimeout(istate.singleClickTimer);
        istate.singleClickTimer = null;
      }
      istate.clickTimestamps = [];
      triggerErrorEasterEgg();
      return;
    }

    // Check double click detection (within 280ms)
    if (istate.singleClickTimer) {
      clearTimeout(istate.singleClickTimer);
      istate.singleClickTimer = null;
      triggerDoubleClickReaction();
    } else {
      istate.singleClickTimer = setTimeout(() => {
        istate.singleClickTimer = null;
        triggerClickReaction();
      }, 280);
    }
  }, [triggerClickReaction, triggerDoubleClickReaction, triggerErrorEasterEgg]);

  // Pointer / Mouse events on robot container
  const onMouseEnter = useCallback(() => {
    if (activeExecutionRef.current.priority === PRIORITY.GREETING) return;
    cursorTrackRef.current.isHovering = true;
    triggerHoverReaction();
  }, [triggerHoverReaction]);

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    // Normalized [-1, 1] relative to center
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    cursorTrackRef.current.cursorX = normX;
  }, []);

  const onMouseLeave = useCallback(() => {
    const cursor = cursorTrackRef.current;
    cursor.isHovering = false;
    cursor.cursorX = 0;
    personalityTracker.recordInteraction('hover_leave_without_click');
  }, []);

  // Touch event handlers for mobile
  const onTouchStart = useCallback((e) => {
    if (activeExecutionRef.current.priority === PRIORITY.GREETING) return;
    const istate = interactionStateRef.current;
    if (istate.isErrorActive) return;

    const touch = e.touches[0];
    istate.touchStartTime = Date.now();
    istate.touchPos = { x: touch.clientX, y: touch.clientY };

    // Start long-press detection (450ms) for hover reaction
    if (istate.longPressTimer) clearTimeout(istate.longPressTimer);
    istate.longPressTimer = setTimeout(() => {
      istate.longPressTimer = null;
      triggerHoverReaction();
    }, 480);
  }, [triggerHoverReaction]);

  const onTouchEnd = useCallback((e) => {
    if (activeExecutionRef.current.priority === PRIORITY.GREETING) return;
    const istate = interactionStateRef.current;
    if (istate.isErrorActive) return;

    const duration = Date.now() - istate.touchStartTime;

    // If long press already fired, do not fire tap
    if (istate.longPressTimer) {
      clearTimeout(istate.longPressTimer);
      istate.longPressTimer = null;

      if (duration < 450) {
        // Double tap check
        const now = Date.now();
        if (now - istate.lastTapTime < 300) {
          istate.lastTapTime = 0;
          if (istate.singleClickTimer) {
            clearTimeout(istate.singleClickTimer);
            istate.singleClickTimer = null;
          }
          triggerDoubleClickReaction();
        } else {
          istate.lastTapTime = now;
          handleUserClick();
        }
      }
    }
  }, [handleUserClick, triggerDoubleClickReaction]);

  return {
    updateFrame,
    playCombo,
    handlers: {
      onClick: handleUserClick,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      onContextMenu: (e) => e.preventDefault(),
    },
  };
}
