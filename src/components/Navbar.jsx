import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HERO_LOAD_IN,
  HERO_REMAINING_TRANSITION,
} from '../Hero';

/**
 * Navbar component for Majd's portfolio / Framer template replica.
 *
 * Source of truth: Framer MCP components RR5C5gwf9 (Navbar),
 * ujXukKbGY (Navigation Hamburger), and MFbCLAIgN (Navigation Link).
 *
 * Exact specifications:
 * - Position: fixed, top 20px, horizontally centered (left: 50%, x: -50%), z-index 50.
 * - Width: 320px fixed across Desktop (1280px), Tablet (810px), and Mobile (390px).
 * - Closed height: 60px (padding 12px 16px).
 * - Open height: 259px (padding 12px 16px 20px 16px).
 * - Background: rgb(17, 17, 17) (#111111 / Framer token /Black).
 * - Border radius: 20px.
 * - Morphing 3-dot / X button: 44px x 36px, radius 8px, background rgb(250, 247, 243).
 * - Links: 4 buttons (About Me, Services, Projects, Contact), height 35px, radius 8px.
 * - Scroll contract: Visible only at very top (scrollY <= 10px). Hides on scroll-down and
 *   stays hidden during scroll-up until reaching the very top.
 */

const NAV_LINKS = [
  { text: 'About Me', href: '#about', delay: 0.1 },
  { text: 'Education', href: '#education', delay: 0.2 },
  { text: 'Projects', href: '#projects', delay: 0.3 },
  { text: 'Contact', href: '#contact', delay: 0.4 },
];

/**
 * FIX 2: Individual Link Button with Framer-exact Text-Roll Hover Effect.
 * Uses two stacked copies of the label inside an overflow-hidden wrapper (height 1.2em).
 * On hover, both labels translate upwards by -100% with spring transition.
 * Only triggers hover on pointer-capable devices ((hover: hover)).
 * Also triggers on keyboard focus-visible for accessibility.
 */
