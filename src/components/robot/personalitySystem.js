// personalitySystem.js
// Privacy-friendly client-side personality observer and combo/mood weighting engine.

const VISIT_COUNT_KEY = 'mini_robot_visit_count';
const SESSION_FLAG_KEY = 'mini_robot_session_flag';

class PersonalityTracker {
  constructor() {
    this.visitCount = 1;
    this.isReturning = false;
    this.isTouch = false;
    this.isMobile = false;
    this.prefersReducedMotion = false;

    // Behavioral signals
    this.lastActivityTime = Date.now();
    this.scrollVelocity = 0;
    this.mouseVelocity = 0;
    this.lastMousePos = { x: 0, y: 0, time: 0 };
    this.robotClickCount = 0;
    this.robotHoverCount = 0;
    this.hoverWithoutClick = 0;
    this.sessionStartTime = Date.now();

    // Listeners and intervals
    this.cleanupFns = [];
    this.initialized = false;
  }

  init() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    // 1. Visit Count
    try {
      const stored = localStorage.getItem(VISIT_COUNT_KEY);
      let count = stored ? parseInt(stored, 10) : 0;
      if (isNaN(count)) count = 0;

      // Count session once per session storage
      if (!sessionStorage.getItem(SESSION_FLAG_KEY)) {
        count += 1;
        localStorage.setItem(VISIT_COUNT_KEY, String(count));
        sessionStorage.setItem(SESSION_FLAG_KEY, '1');
      }
      this.visitCount = count;
      this.isReturning = count > 1;
    } catch {
      this.isReturning = false;
      this.visitCount = 1;
    }

    // 2. Device signals
    this.isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    this.isMobile = window.innerWidth < 768;
    this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Update reduced motion listener
    if (window.matchMedia) {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleRM = (e) => { this.prefersReducedMotion = e.matches; };
      if (mql.addEventListener) mql.addEventListener('change', handleRM);
      this.cleanupFns.push(() => mql.removeEventListener && mql.removeEventListener('change', handleRM));
    }

    // 3. Passive activity listeners (throttled, low cost)
    let lastScrollTime = 0;
    let lastScrollY = window.scrollY || 0;
    const onScroll = () => {
      const now = Date.now();
      this.lastActivityTime = now;
      const dt = now - lastScrollTime;
      if (dt > 60) {
        const curY = window.scrollY || 0;
        const dy = Math.abs(curY - lastScrollY);
        this.scrollVelocity = (dy / Math.max(dt, 1)) * 1000; // px/sec
        lastScrollY = curY;
        lastScrollTime = now;
      }
    };

    const onMouseMove = (e) => {
      const now = Date.now();
      this.lastActivityTime = now;
      const dt = now - this.lastMousePos.time;
      if (dt > 80) {
        const dx = e.clientX - this.lastMousePos.x;
        const dy = e.clientY - this.lastMousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.mouseVelocity = (dist / Math.max(dt, 1)) * 1000;
        this.lastMousePos = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    const onKeyDown = () => {
      this.lastActivityTime = Date.now();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: true });

    this.cleanupFns.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
    });

    // Decay velocity values periodically
    const decayTimer = setInterval(() => {
      this.scrollVelocity *= 0.7;
      this.mouseVelocity *= 0.7;
    }, 1000);
    this.cleanupFns.push(() => clearInterval(decayTimer));
  }

  cleanup() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    this.initialized = false;
  }

  recordInteraction(type) {
    this.lastActivityTime = Date.now();
    if (type === 'click' || type === 'double_click') {
      this.robotClickCount += 1;
    } else if (type === 'hover') {
      this.robotHoverCount += 1;
    } else if (type === 'hover_leave_without_click') {
      this.hoverWithoutClick += 1;
    }
  }

  // Get current blended personality evaluation
  evaluate() {
    const now = Date.now();
    const idleSeconds = (now - this.lastActivityTime) / 1000;
    const timeSpentSeconds = (now - this.sessionStartTime) / 1000;
    const hour = new Date().getHours();
    const isLateNight = hour >= 23 || hour < 5;

    // Personality scores (0 to 1)
    const scores = {
      welcoming: 0.2,
      familiar_buddy: 0.2,
      sleepy_companion: 0.2,
      energetic: 0.2,
      calm_chill: 0.2,
      shy: 0.2,
      playful_teaser: 0.2,
      mobile_light: 0.2,
    };

    // 1. Visit type scoring
    if (!this.isReturning) {
      scores.welcoming += 0.5;
    } else {
      scores.familiar_buddy += 0.5;
      if (this.visitCount > 3) scores.playful_teaser += 0.2;
    }

    // 2. Time & Idle signals
    if (isLateNight || idleSeconds > 25) {
      scores.sleepy_companion += 0.6;
    } else if (idleSeconds > 12) {
      scores.calm_chill += 0.4;
    }

    // 3. Activity / Velocity signals
    if (this.scrollVelocity > 1200 || this.mouseVelocity > 1500) {
      scores.energetic += 0.6;
    } else if (timeSpentSeconds > 60 && idleSeconds < 10 && this.scrollVelocity < 300) {
      scores.calm_chill += 0.4;
    }

    // 4. Robot interaction signals
    if (this.robotClickCount >= 3) {
      scores.playful_teaser += 0.5;
    }
    if (this.robotHoverCount >= 2 && this.robotClickCount === 0) {
      scores.shy += 0.5;
    }

    // 5. Device signals
    if (this.isTouch || this.isMobile) {
      scores.mobile_light += 0.6;
    }

    // Normalize scores so they blend smoothly
    const sum = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const weights = {};
    for (const [k, v] of Object.entries(scores)) {
      weights[k] = v / sum;
    }

    // Compute mood biases from blended weights
    // Moods: happy, curious, sleepy, excited, shy, playful, thinking
    const moodBias = {
      happy: 1.0 + weights.welcoming * 1.5 + weights.familiar_buddy * 1.2,
      curious: 1.0 + weights.welcoming * 1.2 + weights.calm_chill * 0.8,
      sleepy: 1.0 + weights.sleepy_companion * 3.5,
      excited: 1.0 + weights.energetic * 2.5 + weights.playful_teaser * 1.5,
      shy: 1.0 + weights.shy * 2.8,
      playful: 1.0 + weights.playful_teaser * 2.2 + weights.familiar_buddy * 1.4,
      thinking: 1.0 + weights.calm_chill * 1.8 + weights.sleepy_companion * 0.8,
    };

    // Pacing factor: >1 means longer calm pauses, <1 means faster cadence
    let paceFactor = 1.0;
    if (weights.sleepy_companion > 0.25) paceFactor *= 1.35;
    if (weights.calm_chill > 0.25) paceFactor *= 1.2;
    if (weights.energetic > 0.25) paceFactor *= 0.75;

    // Amplitude factor: scaled down on small screens or reduced motion
    let amplitudeFactor = 1.0;
    if (weights.mobile_light > 0.25 || this.isMobile) amplitudeFactor *= 0.8;
    if (this.prefersReducedMotion) amplitudeFactor = 0.08;

    return {
      scores: weights,
      moodBias,
      paceFactor,
      amplitudeFactor,
      prefersReducedMotion: this.prefersReducedMotion,
      isTouch: this.isTouch,
    };
  }
}

export const personalityTracker = new PersonalityTracker();
