import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playedOnce } from '../utils/playedOnce';
import { AnimatedArrowBox } from '../components/AnimatedArrowBox';

const PROJECTS = [
  {
    id: 'arch',
    slug: 'arch',
    title: 'Arch',
    subtitle: 'Personal Life OS',
    image: '/projects/arch 1.png',
    href: '/work/arch',
  },
  {
    id: 'daily-email-digest',
    slug: 'daily-email-digest',
    title: 'Daily Email Digest',
    subtitle: 'n8n AI Automation',
    image: '/projects/n8n2 1.png',
    href: '/work/daily-email-digest',
  },
  {
    id: 'airmouse',
    slug: 'airmouse',
    title: 'AirMouse',
    subtitle: 'Windows Desktop App',
    image: '/projects/airmouse 1.png',
    href: '/work/airmouse',
  },
  {
    id: 'cenivo',
    slug: 'cenivo',
    title: 'Cenivo',
    subtitle: 'Full-Stack Web App',
    image: '/projects/cenivo 1.png',
    href: '/work/cenivo',
  },
];

export const ProjectsSection: React.FC = () => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hasPlayed = playedOnce.has('projects');

  return (
    <section
      id="projects"
      className="w-full bg-transparent pt-[var(--gap-services-projects)] pb-0 scroll-mt-20"
    >
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        {/* Section Header: Two-line Title on Left + "View All Work" Link on Far Right */}
        <div className="w-full flex flex-row items-end justify-between gap-4 pb-2">
          <motion.h2
            initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-semibold font-[600] text-[#111111] text-[46px] tablet:text-[62px] desktop:text-[76px] leading-[1em] tracking-[-0.02em] select-none max-w-[460px] m-0"
          >
            Featured<br />Projects
          </motion.h2>

          <motion.div
            initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="shrink-0 mb-1 ml-auto text-right"
          >
            <Link
              to="/work"
              className="featured-view-all-btn group inline-flex items-center gap-2 tablet:gap-2.5 text-[#111111] hover:text-[#111111]/75 transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 rounded"
            >
              <span
                className="tracking-[-0.02em] whitespace-nowrap font-normal font-[400]"
                style={{
                  fontFamily: 'var(--featured-view-all-font-family)',
                  fontStyle: 'var(--featured-view-all-font-style)',
                  fontSize: 'var(--featured-view-all-font-size)',
                  fontWeight: 'var(--featured-view-all-font-weight)',
                }}
              >
                View All Projects
              </span>
              <AnimatedArrowBox variant="light" size="sm" direction="up-right" />
            </Link>
          </motion.div>
        </div>

        {/* 2x2 Grid on Desktop / Tablet (1-column on Mobile) with Framer 16px Gaps */}
        <ul
          role="list"
          className="mt-[36px] tablet:mt-[48px] desktop:mt-[60px] grid grid-cols-1 tablet:grid-cols-2 gap-[16px] w-full"
        >
          {PROJECTS.map((project, index) => (
            <li key={project.id} className="w-full">
              <motion.div
                initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                }}
                onAnimationComplete={() => playedOnce.add('projects')}
                className="w-full"
              >
                <Link
                  to={project.href}
                  className="group block w-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-[20px]"
                >
                  {/* Image Container with ~1.45:1 Aspect Ratio & 20px Radius */}
                  <div
                    className="w-full relative overflow-hidden rounded-[20px] bg-[#E8E4DF]"
                    style={{ aspectRatio: '1.45 / 1' }}
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} – ${project.subtitle}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Title & Subtitle: Framer compact rhythm */}
                  <div className="mt-[14px] tablet:mt-[16px]">
                    <h3 className="font-sans font-medium font-[500] text-[#111111] text-[28px] tablet:text-[30px] desktop:text-[32px] leading-[1.2em] tracking-[-0.04em] transition-colors duration-300 group-hover:text-[#111111]/80 m-0">
                      {project.title}
                    </h3>
                    <p className="mt-[4px] font-sans font-normal font-[400] text-[#111111]/50 text-[16px] leading-[1.4em] tracking-[-0.04em] m-0">
                      {project.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProjectsSection;