function NavLinkItem({ link, onNavClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const shouldRoll = isHovered || isFocused;

  return (
    <motion.div
      initial={{ opacity: 0.001, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{
        type: 'spring',
        duration: 0.8,
        bounce: 0.2,
        delay: link.delay,
      }}
      className="w-full"
    >
      <a
        href={link.href}
        onClick={(e) => onNavClick(e, link.href)}
        onMouseEnter={() => {
          if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-[35px] rounded-[8px] bg-[#faf7f3] hover:bg-white active:scale-[0.98] text-[#111111] font-sans font-medium text-[16px] leading-[1.2] tracking-[-0.02em] px-4 flex items-center justify-start transition-colors duration-200 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#faf7f3]"
      >
        {/* Overflow-hidden text-roll wrapper preserving exact label height */}
        <div className="relative h-[1.2em] overflow-hidden flex flex-col justify-start select-none">
          {/* Primary label copy */}
          <motion.span
            animate={{ y: shouldRoll ? '-100%' : '0%' }}
            transition={{
              type: 'spring',
              duration: 0.4,
              bounce: 0.15,
            }}
            className="block text-[#111111] leading-[1.2em]"
          >
            {link.text}
          </motion.span>

          {/* Secondary duplicate label copy (rolls in from bottom) */}
          <motion.span
            animate={{ y: shouldRoll ? '-100%' : '0%' }}
            transition={{
              type: 'spring',
              duration: 0.4,
              bounce: 0.15,
            }}
            aria-hidden="true"
            className="block text-[#111111] leading-[1.2em]"
          >
            {link.text}
          </motion.span>
        </div>
      </a>
    </motion.div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const isHome = location.pathname === '/';
  const usesHeroIntro = isHome && !prefersReducedMotion;

  // Close on Escape key & Outside Click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Smooth scroll handler for anchor links — works cross-route
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    const isHome = location.pathname === '/';

    if (href === '#' || href === '#hero') {
      if (isHome) {
        if (typeof window !== 'undefined' && window.__lenis) {
          window.__lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        navigate('/');
      }
      return;
    }

    const targetId = href.replace('#', '');

    if (isHome) {
      const element = document.getElementById(targetId);
      if (element) {
        if (typeof window !== 'undefined' && window.__lenis) {
          window.__lenis.scrollTo(element);
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Navigate to home with hash — ScrollToTopOnNavigate handles the scroll
      navigate('/' + href);
    }
  };

  return (
    <div
      ref={navRef}
      style={{
        position: 'fixed',
        top: 'max(20px, calc(20px + env(safe-area-inset-top, 0px)))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
      className="pointer-events-auto select-none w-full flex justify-center px-5 tablet:px-0 tablet:w-auto"
    >
      <motion.div
        initial={
          usesHeroIntro
            ? { opacity: 0, filter: 'blur(4px)' }
            : prefersReducedMotion
              ? false
              : { opacity: 0, y: 20, scale: 0.92 }
        }
        animate={
          usesHeroIntro
            ? { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={
          usesHeroIntro
            ? { ...HERO_LOAD_IN.remaining, ease: HERO_LOAD_IN.ease }
            : {
                ...HERO_REMAINING_TRANSITION,
                delay: isHome ? HERO_REMAINING_TRANSITION.delay : 0,
              }
        }
        className="w-full max-w-[390px] tablet:w-[320px] desktop:w-[320px] flex justify-center"
      >
        <motion.nav
          role="navigation"
          aria-label="Main Navigation"
          animate={{
            height: isOpen ? 259 : 60,
          }}
          transition={{
            type: 'spring',
            duration: 0.8,
            bounce: 0,
          }}
          style={{
            backgroundColor: 'rgb(17, 17, 17)',
            borderRadius: 20,
          }}
          className="w-full max-w-[390px] tablet:w-[320px] desktop:w-[320px] overflow-hidden flex flex-col font-sans shadow-lg"
        >
        {/* Top Header Row (Logo + Hamburger Button) */}
        <div className="w-full h-[60px] px-4 flex items-center justify-between flex-shrink-0">
          {/* Logo ("Aryan") */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="font-sans font-semibold text-[22px] leading-[1.4] tracking-[-0.04em] text-[#faf7f3] hover:opacity-90 active:opacity-75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#faf7f3]/50 rounded cursor-pointer"
          >
            Aryan
          </a>

          {/* FIX 1: Menu Button with Vertical Slide-Swap Icon Animation */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="w-[44px] h-[36px] rounded-[8px] bg-[#faf7f3] hover:bg-[#faf7f3]/90 active:bg-[#faf7f3]/90 relative overflow-hidden flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]"
          >
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              {/* Three-Dot Icon:
                  OPEN: slides DOWN (+36px) and exits through the bottom of the button.
                  CLOSE: slides UP from below (+36px) into the center (0px).
              */}
              <motion.div
                initial={false}
                animate={
                  isOpen
                    ? { y: 36, opacity: 0 }
                    : { y: 0, opacity: 1 }
                }
                transition={{
                  type: 'spring',
                  duration: 0.6,
                  bounce: 0,
                }}
                className="absolute inset-0 flex items-center justify-center gap-[3px]"
              >
                <span className="w-1 h-1 rounded-full bg-[#111111] inline-block" />
                <span className="w-1 h-1 rounded-full bg-[#111111] inline-block" />
                <span className="w-1 h-1 rounded-full bg-[#111111] inline-block" />
              </motion.div>

              {/* X Icon:
                  OPEN: enters from ABOVE (-36px) sliding DOWN into the center (0px).
                  CLOSE: slides UP (-36px) and exits through the top of the button.
              */}
              <motion.div
                initial={false}
                animate={
                  isOpen
                    ? { y: 0, opacity: 1 }
                    : { y: -36, opacity: 0 }
                }
                transition={{
                  type: 'spring',
                  duration: 0.6,
                  bounce: 0,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <span className="absolute w-4 h-[2px] rounded-full bg-[#111111] rotate-45" />
                  <span className="absolute w-4 h-[2px] rounded-full bg-[#111111] -rotate-45" />
                </div>
              </motion.div>
            </div>
          </button>
        </div>

        {/* Dropdown Links Stack */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-5 flex flex-col gap-[10px] w-full"
            >
              {NAV_LINKS.map((link) => (
                <NavLinkItem
                  key={link.text}
                  link={link}
                  onNavClick={handleNavClick}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.div>
  </div>
  );
}

export { Navbar };
