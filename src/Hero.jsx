import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, animate, useInView, useReducedMotion } from 'framer-motion';

import starImg from './assets/star.png';
import boltImg from './assets/bolt.png';
import avatarGrayscaleImg from './assets/avatar-grayscale.png';
import avatarColorImg from './assets/avatar-color.png';
import grainImg from './assets/grain.png';
import { AnimatedArrowBox } from './components/AnimatedArrowBox';
import { ResumeModal } from './components/ResumeModal';

/* ==========================================================================
   Shared transition for Hero remaining items:
   Navbar pill, sparkle icon, lightning icon, ©2026, /CREATING SINCE 2020
   All appear together with zero stagger right as the photo card begins to settle
   ========================================================================== */
export const HERO_REMAINING_TRANSITION = {
  duration: 0.6,
  delay: 0.75,
  ease: [0.22, 1, 0.36, 1],
};

/* ==========================================================================
   Animated "Hey!" 3D Stick-On-Wall Component (Plays Once on Scroll)
   ========================================================================== */
const HEY_CHARS = ['H', 'e', 'y', '!'];

function AnimatedHeyHeading({ className, isTriggeredDesktop }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();

  const isTriggered = isTriggeredDesktop !== undefined ? isTriggeredDesktop : isInView;
  const shouldAnimate = !prefersReducedMotion && isTriggered;

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsCompleted(true);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (shouldAnimate) {
      // Safety timer: 0.85s duration + 3 * 0.15s stagger = 1.30s + buffer = 1.4s
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  // Once completed or reduced motion, render plain static text in normal document flow:
  // completely cleared perspective, transformStyle, willChange, and inline transforms
  if (isCompleted || prefersReducedMotion) {
    return (
      <h2
        ref={ref}
        aria-label="Hey!"
        className={className}
      >
        {HEY_CHARS.map((char, index) => (
          <span key={index} aria-hidden="true" className="inline-block">
            {char}
          </span>
        ))}
      </h2>
    );
  }

  return (
    <h2
      ref={ref}
      aria-label="Hey!"
      className={className}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {HEY_CHARS.map((char, index) => {
        const isLast = index === HEY_CHARS.length - 1;
        return (
          <motion.span
            key={index}
            aria-hidden="true"
            className="inline-block"
            style={{
              transformStyle: 'preserve-3d',
              willChange: shouldAnimate ? 'transform, opacity' : 'auto',
            }}
            initial={{
              opacity: 0,
              z: 200,
              rotateX: -25,
              rotateY: 15,
              y: -25,
            }}
            animate={
              shouldAnimate
                ? {
                    opacity: 1,
                    z: 0,
                    rotateX: 0,
                    rotateY: 0,
                    y: 0,
                  }
                : {
                    opacity: 0,
                    z: 200,
                    rotateX: -25,
                    rotateY: 15,
                    y: -25,
                  }
            }
            transition={{
              duration: 0.85,
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={
              isLast && shouldAnimate
                ? () => {
                    setIsCompleted(true);
                  }
                : undefined
            }
          >
            {char}
          </motion.span>
        );
      })}
    </h2>
  );
}

/* ==========================================================================
   Breakpoint Hook — Desktop (>=1280px), Tablet (810px-1279px), Mobile (<810px)
   Synchronously initialized on first render to prevent layout flash
   ========================================================================== */
function getBreakpoint() {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia('(min-width: 1280px)').matches) return 'desktop';
  if (window.matchMedia('(min-width: 810px)').matches) return 'tablet';
  return 'mobile';
}

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(getBreakpoint);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    const tabletQuery = window.matchMedia('(min-width: 810px)');

    const update = () => {
      setBreakpoint(getBreakpoint());
    };

    desktopQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);

    return () => {
      desktopQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, []);

  return breakpoint;
}

/* ==========================================================================
   1. DESKTOP HERO (Scroll-scrubbed, pinned sticky viewport, 3D travel flip)
   ========================================================================== */
