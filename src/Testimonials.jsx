import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { playedOnce } from './utils/playedOnce';

import grainImg from './assets/grain.png';
import avatarYakoub from './assets/avatar-yakoub.png';
import avatarDaniel from './assets/avatar-daniel.png';
import avatarMark from './assets/avatar-mark.png';
import avatarOmar from './assets/avatar-omar.png';

const TESTIMONIALS = [
  {
    id: 'rahul-sharma',
    quote:
      'I use ARCH as part of my daily routine. I record my habits from morning to night and easily see how my day is going.',
    name: 'Rahul Sharma',
    role: 'Student',
    avatar: avatarYakoub,
  },
  {
    id: 'aditya-verma',
    quote:
      'N8N email labelling is very helpful. It sorts my emails automatically, keeps my inbox clean, and saves me time.',
    name: 'Aditya Verma',
    role: 'Software Developer',
    avatar: avatarDaniel,
  },
  {
    id: 'sneha-gupta',
    quote:
      'N8N email summarising is very useful. It gives me key points from emails quickly, so I do not read everything.',
    name: 'Sneha Gupta',
    role: 'UI/UX Designer',
    avatar: avatarMark,
  },
  {
    id: 'rohan-mehta',
    quote:
      'AirMouse is really smooth and fun to use. The hand gestures feel natural, and controlling the cursor without a mouse feels impressive.',
    name: 'Rohan Mehta',
    role: 'Frontend Developer',
    avatar: avatarOmar,
  },
];

/* Breakpoint Hook (Desktop >=1280px, Tablet 810px-1279px, Mobile <810px) */
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

/* Card inner content shared across all breakpoints */
function TestimonialCardContent({ item }) {
  const [isTapped, setIsTapped] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0, isTouch: false });
  const animTimeoutRef = useRef(null);

  const handlePointerDown = (e) => {
    // Only track touch interactions for tap animation
    // Mouse clicks rely on CSS hover
    if (e.pointerType === 'touch') {
      touchStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
        isTouch: true,
      };
    } else {
      touchStartRef.current.isTouch = false;
    }
  };

  const handlePointerUp = (e) => {
    if (!touchStartRef.current.isTouch) return;

    const dx = Math.abs(e.clientX - touchStartRef.current.x);
    const dy = Math.abs(e.clientY - touchStartRef.current.y);
    const duration = Date.now() - touchStartRef.current.time;

    // A real tap: finger moved less than 10px and was released within 400ms
    // Scrolling the page by dragging over the card will NOT trigger the animation
    if (dx < 10 && dy < 10 && duration < 400) {
      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }
      // Restart animation cleanly without jumping
      setIsTapped(false);
      requestAnimationFrame(() => {
        setIsTapped(true);
      });
      animTimeoutRef.current = setTimeout(() => {
        setIsTapped(false);
      }, 550);
    }

    touchStartRef.current.isTouch = false;
  };

  const handlePointerCancel = () => {
    touchStartRef.current.isTouch = false;
  };

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }
    };
  }, []);

  return (
    <figure
      tabIndex={0}
      aria-label={`Testimonial from ${item.name}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onAnimationEnd={() => setIsTapped(false)}
      className={`testimonial-card relative w-full rounded-[20px] bg-[#111111] p-[20px] flex flex-col justify-between overflow-hidden select-none h-auto tablet:min-h-[340px] desktop:h-[340px] cursor-default ${
        isTapped ? 'is-tapped' : ''
      }`}
    >
      {/* Subtle Grain Overlay on Card */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{
          backgroundImage: `url(${grainImg})`,
          backgroundRepeat: 'repeat',
          opacity: 0.12,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Quote Text */}
      <blockquote className="relative z-[2]">
        <p className="font-sans font-normal text-[#FAF7F3] text-[18px] leading-[1.4] tracking-[-0.04em]">
          {item.quote}
        </p>
      </blockquote>

      {/* Author Row Pinned to Bottom */}
      <figcaption className="relative z-[2] mt-6 desktop:mt-auto pt-2 flex items-center gap-[8px]">
        <img
          src={item.avatar}
          alt={item.name}
          loading="lazy"
          className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col gap-0 justify-center">
          <span className="font-sans font-medium text-[#FAF7F3] text-[16px] leading-[1.4] tracking-[-0.04em]">
            {item.name}
          </span>
          <span className="font-sans font-light text-[#FAF7F3] text-[16px] leading-[1.4] tracking-[-0.04em]">
            {item.role}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

/* ============================================================
   One-time 360 degree spinning entrance card component
   ============================================================ */
function SpinningTestimonialCard({ item, index, isMobile, prefersReducedMotion }) {
  const [isSettled, setIsSettled] = useState(false);
  const hasPlayed = playedOnce.has('testimonials');

  // Respect prefers-reduced-motion or previously played: immediate flat display with zero spin
  if (prefersReducedMotion || hasPlayed) {
    return (
      <div className="w-full h-full">
        <TestimonialCardContent item={item} />
      </div>
    );
  }

  return (
    // DEFAULT - not from MCP: perspective 1200px container
    <div
      className="w-full h-full"
      style={{
        perspective: '1200px', // DEFAULT - not from MCP
      }}
    >
      <motion.div
        // DEFAULT - not from MCP: 360deg horizontal rotation from rotateY(-360deg) to 0deg, opacity 0 to 1
        initial={{ rotateY: -360, opacity: 0 }}
        whileInView={{ rotateY: 0, opacity: 1 }}
        // DEFAULT - not from MCP: trigger when 25% of card enters viewport, plays only once per page load
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 1.1, // DEFAULT - not from MCP: duration 1.1s
          ease: [0.22, 1, 0.36, 1], // DEFAULT - not from MCP: cubic-bezier(0.22, 1, 0.36, 1)
          delay: isMobile ? 0 : index * 0.12, // DEFAULT - not from MCP: 0.12s stagger left-to-right (Mobile triggers per-card)
        }}
        onAnimationComplete={() => {
          setIsSettled(true);
          playedOnce.add('testimonials');
        }}
        style={{
          transformOrigin: 'center center', // DEFAULT - not from MCP: center origin
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: isSettled ? 'auto' : 'transform, opacity',
        }}
        className="w-full h-full"
      >
        <TestimonialCardContent item={item} />
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return (
    <section
      id="testimonials"
      className="w-full bg-transparent pt-[var(--gap-projects-testimonials)] pb-0 scroll-mt-20 overflow-x-clip"
    >
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        {/* Section Heading: Framer Heading 2 (Archivo-semibold, 68px/58px/48px, -0.02em, 1em leading) */}
        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans font-semibold font-[600] text-[#111111] text-[46px] tablet:text-[62px] desktop:text-[76px] leading-[1em] tracking-[-0.02em] select-none"
        >
          Testimonials
        </motion.h2>

        {/* 4 Cards: 4 in row on Desktop, 2x2 on Tablet, 1-col on Mobile with 16px gap */}
        <ul
          role="list"
          className="mt-10 tablet:mt-[60px] desktop:mt-[60px] grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-[16px] w-full items-stretch"
        >
          {TESTIMONIALS.map((item, index) => (
            <li key={item.id} className="w-full h-full flex">
              <SpinningTestimonialCard
                item={item}
                index={index}
                isMobile={isMobile}
                prefersReducedMotion={prefersReducedMotion}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Testimonials;
