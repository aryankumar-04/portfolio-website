import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { BackButton } from '../components/BackButton';
import { workItems } from '../data/work';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ROUTE_TITLES } from '../config/site';

export const WorkArchive: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(ROUTE_TITLES.projects);

  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'A showcase of my latest projects, highlighting thoughtful design, clear strategy, and impactful results.'
      );
    }
  }, []);

  // Scroll pop-up animation for project cards via IntersectionObserver
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.work-project-card'));
    if (cards.length === 0) return;

    let observer: IntersectionObserver | null = null;
    let initialBatchHandled = false;

    // Double rAF ensures browser has painted layout at scroll 0 before animating
    const rafId = requestAnimationFrame(() => {
      grid.classList.add('has-scroll-anim');

      requestAnimationFrame(() => {
        observer = new IntersectionObserver(
          (entries) => {
            const intersecting = entries.filter((e) => e.isIntersecting);

            if (!initialBatchHandled) {
              initialBatchHandled = true;
              intersecting.forEach((entry, idx) => {
                const el = entry.target as HTMLElement;
                el.style.setProperty('--card-stagger-delay', `${idx * 100}ms`);
                el.classList.add('is-in-view');
                observer?.unobserve(el);
              });
            } else {
              intersecting.forEach((entry) => {
                const el = entry.target as HTMLElement;
                const cardIndex = Number(el.dataset.cardIndex ?? 0);
                const scrollStagger = (cardIndex % 2) * 80;
                el.style.setProperty('--card-stagger-delay', `${scrollStagger}ms`);
                el.classList.add('is-in-view');
                observer?.unobserve(el);
              });
            }
          },
          {
            rootMargin: '0px 0px -20px 0px',
            threshold: 0.05,
          }
        );

        cards.forEach((card) => {
          const onTransitionEnd = (e: TransitionEvent) => {
            if (e.target === card && e.propertyName === 'transform') {
              card.classList.add('is-settled');
              card.classList.remove('is-in-view');
              card.removeEventListener('transitionend', onTransitionEnd);
            }
          };
          card.addEventListener('transitionend', onTransitionEnd);

          observer?.observe(card);
        });
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, []);

  return (
    <main className="w-full bg-[#FAF7F3] pt-[var(--work-pt)] pb-[var(--work-pb)]">
      <div className="w-full max-w-[var(--work-container-max-w)] mx-auto px-[var(--work-container-px)] flex flex-col gap-[var(--work-container-gap)]">
        {/* Back Button & Heading block */}
        <div className="flex flex-col gap-[10px] w-full items-start text-left">
          {/* Back Button */}
          <BackButton />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#111111] text-[var(--work-h1-font-size)] font-[var(--work-h1-font-weight)] leading-[1em] tracking-[-0.02em] max-w-[var(--work-h1-max-w)] m-0"
            style={{
              fontFamily: 'var(--work-font-family)',
              fontStyle: 'var(--work-font-style)',
              fontSize: 'var(--work-h1-font-size)',
              fontWeight: 'var(--work-h1-font-weight)',
            }}
          >
            My Brightest Creations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#111111] text-[var(--work-sub-font-size)] font-[var(--work-sub-font-weight)] leading-[1.4em] tracking-[-0.04em] max-w-[var(--work-sub-max-w)] m-0"
            style={{
              fontFamily: 'var(--work-font-family)',
              fontStyle: 'var(--work-font-style)',
              fontSize: 'var(--work-sub-font-size)',
              fontWeight: 'var(--work-sub-font-weight)',
            }}
          >
            A showcase of my latest projects, highlighting thoughtful design, clear strategy, and impactful results.
          </motion.p>
        </div>

        {/* 2-Column Desktop & Tablet / 1-Column Mobile Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 tablet:grid-cols-2 gap-[var(--work-grid-gap)] w-full"
        >
          {workItems.map((item, index) => (
            <ProjectCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default WorkArchive;
