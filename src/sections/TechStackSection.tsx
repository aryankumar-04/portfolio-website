import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TECH_STACK_CATEGORIES } from '../data/techStackData';
import { playedOnce } from '../utils/playedOnce';

export const TechStackSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const hasPlayed = playedOnce.has('tech-stack');

  return (
    <section
      id="tech-stack"
      className="w-full bg-transparent py-[80px] tablet:py-[100px] desktop:py-[120px] scroll-mt-20 overflow-hidden"
      style={{ fontSynthesis: 'none' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        {/* Section Heading: "MY STACK" */}
        <motion.h2
          initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="services-heading text-[46px] tablet:text-[62px] desktop:text-[76px] font-semibold text-[#111111] leading-[0.95em] tracking-[-0.03em] uppercase select-none mb-12 tablet:mb-16 desktop:mb-20 m-0"
          style={{ fontFamily: 'var(--services-font-family, Archivo, sans-serif)' }}
        >
          MY STACK
        </motion.h2>

        {/* Categories Stack */}
        <div className="flex flex-col gap-12 tablet:gap-14 desktop:gap-16 w-full">
          {TECH_STACK_CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{
                duration: 0.7,
                delay: prefersReducedMotion ? 0 : (catIndex + 1) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={() => playedOnce.add('tech-stack')}
              className="flex flex-col tablet:flex-row tablet:items-start gap-4 tablet:gap-8 desktop:gap-12 w-full"
            >
              {/* Category Name Column */}
              <div className="w-full tablet:w-[200px] desktop:w-[240px] shrink-0">
                <h3
                  className="font-bold uppercase text-[#111111] tracking-[-0.02em] text-[28px] tablet:text-[30px] desktop:text-[32px] leading-none tablet:leading-[28px] desktop:leading-[32px] select-none m-0"
                  style={{ fontFamily: 'var(--services-font-family, Archivo, sans-serif)' }}
                >
                  {category.title}
                </h3>
              </div>

              {/* Technologies Wrapping Row */}
              <div className="flex-1 flex flex-wrap items-center gap-x-8 gap-y-5 tablet:gap-x-10 tablet:gap-y-6 desktop:gap-x-12 desktop:gap-y-7">
                {category.items.map((tech) => (
                  <div
                    key={tech.name}
                    className="inline-flex items-center gap-2.5 tablet:gap-3 shrink-0"
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="w-[26px] h-[26px] tablet:w-[28px] tablet:h-[28px] desktop:w-[32px] desktop:h-[32px] shrink-0 object-contain select-none"
                    />
                    <span className="font-sans font-normal text-[#111111] text-[16px] tablet:text-[17px] desktop:text-[18px] leading-none whitespace-nowrap select-none">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
