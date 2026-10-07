import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playedOnce } from './utils/playedOnce';
import { AnimatedArrowBox } from './components/AnimatedArrowBox';

import blog1Img from './assets/blog/images/1-card.webp';
import blog2Img from './assets/blog/images/2-card.webp';
import blog3Img from './assets/blog/images/3-card.webp';


const POSTS = [
  {
    id: 'the-2026-entry-level-developer-market',
    date: 'Oct 2, 2026',
    title: 'The 2026 Entry-Level Developer Market, India vs the World',
    description:
      'What freshers actually face in India, the US and Europe, and where the real openings are hiding.',
    image: blog1Img,
    href: '/blog/the-2026-entry-level-developer-market',
    tabletOnly: false,
  },
  {
    id: 'skills-that-survive-ai-coding-assistants',
    date: 'Aug 24, 2026',
    title: 'Skills That Survive AI Coding Assistants',
    description:
      'When autocomplete writes the boilerplate, these are the abilities that still make a developer valuable.',
    image: blog2Img,
    href: '/blog/skills-that-survive-ai-coding-assistants',
    tabletOnly: false,
  },
  {
    id: 'how-indian-freshers-get-hired-without-campus-placement',
    date: 'Jul 15, 2026',
    title: 'How Indian Freshers Get Hired Without Campus Placement',
    description:
      'A practical off-campus route built on proof of work, smart applications and well-aimed outreach.',
    image: blog3Img,
    href: '/blog/how-indian-freshers-get-hired-without-campus-placement',
    tabletOnly: true,
  },
];

export function Thoughts() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hasPlayed = playedOnce.has('thoughts');

  return (
    <section
      id="thoughts"
      className="w-full bg-transparent pt-[80px] tablet:pt-[100px] desktop:pt-[120px] pb-0 scroll-mt-20 flex justify-center"
    >
      <div className="w-full max-w-full tablet:max-w-[900px] desktop:max-w-[1180px] mx-auto px-[20px] tablet:px-[30px] desktop:px-0">
        {/* Section Heading: Exact Framer Heading 2 preset */}
        <motion.h2
          initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans font-semibold font-[600] text-[#111111] text-[46px] tablet:text-[62px] desktop:text-[76px] leading-[1em] tracking-[-0.02em] mb-[40px] tablet:mb-[60px] desktop:mb-[60px] select-none text-left"
        >
          Thoughts
        </motion.h2>

        {/* Cards Grid: 1 col on Mobile, 2 cols on Tablet, 3 cols on Desktop */}
        <ul
          role="list"
          className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-[16px] w-full items-stretch"
        >
          {POSTS.map((post, index) => (
            <motion.li
              key={post.id}
              initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : index * 0.1,
              }}
              onAnimationComplete={() => playedOnce.add('thoughts')}
              className={`h-[460px] w-full ${post.tabletOnly ? 'hidden tablet:flex desktop:hidden' : 'flex'}`}
            >
              <article className="w-full h-full">
                <Link
                  to={post.href}
                  state={{ fromInternal: true }}
                  className="group relative w-full h-[460px] rounded-[20px] overflow-hidden flex flex-col justify-end p-[20px] select-none block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] cursor-pointer"
                >

                  {/* Background Image with Framer Spring-like Hover Zoom (104%) */}
                  <img
                    src={post.image}
                    alt={`${post.title} cover`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center will-change-transform transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                  />

                  {/* Dark gradient overlay at bottom: exact 70% height from rgba(84,84,84,0) to rgb(0,0,0) */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 w-full h-[70%] pointer-events-none rounded-b-[20px] z-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(84, 84, 84, 0) 0%, rgb(0, 0, 0) 100%)',
                    }}
                  />

                  {/* Content container: gap 10px */}
                  <div className="relative z-[2] flex flex-col gap-[10px] w-full text-left">
                    {/* Title & Date container: gap 5px */}
                    <div className="flex flex-col gap-[5px] w-full">
                      <time
                        dateTime={post.date}
                        className="font-sans font-normal text-[#FAF7F3] text-[16px] leading-[1.4em] tracking-[-0.04em] block"
                      >
                        {post.date}
                      </time>
                      <h3
                        className="font-sans font-medium text-[#FAF7F3] text-[28px] tablet:text-[30px] desktop:text-[32px] leading-[1.2em] tracking-[-0.02em] [text-wrap:balance]"
                      >
                        {post.title}
                      </h3>
                    </div>
                    <p className="font-sans font-normal text-[#FAF7F3] text-[16px] leading-[1.4em] tracking-[-0.04em]">
                      {post.description}
                    </p>
                  </div>
                </Link>
              </article>
            </motion.li>
          ))}

          {/* Third / Fourth Card: Dark Promo Card */}
          <motion.li
            initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: prefersReducedMotion ? 0 : 0.2,
            }}
            className="h-[460px] w-full flex"
          >
            <div className="relative w-full h-[460px] min-h-[460px] rounded-[16px] bg-[#111111] p-[24px] flex flex-col justify-between items-start overflow-hidden select-none">
              {/* Statement heading: exact Framer 44px Body preset */}
              <div className="w-full text-left">
                <p className="font-sans font-normal text-[#FAF7F3] text-[40px] tablet:text-[42px] desktop:text-[44px] leading-[1.2em] tracking-[-0.02em]">
                  See how we shape brands with clarity and craft— explore our blog
                </p>
              </div>

              {/* Bottom "View All Work" link: exact Framer Text Arrow Button White variant */}
              <div className="w-auto">
                <Link
                  to="/blog"
                  state={{ fromInternal: true }}
                  className="group inline-flex flex-row items-center gap-[10px] text-[#FAF7F3] select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF7F3]"
                >
                  <span className="font-sans font-normal font-[400] text-[18px] leading-[1.4em] tracking-[-0.04em] whitespace-pre text-[#FAF7F3]">
                    View All Blogs
                  </span>
                  <AnimatedArrowBox variant="dark" size="md" direction="up-right" />
                </Link>
              </div>
            </div>
          </motion.li>
        </ul>
      </div>
    </section>
  );
}

export default Thoughts;
