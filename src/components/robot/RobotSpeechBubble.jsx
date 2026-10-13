// RobotSpeechBubble.jsx
// Theme-aware, accessible speech bubble displayed above the 3D Mini Robot on click/tap.

import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ROBOT_MESSAGES = [
  "Hey there! 👋 I'm Ryan, your little AI buddy. Ready to explore Aryan's digital world?",
  "Hey! I'm Ryan, Aryan's little AI companion.🤖",
];

const COOLDOWN_MS = 3500; // 3.5s cooldown between bubbles
const VISIBLE_DURATION_MS = 3800; // Visible duration before auto-hide
const ANIM_DURATION_MS = 280; // Fade / slide duration

export const RobotSpeechBubble = forwardRef(function RobotSpeechBubble(
  { robotSize, robotOffset },
  ref
) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [message, setMessage] = useState('');
  const [animState, setAnimState] = useState('hidden'); // 'entering' | 'visible' | 'exiting' | 'hidden'
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const lastBubbleTimeRef = useRef(0);
  const lastMsgIndexRef = useRef(-1);
  const hideTimerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const enterTimerRef = useRef(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
    };
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    };
  }, []);

  const dismiss = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    setAnimState('hidden');
  }, []);

  const trigger = useCallback(() => {
    const now = Date.now();
    // 3.5s cooldown
    if (now - lastBubbleTimeRef.current < COOLDOWN_MS) {
      return false;
    }
    lastBubbleTimeRef.current = now;

    // Pick random message, never same twice in a row
    const availableIndices = ROBOT_MESSAGES.map((_, i) => i).filter(
      (i) => i !== lastMsgIndexRef.current
    );
    const chosenIndex =
      availableIndices.length > 0
        ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
        : 0;

    lastMsgIndexRef.current = chosenIndex;
    setMessage(ROBOT_MESSAGES[chosenIndex]);

    // Clear any previous running timers for smooth replacement
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    // Enter animation
    setAnimState('entering');
    enterTimerRef.current = setTimeout(() => {
      setAnimState('visible');
    }, 20);

    // Schedule exit
    hideTimerRef.current = setTimeout(() => {
      setAnimState('exiting');
      exitTimerRef.current = setTimeout(() => {
        setAnimState('hidden');
      }, ANIM_DURATION_MS);
    }, VISIBLE_DURATION_MS);

    return true;
  }, []);

  useImperativeHandle(ref, () => ({
    trigger,
    dismiss,
  }));

  if (animState === 'hidden' || !message) {
    return null;
  }

  // Positioning calculations:
  // Robot horizontal center from viewport right edge
  const robotCenterRight = robotOffset + robotSize / 2;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const bubbleWidth = isMobile ? 210 : 250;
  const marginScreen = 14;

  // Clamp bubble's right edge so it never overflows screen bounds
  const bubbleRight = Math.max(marginScreen, robotCenterRight - bubbleWidth / 2);
  // Tail position relative to bubble's right edge so it always points exactly at the robot center
  const tailRight = Math.max(16, Math.min(bubbleWidth - 16, robotCenterRight - bubbleRight));

  // Color theme tokens
  const bgColor = isDark ? '#1C1C1B' : '#FFFFFF';
  const textColor = isDark ? '#F5F5F3' : '#111111';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)';
  const shadow = isDark
    ? '0 10px 30px -4px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.4)'
    : '0 10px 28px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)';

  // Animation styles based on state
  const isEntering = animState === 'entering';
  const isExiting = animState === 'exiting';

  const opacity = isEntering || isExiting ? 0 : 1;
  const scale = prefersReducedMotion ? 1 : isEntering || isExiting ? 0.88 : 1;
  const translateY = prefersReducedMotion ? 0 : isEntering || isExiting ? 8 : 0;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        zIndex: 41,
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        right: `calc(${bubbleRight}px + env(safe-area-inset-right, 0px))`,
        bottom: `calc(${robotOffset + robotSize + 10}px + env(safe-area-inset-bottom, 0px))`,
        width: `${bubbleWidth}px`,
        maxWidth: 'calc(100vw - 28px)',
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: `calc(100% - ${tailRight}px) 100%`,
        transition: prefersReducedMotion
          ? `opacity ${ANIM_DURATION_MS}ms ease`
          : `opacity ${ANIM_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${ANIM_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {/* Speech bubble card */}
      <div
        style={{
          position: 'relative',
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          padding: '12px 15px',
          boxShadow: shadow,
          fontFamily: 'Archivo, "Archivo Placeholder", sans-serif',
          fontSize: isMobile ? '12.5px' : '13.5px',
          lineHeight: '1.45',
          fontWeight: 450,
          letterSpacing: '-0.01em',
          wordBreak: 'break-word',
          textAlign: 'left',
        }}
      >
        {message}

        {/* Downward pointing tail */}
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            right: `${tailRight - 6}px`,
            width: '12px',
            height: '12px',
            backgroundColor: bgColor,
            borderRight: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            transform: 'rotate(45deg)',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
});

export default RobotSpeechBubble;
