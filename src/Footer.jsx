import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Footer Pill Link with Framer vertical text-roll hover animation.
 * Two stacked copies of the label inside an overflow-hidden wrapper.
 */
function FooterPill({ text, targetId, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const shouldRoll = isHovered || isFocused;

  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => onClick(e, targetId)}
      onMouseEnter={() => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="relative inline-flex items-center justify-center h-[38px] tablet:h-[42px] desktop:h-[44px] px-4 tablet:px-[18px] desktop:px-[20px] rounded-[8px] tablet:rounded-[10px] bg-[#FAF7F3] hover:bg-white text-[#111111] font-sans font-medium text-[15px] tablet:text-[16px] desktop:text-[18px] tracking-[-0.02em] select-none transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 active:scale-95 shadow-none"
    >
      {/* 44px min touch target on mobile */}
      <span className="absolute -inset-1 block tablet:hidden pointer-events-auto" aria-hidden="true" />
      <div className="relative h-[1.3em] overflow-hidden flex flex-col justify-start select-none">
        <motion.span
          animate={{ y: shouldRoll ? '-100%' : '0%' }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
          className="block text-[#111111] leading-[1.3em]"
        >
          {text}
        </motion.span>
        <motion.span
          animate={{ y: shouldRoll ? '-100%' : '0%' }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
          aria-hidden="true"
          className="block text-[#111111] leading-[1.3em]"
        >
          {text}
        </motion.span>
      </div>
    </a>
  );
}

export function Footer() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();

    const isHome = location.pathname === '/';

    if (targetId === 'hero' || targetId === 'top') {
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
      navigate('/#' + targetId);
    }
  };

  return (
    <footer className="relative w-full bg-[#111111] overflow-clip select-none pt-[80px] tablet:pt-[100px] desktop:pt-[120px] pb-[200px] tablet:pb-[300px] desktop:pb-[300px]">
      {/* Subtle Grain Overlay on Footer */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'var(--noise-texture)',
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
          opacity: 0.04,
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative z-[2] max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        {/* Desktop Layout: Heading on Left, Columns on Right */}
        {/* Tablet Layout: Heading on Top, 2 Columns Side-by-Side Below */}
        {/* Mobile Layout: Single Column Stacked */}
        <div className="flex flex-col desktop:flex-row desktop:justify-between desktop:items-start gap-12 tablet:gap-[60px] desktop:gap-8 w-full">
          {/* Column 1 / Top Heading: Scaling Start-ups for Growth. */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full desktop:max-w-[360px] shrink-0"
          >
            {/* Desktop 3-line wrap: Scaling / Start-ups / for Growth. */}
            {/* Tablet & Mobile wrap: Scaling / Start-ups for / Growth. */}
            <h2 className="hidden desktop:block font-sans font-semibold text-[#FAF7F3] text-[72px] leading-[1.05em] tracking-[-0.02em]">
              Scaling<br />
              Start-ups<br />
              for Growth.
            </h2>
            <h2 className="block desktop:hidden font-sans font-semibold text-[#FAF7F3] text-[48px] tablet:text-[64px] leading-[1.05em] tracking-[-0.02em]">
              Scaling<br />
              Start-ups for<br />
              Growth.
            </h2>
          </motion.div>

          {/* Columns Wrapper: Side-by-side on Tablet & Desktop, Stacked on Mobile */}
          <div className="flex flex-col tablet:flex-row tablet:justify-start desktop:justify-between w-full desktop:max-w-[720px] gap-10 tablet:gap-14 desktop:gap-8">
            {/* Column 2: /Quick links with wrapping pills */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="w-full tablet:max-w-[380px] desktop:max-w-[380px]"
            >
              <h3 className="font-sans font-medium text-[#FAF7F3] text-[22px] tablet:text-[24px] desktop:text-[26px] leading-tight tracking-normal mb-5 tablet:mb-6">
                /Quick links
              </h3>

              <nav aria-label="Footer quick links">
                <div className="flex flex-wrap gap-[10px] tablet:gap-[12px] max-w-[380px]">
                  <FooterPill text="Home" targetId="hero" onClick={handleNavClick} />
                  <FooterPill text="About Me" targetId="about" onClick={handleNavClick} />
                  <FooterPill text="Education" targetId="education" onClick={handleNavClick} />
                  <FooterPill text="Projects" targetId="projects" onClick={handleNavClick} />
                  <FooterPill text="Contact" targetId="contact" onClick={handleNavClick} />
                </div>
              </nav>
            </motion.div>

            {/* Column 3: /Contact with Email */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="w-full tablet:max-w-[280px] desktop:max-w-[280px]"
            >
              <h3 className="font-sans font-medium text-[#FAF7F3] text-[22px] tablet:text-[24px] desktop:text-[26px] leading-tight tracking-normal mb-5 tablet:mb-6">
                /Contact
              </h3>

              <a
                href="mailto:contact.aryankgupta@gmail.com"
                onClick={(e) => e.stopPropagation()}
                className="inline-block font-sans font-normal text-[#FAF7F3] text-[18px] tablet:text-[18px] desktop:text-[18px] leading-normal tracking-[-0.03em] hover:underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                contact.aryankgupta@gmail.com
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gigantic "ARYAN" Wordmark cropped by the bottom edge */}
      <motion.div
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="w-full absolute inset-x-0 -bottom-[10px] tablet:-bottom-[50px] desktop:-bottom-[100px] flex justify-center items-end select-none pointer-events-none z-[1]"
      >
        <span
          className="font-sans font-bold uppercase tracking-[-0.02em] leading-[0.9em] whitespace-nowrap block text-center text-[clamp(90px,32.7vw,128px)] tablet:text-[clamp(180px,32.7vw,265px)] desktop:text-[clamp(280px,22vw,417px)]"
          style={{
            color: 'rgba(250, 247, 243, 0.1)',
          }}
        >
          ARYAN
        </span>
      </motion.div>
    </footer>
  );
}

export default Footer;
