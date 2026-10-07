import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EDUCATION_ITEMS, EducationItem } from '../data/educationData';
import { playedOnce } from '../utils/playedOnce';

export const EducationSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const hasPlayed = playedOnce.has('education');

  return (
    <section
      id="education"
      className="w-full bg-transparent pt-0 pb-0 scroll-mt-20"
      style={{ fontSynthesis: 'none' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        {/* Section Heading */}
        <motion.h2
          initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="edu-cert-heading text-[#111111] leading-[0.95em] tracking-[-0.03em] select-none m-0"
        >
          Education
        </motion.h2>

        {/* Education Rows List */}
        <ul
          role="list"
          className="mt-[var(--edu-cert-heading-gap)] flex flex-col gap-[var(--edu-cert-row-gap)] w-full"
        >
          {EDUCATION_ITEMS.map((item: EducationItem, index: number) => (
            <motion.li
              key={item.id}
              initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : index * 0.1,
              }}
              onAnimationComplete={() => playedOnce.add('education')}
              className="group py-0 flex flex-row items-center gap-4 tablet:gap-6 desktop:gap-8 transition-colors duration-300 w-full"
            >
              {/* School Logo */}
              <div
                className="w-[var(--edu-cert-logo-size)] h-[var(--edu-cert-logo-size)] shrink-0 flex items-center justify-center select-none"
                aria-hidden="true"
              >
                <img
                  src={item.logo}
                  alt={`${item.school} logo`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain object-center select-none"
                  onError={(e) => {
                    // Fallback to initial letter only if image fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement && !target.parentElement.querySelector('span')) {
                      const fallback = document.createElement('span');
                      fallback.className = 'font-sans font-medium text-[20px] tablet:text-[22px] desktop:text-[24px] text-[#111111]/40 select-none';
                      fallback.textContent = item.school.charAt(0);
                      target.parentElement.appendChild(fallback);
                    }
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                {/* School Name & Date (Desktop / Tablet layout: Date at right edge, vertically centered with school name) */}
                <div className="flex items-center justify-between gap-4 w-full">
                  <h3 className="edu-cert-item-title text-[#111111] leading-[1.2em] tracking-[-0.02em] select-none m-0">
                    {item.school}
                  </h3>
                  <span className="edu-date-text text-[#111111]/50 leading-[1.4em] tracking-[-0.02em] whitespace-nowrap text-right select-none hidden tablet:block shrink-0">
                    {item.date}
                  </span>
                </div>

                {/* Sub-line */}
                <p className="edu-sub-line text-[#111111]/50 leading-[1.4em] tracking-[-0.02em] select-none mt-1.5 tablet:mt-2 m-0">
                  {item.degree}
                </p>

                {/* Mobile Date (moves below sub-line, left aligned) */}
                <span className="edu-date-text text-[#111111]/50 leading-[1.4em] tracking-[-0.02em] select-none block tablet:hidden mt-1.5 text-left">
                  {item.date}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EducationSection;