function DesktopHero({ onOpenResume }) {
  const wrapperRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
    restDelta: 0.0005,
  });

  const startY = 285;
  const prefersReducedMotion = useReducedMotion();
  const [heyTriggered, setHeyTriggered] = useState(false);

  useEffect(() => {
    if (smooth.get() >= 0.57) {
      setHeyTriggered(true);
    }
    return smooth.on('change', (latest) => {
      if (latest >= 0.57) {
        setHeyTriggered(true);
      }
    });
  }, [smooth]);

  // STAGE 1 — Hero heading + credits (fade out)
  const heroOpacity = useTransform(smooth, [0, 0.16, 0.32], [1, 1, 0]);
  const heroY = useTransform(smooth, [0, 0.35], [0, -260]);
  const creditsOp = useTransform(smooth, [0, 0.10, 0.22], [1, 1, 0]);

  // AVATAR 3-D card
  const avY = useTransform(smooth, [0, 0.44, 0.82], [startY, startY * 0.25, 0]);
  const avScale = useTransform(smooth, [0, 0.44, 0.88, 0.98], [0.625, 0.78, 0.97, 1]);
  const avRotateY = useTransform(
    smooth,
    [0, 0.22, 0.50, 0.73, 0.95],
    [0, -35, -90, -140, -180],
  );

  // STAGE 2 — Bio content
  const bioLOp = useTransform(smooth, [0.57, 0.82], [0, 1]);
  const bioLY = useTransform(smooth, [0.57, 0.82], [40, 0]);

  const bioROp = useTransform(smooth, [0.70, 0.95], [0, 1]);
  const bioRY = useTransform(smooth, [0.70, 0.95], [40, 0]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full bg-transparent"
      style={{ height: '250vh' }}
    >
      <div
        className="sticky top-0 w-full h-screen"
        style={{
          overflow: 'clip',
          transform: 'translateZ(0)',
        }}
      >

        {/* 3D Rotating Avatar Card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[15]">
          <div style={{ perspective: 1200 }}>
            {/* Intro Load Sequence Wrapper: 3. Portrait Photo Card */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                style={{
                  rotateY: avRotateY,
                  scale: avScale,
                  y: avY,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                className="relative w-[400px]"
              >
                <div style={{ paddingBottom: `${(1 / 0.877) * 100}%` }} />

                {/* FRONT face — grayscale */}
                <div
                  className="absolute inset-0 rounded-[20px]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={avatarGrayscaleImg}
                    alt="Majd – grayscale"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                  />
                </div>

                {/* BACK face — red */}
                <div
                  className="absolute inset-0 rounded-[20px]"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <img
                    src={avatarColorImg}
                    alt="Majd – colour"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Hero Headline + Floating Icons */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            willChange: 'transform, opacity',
          }}
          className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none"
        >
          <div className="relative w-full max-w-[1180px] mx-auto px-0 text-center">
            {/* 4b. Sparkle Icon */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={HERO_REMAINING_TRANSITION}
              className="absolute -top-[60px] -left-4 pointer-events-none drop-shadow-xl select-none"
            >
              <motion.img
                src={starImg}
                alt=""
                animate={{ y: [-6, 6, -6], rotate: [-4, 4, -4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
                className="w-[140px]"
              />
            </motion.div>

            {/* 4c. Lightning Icon */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={HERO_REMAINING_TRANSITION}
              className="absolute -bottom-[80px] -right-4 pointer-events-none drop-shadow-xl select-none"
            >
              <motion.img
                src={boltImg}
                alt=""
                animate={{ y: [6, -6, 6], rotate: [12, 20, 12] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
                className="w-[160px]"
              />
            </motion.div>

            <h1
              style={{ willChange: 'transform' }}
              className="font-extrabold uppercase text-[#111111] tracking-[-0.02em] leading-[0.9em] text-[174px] select-none font-sans"
            >
              {/* 1. "SOFTWARE" appears first */}
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                SOFTWARE
              </motion.span>
              {/* 2. "ENGINEER" appears directly after */}
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                ENGINEER
              </motion.span>
            </h1>
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div
          style={{ opacity: creditsOp, willChange: 'opacity' }}
          className="absolute bottom-5 left-0 right-0 z-[20] max-w-[1180px] mx-auto px-0 flex items-end justify-between pointer-events-none select-none"
        >
          {/* 4d. "©2026" */}
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={HERO_REMAINING_TRANSITION}
            className="font-semibold text-[#111111] text-[68px] leading-none tracking-[-0.02em] inline-block"
          >
            ©2026
          </motion.span>
          {/* 4e. "/CREATING SINCE 2023" */}
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={HERO_REMAINING_TRANSITION}
            className="font-normal text-[#111111] text-[18px] leading-[1.4em] tracking-[-0.04em] inline-block"
          >
            /CREATING SINCE 2023
          </motion.span>
        </motion.div>

        {/* Bio Content */}
        <div className="absolute inset-0 z-[10] flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-[1180px] mx-auto px-0 flex flex-row justify-between items-end">
            <motion.div
              style={{ opacity: bioLOp, y: bioLY, willChange: 'transform, opacity' }}
              className="w-[300px] max-w-[300px] flex flex-col gap-[260px] pointer-events-auto"
            >
              {/* ANIMATION 2: "Hey!" 3D Stick-On-Wall */}
              <AnimatedHeyHeading
                className="font-sans not-italic font-[600] font-semibold text-[#111111] text-[76px] leading-none tracking-[-0.02em]"
                isTriggeredDesktop={heyTriggered}
              />

              <p className="font-sans not-italic font-[600] font-semibold text-[#111111] text-[22px] leading-[1.4em] tracking-[-0.04em]">
                I&rsquo;m Aryan, a developer and AI enthusiast from India, building practical products using AI and modern web tools.
              </p>
            </motion.div>

            <div className="w-[400px] shrink-0" />

            <motion.div
              style={{ opacity: bioROp, y: bioRY, willChange: 'transform, opacity' }}
              className="w-[360px] max-w-[360px] flex flex-col gap-5 justify-end pointer-events-auto"
            >
              <p className="font-sans not-italic font-[400] font-normal text-[#111111]/80 text-[18px] leading-[1.4em] tracking-[-0.04em]">
                I love turning ideas into thoughtful digital products: clean interfaces, smooth interactions, and the details that feel effortless.
              </p>
              <p className="font-sans not-italic font-[400] font-normal text-[#111111]/80 text-[18px] leading-[1.4em] tracking-[-0.04em]">
                My goal is to keep learning, build meaningful things, and turn every single project into a real chance to grow as a much better developer.
              </p>

              <div className="flex flex-wrap items-center gap-3 tablet:gap-6 desktop:gap-8 py-1">
                <motion.a
                  href="https://github.com/aryankumar-04"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="group inline-flex items-center gap-3 text-[#111111] hover:text-[#111111]/70 transition-colors py-1 cursor-pointer select-none"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-sans not-italic font-[400] font-normal text-[18px] tracking-tight whitespace-nowrap">
                    GitHub
                  </span>
                  <AnimatedArrowBox variant="light" size="sm" direction="up-right" />
                </motion.a>

                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenResume(e.currentTarget);
                  }}
                  aria-label="View Resume"
                  aria-haspopup="dialog"
                  className="group inline-flex items-center gap-3 text-[#111111] hover:text-[#111111]/70 transition-colors py-1 cursor-pointer select-none bg-transparent border-0 p-0 text-left"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-sans not-italic font-[400] font-normal text-[18px] tracking-tight whitespace-nowrap">
                    View Resume
                  </span>
                  <AnimatedArrowBox variant="light" size="sm" direction="up-right" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. TABLET HERO (Normal-flow, in-place 3D flip, dedicated tablet layout)
   ========================================================================== */
let tabletFlipPlayed = false;

function TabletHero({ onOpenResume }) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rotateY = useMotionValue(
    prefersReducedMotion || tabletFlipPlayed ? -180 : 0
  );
  const cardRef = useRef(null);
  const hasTriggeredRef = useRef(prefersReducedMotion || tabletFlipPlayed);

  useEffect(() => {
    if (hasTriggeredRef.current) return;

    const triggerFlip = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      tabletFlipPlayed = true;

      animate(rotateY, -180, {
        duration: 0.85,
        ease: [0.25, 1, 0.5, 1],
      });
    };

    const handleScroll = () => {
      if (window.scrollY > 30) {
        triggerFlip();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && window.scrollY > 20) {
          triggerFlip();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    if (window.scrollY > 30) {
      triggerFlip();
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [rotateY]);

  return (
    <section className="relative w-full bg-transparent overflow-clip">

      {/* Screen 1: Top Hero Section */}
      <div className="relative z-[2] w-full min-h-[100svh] flex flex-col justify-between items-center max-w-[900px] mx-auto px-[30px] pt-[140px] pb-6">
        <div className="w-full flex flex-col items-center justify-center flex-1">
          {/* Headline + Icons */}
          <div className="relative w-full max-w-[640px] text-center select-none">
            {/* 4b. Sparkle: 124x124, top: -69px, left: -44px */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={HERO_REMAINING_TRANSITION}
              className="absolute -top-[69px] -left-[44px] pointer-events-none drop-shadow-md select-none"
            >
              <motion.img
                src={starImg}
                alt=""
                animate={{ y: [-5, 5, -5], rotate: [-4, 4, -4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
                className="w-[124px] h-[124px]"
              />
            </motion.div>

            {/* 4c. Bolt: 140x140, rotation: 16deg, bottom: -81px, right: -51px */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={HERO_REMAINING_TRANSITION}
              className="absolute -bottom-[81px] -right-[51px] pointer-events-none drop-shadow-md select-none"
            >
              <motion.img
                src={boltImg}
                alt=""
                animate={{ y: [5, -5, 5], rotate: [12, 20, 12] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
                className="w-[140px] h-[140px]"
              />
            </motion.div>

            <h1 className="font-extrabold uppercase text-[#111111] tracking-[-0.02em] leading-[0.9em] text-[88px] min-[900px]:text-[96px] select-none font-sans">
              {/* 1. "SOFTWARE" appears first */}
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                SOFTWARE
              </motion.span>
              {/* 2. "ENGINEER" appears directly after */}
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                ENGINEER
              </motion.span>
            </h1>
          </div>

          {/* In-place 3D flipping Portrait: 220px width, 251px height (0.877 ratio) */}
          <div
            ref={cardRef}
            className="relative mt-8 mb-4 flex justify-center items-center select-none"
            style={{ perspective: 1000 }}
          >
            {/* 3. Portrait Photo Card */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                style={{
                  rotateY,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                className="relative w-[220px] h-[251px] rounded-[24px]"
              >
                {/* FRONT face — grayscale */}
                <div
                  className="absolute inset-0 rounded-[24px] overflow-hidden shadow-sm"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={avatarGrayscaleImg}
                    alt="Majd – grayscale"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* BACK face — red */}
                <div
                  className="absolute inset-0 rounded-[24px] overflow-hidden shadow-sm"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <img
                    src={avatarColorImg}
                    alt="Majd – colour"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Credits row: ©2026 + /CREATING SINCE 2020 */}
        <div className="w-full flex items-baseline justify-between py-4 select-none">
          {/* 4d. "©2026" */}
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={HERO_REMAINING_TRANSITION}
            className="font-semibold text-[#111111] text-[48px] min-[900px]:text-[56px] leading-none tracking-[-0.02em] inline-block"
          >
            ©2026
          </motion.span>
          {/* 4e. "/CREATING SINCE 2023" */}
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={HERO_REMAINING_TRANSITION}
            className="font-normal text-[#111111] text-[16px] min-[900px]:text-[18px] leading-[1.4em] tracking-[-0.04em] inline-block"
          >
            /CREATING SINCE 2023
          </motion.span>
        </div>
      </div>

      {/* Screen 2: Bio Content Area — Tablet side-by-side */}
      <div className="relative z-[2] w-full max-w-[900px] mx-auto px-[30px] pt-[100px] pb-5">
        <div className="w-full flex flex-row justify-between items-end gap-5">
          <div className="w-[300px] max-w-[300px] flex flex-col justify-between self-stretch">
            {/* ANIMATION 2: "Hey!" 3D Stick-On-Wall */}
            <AnimatedHeyHeading className="font-sans not-italic font-[600] font-semibold text-[#111111] text-[62px] leading-none tracking-[-0.02em]" />
            <p className="font-sans not-italic font-[600] font-semibold text-[#111111] text-[22px] leading-[1.4em] tracking-[-0.04em]">
              I&rsquo;m Aryan, a developer and AI enthusiast from India, building practical products using AI and modern web tools.
            </p>
          </div>

          <div className="w-[360px] max-w-[360px] flex flex-col gap-5 justify-end">
            <p className="font-sans not-italic font-[400] font-normal text-[#111111]/80 text-[18px] leading-[1.4em] tracking-[-0.04em]">
              I love turning ideas into thoughtful digital products: clean interfaces, smooth interactions, and the details that feel effortless.
            </p>
            <p className="font-sans not-italic font-[400] font-normal text-[#111111]/80 text-[18px] leading-[1.4em] tracking-[-0.04em]">
              My goal is to keep learning, build meaningful things, and turn every single project into a real chance to grow as a much better developer.
            </p>

            <div className="flex flex-wrap items-center gap-3 tablet:gap-6 desktop:gap-8 py-2">
              <motion.a
                href="https://github.com/aryankumar-04"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="group inline-flex items-center gap-3 text-[#111111] hover:text-[#111111]/70 transition-colors py-1 cursor-pointer select-none"
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-sans not-italic font-[400] font-normal text-[18px] tracking-tight whitespace-nowrap">
                  GitHub
                </span>
                <AnimatedArrowBox variant="light" size="sm" direction="up-right" />
              </motion.a>

              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenResume(e.currentTarget);
                }}
                aria-label="View Resume"
                aria-haspopup="dialog"
                className="group inline-flex items-center gap-3 text-[#111111] hover:text-[#111111]/70 transition-colors py-1 cursor-pointer select-none bg-transparent border-0 p-0 text-left"
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-sans not-italic font-[400] font-normal text-[18px] tracking-tight whitespace-nowrap">
                  View Resume
                </span>
                <AnimatedArrowBox variant="light" size="sm" direction="up-right" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   3. MOBILE HERO (Pixel-perfect matching real phone screenshots + MCP)
   ========================================================================== */
let mobileFlipPlayed = false;

function MobileHero({ onOpenResume }) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rotateY = useMotionValue(
    prefersReducedMotion || mobileFlipPlayed ? -180 : 0
  );
  const cardRef = useRef(null);
  const hasTriggeredRef = useRef(prefersReducedMotion || mobileFlipPlayed);

  useEffect(() => {
    if (hasTriggeredRef.current) return;

    const triggerFlip = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      mobileFlipPlayed = true;

      animate(rotateY, -180, {
        duration: 0.85,
        ease: [0.25, 1, 0.5, 1],
      });
    };

    const handleScroll = () => {
      if (window.scrollY > 25) {
        triggerFlip();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && window.scrollY > 15) {
          triggerFlip();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    if (window.scrollY > 25) {
      triggerFlip();
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [rotateY]);

  return (
    <section className="relative w-full bg-transparent overflow-clip">

      {/* ================================================================
          SCREEN 1: Top Hero Section (Image 1)
          Height: 100svh, top empty area below navbar, centered headline + icons,
          centered portrait with 32px corners, /CREATING SINCE 2020 directly under
          ================================================================ */}
      <div className="relative z-[2] w-full min-h-[100svh] flex flex-col justify-between items-center px-5 pt-[135px] pb-8">
        <div className="w-full flex flex-col items-center justify-center flex-1">
          {/* Headline + Icons (maxWidth: 330px from Framer MCP) */}
          <div className="relative w-full max-w-[330px] mx-auto text-center select-none">
            {/* 4b. Star: 60x60, top: -44px, left: -22px */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={HERO_REMAINING_TRANSITION}
              className="absolute -top-[44px] -left-[22px] pointer-events-none drop-shadow-md select-none"
            >
              <motion.img
                src={starImg}
                alt=""
                animate={{ y: [-3, 3, -3], rotate: [-4, 4, -4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
                className="w-[60px] h-[60px]"
              />
            </motion.div>

            {/* 4c. Bolt: 80x80, rotation: 16deg, bottom: -48px, right: -21px */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={HERO_REMAINING_TRANSITION}
              className="absolute -bottom-[48px] -right-[21px] pointer-events-none drop-shadow-md select-none"
            >
              <motion.img
                src={boltImg}
                alt=""
                animate={{ y: [3, -3, 3], rotate: [12, 20, 12] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
                className="w-[80px] h-[80px]"
              />
            </motion.div>

            {/* Main Headline */}
            <h1 className="font-extrabold uppercase text-[#111111] tracking-[-0.02em] leading-[0.9em] text-[44px] min-[380px]:text-[48px] select-none font-sans">
              {/* 1. "SOFTWARE" appears first */}
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.0, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                SOFTWARE
              </motion.span>
              {/* 2. "ENGINEER" appears directly after */}
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                ENGINEER
              </motion.span>
            </h1>
          </div>

          {/* Centered Portrait with 32px rounded corners + in-place flip: 180x206.5px from MCP */}
          <div
            ref={cardRef}
            className="relative mt-8 mb-2 flex flex-col items-center justify-center select-none"
            style={{ perspective: 1000 }}
          >
            {/* 3. Portrait Photo Card */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 35, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                style={{
                  rotateY,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                className="relative w-[180px] h-[206.5px] rounded-[32px]"
              >
                {/* FRONT face — grayscale */}
                <div
                  className="absolute inset-0 rounded-[32px] overflow-hidden shadow-sm"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={avatarGrayscaleImg}
                    alt="Majd – grayscale"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* BACK face — red */}
                <div
                  className="absolute inset-0 rounded-[32px] overflow-hidden shadow-sm"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <img
                    src={avatarColorImg}
                    alt="Majd – colour"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* 4e. /CREATING SINCE 2023 directly under portrait, centered horizontally */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={HERO_REMAINING_TRANSITION}
              className="w-full mt-3.5 text-center select-none flex justify-center"
            >
              <span
                className="font-sans font-normal font-[400] text-[#111111] text-[18px] tracking-[-0.04em] uppercase block text-center"
                style={{
                  fontFamily: 'Archivo, "Archivo Placeholder", sans-serif',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '18px',
                }}
              >
                /CREATING SINCE 2023
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================================================================
          SCREEN 2: Bio Area (Image 2) — Left-aligned, stacked single column
          Padding: 100px top, 20px sides (px-5) from Framer MCP
          ================================================================ */}
      {/* Screen 2: Bio Area — Stacked single column matching Framer Mobile */}
      <div className="relative z-[2] w-full max-w-[390px] mx-auto px-5 pt-[100px] pb-5 text-left flex flex-col gap-10">
        {/* Title & Description Block (Framer gap: 100px between Hey! and Majd paragraph, max-w-[300px]) */}
        <div className="w-full max-w-[300px] flex flex-col gap-[100px]">
          {/* ANIMATION 2: "Hey!" 3D Stick-On-Wall */}
          <AnimatedHeyHeading className="font-sans not-italic font-[600] font-semibold text-[#111111] text-[46px] leading-[0.95em] tracking-[-0.03em] select-none" />

          <p className="font-sans not-italic font-[600] font-semibold text-[#111111] text-[22px] leading-[1.35em] tracking-[-0.03em]">
            I&rsquo;m Aryan, a developer and AI enthusiast from India, building practical products using AI and modern web tools.
          </p>
        </div>

        {/* Paragraphs Block (Framer gap: 20px between text and button, max-w-[360px]) */}
        <div className="w-full max-w-[360px] flex flex-col gap-5">
          {/* Two lighter regular paragraphs (Framer paragraph-spacing: 20px) */}
          <div className="flex flex-col gap-5 text-[#111111]/80 leading-[1.45em] tracking-[-0.02em]">
            <p className="font-sans not-italic font-[400] font-normal text-[18px]">
              I love turning ideas into thoughtful digital products: clean interfaces, smooth interactions, and the details that feel effortless.
            </p>
            <p className="font-sans not-italic font-[400] font-normal text-[18px]">
              My goal is to keep learning, build meaningful things, and turn every single project into a real chance to grow as a much better developer.
            </p>
          </div>

          {/* GitHub & Download resume link buttons */}
          <div className="flex flex-wrap items-center gap-3 tablet:gap-6 desktop:gap-8 py-1">
            <motion.a
              href="https://github.com/aryankumar-04"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="group inline-flex items-center gap-2.5 text-[#111111] hover:text-[#111111]/70 transition-colors py-1 select-none w-fit cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-sans not-italic font-[400] font-normal text-[18px] tracking-tight whitespace-nowrap">
                GitHub
              </span>
              <AnimatedArrowBox variant="light" size="sm" direction="up-right" />
            </motion.a>

            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onOpenResume(e.currentTarget);
              }}
              aria-label="View Resume"
              aria-haspopup="dialog"
              className="group inline-flex items-center gap-2.5 text-[#111111] hover:text-[#111111]/70 transition-colors py-1 select-none w-fit cursor-pointer bg-transparent border-0 p-0 text-left"
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-sans not-italic font-[400] font-normal text-[18px] tracking-tight whitespace-nowrap">
                View Resume
              </span>
              <AnimatedArrowBox variant="light" size="sm" direction="up-right" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Root Hero Component — Dispatches to Desktop, Tablet, or Mobile variant
   ========================================================================== */
export function Hero() {
  const breakpoint = useBreakpoint();
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const resumeTriggerRef = useRef(null);
  const savedScrollYRef = useRef(0);

  const handleOpenResume = (triggerEl) => {
    savedScrollYRef.current = typeof window !== 'undefined'
      ? (window.__lenis?.scroll ?? window.scrollY)
      : 0;
    resumeTriggerRef.current = triggerEl;
    setIsResumeOpen(true);
  };

  const handleCloseResume = () => {
    const savedY = savedScrollYRef.current;
    setIsResumeOpen(false);

    if (resumeTriggerRef.current && typeof resumeTriggerRef.current.focus === 'function') {
      try {
        resumeTriggerRef.current.focus({ preventScroll: true });
      } catch {
        resumeTriggerRef.current.focus();
      }
    }

    const restoreScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.__lenis) {
          window.__lenis.scrollTo(savedY, { immediate: true, force: true });
        }
        window.scrollTo(0, savedY);
      }
    };

    restoreScroll();
    requestAnimationFrame(restoreScroll);
  };

  let content = null;
  if (breakpoint === 'desktop') {
    content = <DesktopHero onOpenResume={handleOpenResume} />;
  } else if (breakpoint === 'tablet') {
    content = <TabletHero onOpenResume={handleOpenResume} />;
  } else {
    content = <MobileHero onOpenResume={handleOpenResume} />;
  }

  return (
    <>
      {content}
      <ResumeModal isOpen={isResumeOpen} onClose={handleCloseResume} />
    </>
  );
}

export default Hero;
