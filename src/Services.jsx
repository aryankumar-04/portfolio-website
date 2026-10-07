import React from 'react';
import { motion } from 'framer-motion';
import { playedOnce } from './utils/playedOnce';

/**
 * Services section for Majd's portfolio / Framer template replica.
 * Semantic HTML with #services anchor target for Navbar.
 */
const SERVICES = [
  {
    id: 'ai-powered-applications',
    title: 'AI-Powered Applications',
    tags: ['AI Integration', 'Intelligent Tools', 'API Development'],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    tags: ['React', 'Next.js', 'Responsive Interfaces'],
  },
  {
    id: 'computer-vision-solutions',
    title: 'Computer Vision Solutions',
    tags: ['OpenCV', 'MediaPipe', 'Real-Time Vision'],
  },
  {
    id: 'automation-workflows',
    title: 'Automation & Workflows',
    tags: ['n8n', 'API Automation', 'Workflow Design'],
  },
  {
    id: 'product-prototyping',
    title: 'Product Prototyping',
    tags: ['Ideas to MVP', 'Full-Stack Builds', 'User Experience'],
  },
];

export function Services() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hasPlayed = playedOnce.has('services');

  return (
    <section
      id="services"
      className="w-full bg-transparent pt-[var(--gap-quote-services)] pb-0 scroll-mt-20"
      style={{ fontSynthesis: 'none' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        {/* Section Heading */}
        <motion.h2
          initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="services-heading text-[#111111] leading-[0.95em] tracking-[-0.03em] select-none"
        >
          Services
        </motion.h2>

        {/* Services List */}
        <ul
          role="list"
          className="mt-12 tablet:mt-16 desktop:mt-20 flex flex-col w-full"
        >
          {SERVICES.map((service, index) => (
            <motion.li
              key={service.id}
              initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : index * 0.08,
              }}
              onAnimationComplete={() => playedOnce.add('services')}
              className="group border-b border-[#111111]/10 py-6 tablet:py-7 desktop:py-0 desktop:min-h-[120px] flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-3 tablet:gap-6 transition-colors duration-300"
            >
              {/* Service Name */}
              <h3 className="services-item-title text-[#111111] leading-[1.2em] tracking-[-0.02em] will-change-transform transition-transform duration-300 ease-out group-hover:translate-x-1.5 select-none">
                {service.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-[8px] tablet:gap-[10px] leading-[1.4em] tracking-[-0.03em] select-none">
                {service.tags.map((tag, tagIdx) => (
                  <React.Fragment key={tag}>
                    <p className="services-tag text-[#111111]/50 m-0">{tag}</p>
                    {tagIdx < service.tags.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="w-[4px] h-[4px] rounded-full bg-[#111111] shrink-0 inline-block"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Services;
