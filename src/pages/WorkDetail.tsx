import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { workItems } from '../data/work';
import { WorkSection } from '../types/cms';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ROUTE_TITLES } from '../config/site';
import { AnimatedArrowBox } from '../components/AnimatedArrowBox';
import { ImageLightboxModal } from '../components/ImageLightboxModal';

/* ============================================================
   Reduced-motion & hover detection (read once, no re-renders)
   ============================================================ */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   framer-motion shared presets
   ============================================================ */
const fadeUp = (delay = 0) =>
  prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
      };

const fadeUpInView = (delay = 0) =>
  prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
      };


/* ============================================================
   Section renderers
   ============================================================ */
const TextSection: React.FC<{ section: Extract<WorkSection, { type: 'text' }>; index: number }> = ({
  section,
}) => (
  <motion.div {...fadeUpInView(0)} className="flex flex-col gap-4">
    <h2 className="project-heading text-[#111111] leading-[1.2em] tracking-[-0.02em]">
      {section.heading}
    </h2>
    {section.paragraphs.map((p, i) => (
      <p
        key={i}
        className="project-body text-[#111111]/70 leading-[1.6em] tracking-[-0.02em]"
      >
        {p}
      </p>
    ))}
  </motion.div>
);

const GallerySection: React.FC<{
  section: Extract<WorkSection, { type: 'gallery' }>;
  title: string;
  onImageClick: (src: string, alt: string, triggerEl: HTMLElement) => void;
}> = ({ section, title, onImageClick }) => (
  <motion.div
    {...fadeUpInView(0)}
    className="grid grid-cols-1 tablet:grid-cols-2 gap-4 tablet:gap-6 desktop:gap-8 w-full"
  >
    {section.images.map((src, i) => {
      const alt =
        title === 'Hill Climbing Race' && i === 1
          ? 'Hill Climbing Race gameplay screen'
          : `${title} detail ${i + 1}`;
      return (
        <div
          key={i}
          role="button"
          tabIndex={0}
          onClick={(e) => onImageClick(src, alt, e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onImageClick(src, alt, e.currentTarget);
            }
          }}
          className="w-full rounded-[16px] tablet:rounded-[20px] overflow-hidden bg-[#E8E4DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 project-previewable-image select-none"
          style={{ aspectRatio: '4 / 3' }}
          aria-label={`Preview ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      );
    })}
  </motion.div>
);

const CollageSection: React.FC<{
  section: Extract<WorkSection, { type: 'collage' }>;
  title: string;
  onImageClick: (src: string, alt: string, triggerEl: HTMLElement) => void;
}> = ({ section, title, onImageClick }) => {
  const alt =
    title === 'Hill Climbing Race'
      ? 'Hill Climbing Race game overview'
      : `${title} showcase`;
  return (
    <motion.div
      {...fadeUpInView(0)}
      role="button"
      tabIndex={0}
      onClick={(e) => onImageClick(section.image, alt, e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onImageClick(section.image, alt, e.currentTarget);
        }
      }}
      className="w-full rounded-[16px] tablet:rounded-[20px] desktop:rounded-[28px] overflow-hidden bg-[#E8E4DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 project-previewable-image select-none"
      style={{ aspectRatio: '16 / 9' }}
      aria-label={`Preview ${alt}`}
    >
      <img
        src={section.image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover pointer-events-none"
      />
    </motion.div>
  );
};

/* ============================================================
   More Projects card (same style as home Featured Projects)
   ============================================================ */
const MoreProjectCard: React.FC<{
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  delay: number;
}> = ({ slug, title, subtitle, image, delay }) => (
  <motion.div {...fadeUpInView(delay)} className="w-full">
    <Link
      to={`/work/${slug}`}
      className="group block w-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-[28px]"
    >
      {/* Image container — same aspect ratio & radius as home cards */}
      <div
        className="w-full relative overflow-hidden rounded-[20px] tablet:rounded-[28px] bg-[#E8E4DF]"
        style={{ aspectRatio: '1.45 / 1' }}
      >
        <img
          src={image}
          alt={`${title} – ${subtitle}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      {/* Title & subtitle */}
      <div className="mt-5 tablet:mt-6">
        <h3 className="project-card-title text-[#111111] leading-tight tracking-[-0.03em] transition-colors duration-300 group-hover:text-[#111111]/80">
          {title}
        </h3>
        <p className="mt-1 tablet:mt-1.5 project-card-cat text-[#111111]/60 leading-normal tracking-[-0.02em]">
          {subtitle}
        </p>
      </div>
    </Link>
  </motion.div>
);

/* ============================================================
   Main Page Component
   ============================================================ */
export const WorkDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Redirect old /work/damas to /work/arch
  if (slug === 'damas') {
    return <Navigate to="/work/arch" replace />;
  }

  // Redirect old /work/najm to /work/daily-email-digest
  if (slug === 'najm') {
    return <Navigate to="/work/daily-email-digest" replace />;
  }

  // Redirect old /work/kavi to /work/airmouse
  if (slug === 'kavi') {
    return <Navigate to="/work/airmouse" replace />;
  }

  // Redirect old /work/sham to /work/cenivo
  if (slug === 'sham') {
    return <Navigate to="/work/cenivo" replace />;
  }

  // Redirect old /work/abjad to /work/hill-climbing-race
  if (slug === 'abjad') {
    return <Navigate to="/work/hill-climbing-race" replace />;
  }

  // Redirect old /work/faseelh to /work/games-gadgets-haven
  if (slug === 'faseelh' || slug === 'fasselh') {
    return <Navigate to="/work/games-gadgets-haven" replace />;
  }

  const item = useMemo(
    () =>
      workItems.find(
        (w) => w.slug === slug
      ),
    [slug]
  );

  // Get "More Projects" — next 2 projects excluding current (only from featured: arch, daily-email-digest, airmouse, cenivo, hill-climbing-race, games-gadgets-haven)
  const moreProjects = useMemo(() => {
    if (!item) return [];
    const featured = workItems.filter(
      (w) =>
        [
          'arch',
          'daily-email-digest',
          'airmouse',
          'cenivo',
          'hill-climbing-race',
          'games-gadgets-haven',
        ].includes(w.slug) && w.slug !== item.slug
    );
    return featured.slice(0, 2);
  }, [item]);

  useDocumentTitle(ROUTE_TITLES.projects);

  // Meta description
  useEffect(() => {
    if (item) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', item.description);
      }
    }
  }, [item]);

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/work', { replace: true });
    }
  };

  // Lightbox state for image preview modal
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const activeTriggerRef = useRef<HTMLElement | null>(null);

  const handleOpenLightbox = (src: string, alt: string, triggerEl: HTMLElement) => {
    activeTriggerRef.current = triggerEl;
    setLightboxImage({ src, alt });
  };

  const handleCloseLightbox = () => {
    setLightboxImage(null);
    if (activeTriggerRef.current) {
      activeTriggerRef.current.focus();
    }
  };

  // Escape key shortcut to return to previous page (when no menu, input or modal is focused/open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isInputFocused =
          activeTag === 'input' ||
          activeTag === 'textarea' ||
          activeTag === 'select' ||
          (document.activeElement as HTMLElement)?.isContentEditable;
        const isMenuOpen = document.querySelector('[aria-expanded="true"]') !== null;
        const isModalOpen = Boolean(lightboxImage) || document.querySelector('[role="dialog"]') !== null;
        if (!isInputFocused && !isMenuOpen && !isModalOpen) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, lightboxImage]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverAlign, setPopoverAlign] = useState<'right' | 'left'>('right');
  const popoverRef = useRef<HTMLDivElement>(null);
  const liveLinkBtnRef = useRef<HTMLAnchorElement>(null);

  const hasLive = Boolean(item?.liveLink && item.liveLink.trim());
  const hasGithub = Boolean(item?.githubUrl && item.githubUrl.trim());
  const hasBothLinks = hasLive && hasGithub;
  const directHref = hasLive ? item?.liveLink : (hasGithub ? item?.githubUrl : undefined);

  const handleLiveLinkBoxClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = window.innerWidth <= 810;
    if (isMobile && hasBothLinks) {
      e.preventDefault();
      e.stopPropagation();

      if (!isPopoverOpen && liveLinkBtnRef.current) {
        const rect = liveLinkBtnRef.current.getBoundingClientRect();
        setPopoverAlign(rect.left < 160 ? 'left' : 'right');
      }

      setIsPopoverOpen((prev) => !prev);
    }
  };

  // Close popover when clicking outside
  useEffect(() => {
    if (!isPopoverOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        liveLinkBtnRef.current &&
        !liveLinkBtnRef.current.contains(target)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isPopoverOpen]);

  // Close popover on Escape key
  useEffect(() => {
    if (!isPopoverOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsPopoverOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape, true);
    return () => {
      window.removeEventListener('keydown', handleEscape, true);
    };
  }, [isPopoverOpen]);

  // Close popover on window resize above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 810 && isPopoverOpen) {
        setIsPopoverOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isPopoverOpen]);

  // Redirect if slug not found
  if (!item) {
    return <Navigate to="/" replace />;
  }

  return (
    <article className="w-full bg-transparent">
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0 pt-[100px] tablet:pt-[110px] desktop:pt-[120px] pb-[var(--gap-contact-footer)] flex flex-col gap-10 tablet:gap-12 desktop:gap-16">
        {/* // DEFAULT - not from MCP */}
        <motion.div {...fadeUp(0)} className="-mb-4 tablet:-mb-6 desktop:-mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="group inline-flex items-center gap-2.5 text-[#111111] hover:text-[#111111]/75 transition-colors select-none min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 rounded cursor-pointer"
            aria-label="Go back to previous page"
          >
            <AnimatedArrowBox variant="light" size="sm" direction="left" />
            <span className="font-sans font-medium text-[15px] tablet:text-[16px] tracking-[-0.02em]">
              Back
            </span>
          </button>
        </motion.div>

        {/* ──────────────────── 1. Title ──────────────────── */}
        <motion.h1
          {...fadeUp(0)}
          className="project-title text-[#111111] leading-[0.95em] tracking-[-0.03em] select-none"
        >
          {item.title}
        </motion.h1>

        {/* ──────────────────── 2. Meta Row ──────────────────── */}
        <motion.div
          {...fadeUp(0.1)}
          className="flex flex-col desktop:flex-row desktop:items-start desktop:justify-between gap-6 tablet:gap-8"
        >
          {/* Left: meta items */}
          <div className="flex items-center gap-4 tablet:gap-5 flex-wrap tablet:flex-nowrap shrink-0">
            {/* Category */}
            <div className="flex flex-col gap-1">
              <span className="project-meta-label text-[#111111]/40 tracking-[-0.01em]">
                Category
              </span>
              <span className="project-meta-val text-[#111111] tracking-[-0.02em]">
                {item.category}
              </span>
            </div>

            {/* Slash separator */}
            <span className="project-separator text-[#111111]/20 select-none" aria-hidden="true">
              /
            </span>

            {/* Year */}
            <div className="flex flex-col gap-1">
              <span className="project-meta-label text-[#111111]/40 tracking-[-0.01em]">
                Year
              </span>
              <span className="project-meta-val text-[#111111] tracking-[-0.02em]">
                {item.year}
              </span>
            </div>

            {/* Slash separator */}
            <span className="project-separator text-[#111111]/20 select-none" aria-hidden="true">
              /
            </span>

            {/* Live Link */}
            <div className="relative flex flex-col gap-1">
              <span className="project-meta-val text-[#111111]/40 tracking-[-0.01em]">
                Live Link
              </span>
              <div className="relative inline-flex">
                <a
                  ref={liveLinkBtnRef}
                  href={directHref}
                  onClick={handleLiveLinkBoxClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open live site"
                  aria-haspopup={hasBothLinks ? 'true' : undefined}
                  aria-expanded={hasBothLinks ? isPopoverOpen : undefined}
                  className="group inline-flex items-center justify-center w-[30px] h-[30px] rounded-[7px] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
                >
                  <AnimatedArrowBox variant="live" size="live" direction="up-right" />
                </a>

                {/* Mobile Popover (<=810px) */}
                <AnimatePresence>
                  {isPopoverOpen && (
                    <motion.div
                      ref={popoverRef}
                      role="menu"
                      aria-label="Project links"
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute top-[calc(100%+8px)] ${
                        popoverAlign === 'right' ? 'right-0' : 'left-0'
                      } min-w-[152px] bg-[#FAF7F3] border border-[#111111]/15 rounded-[14px] shadow-[0_12px_32px_rgba(17,17,17,0.12),0_2px_6px_rgba(17,17,17,0.06)] p-1.5 z-50 flex flex-col gap-0.5 tablet:hidden`}
                    >
                      {hasLive && (
                        <a
                          href={item.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          role="menuitem"
                          onClick={() => setIsPopoverOpen(false)}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 min-h-[44px] rounded-[10px] text-[#111111] hover:bg-[#111111]/[0.06] active:bg-[#111111]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] group"
                        >
                          <span className="font-sans font-medium text-[15px] leading-none tracking-[-0.02em]">
                            Live Link
                          </span>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#111111]/40 group-hover:text-[#111111] transition-colors shrink-0"
                            aria-hidden="true"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      )}

                      {hasGithub && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          role="menuitem"
                          onClick={() => setIsPopoverOpen(false)}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 min-h-[44px] rounded-[10px] text-[#111111] hover:bg-[#111111]/[0.06] active:bg-[#111111]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] group"
                        >
                          <span className="font-sans font-medium text-[15px] leading-none tracking-[-0.02em]">
                            GitHub
                          </span>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#111111]/40 group-hover:text-[#111111] transition-colors shrink-0"
                            aria-hidden="true"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Slash separator between Live Link and GitHub (Desktop/Tablet only) */}
            {hasGithub && (
              <span className="project-separator text-[#111111]/20 select-none hidden tablet:inline" aria-hidden="true">
                /
              </span>
            )}

            {/* GitHub (Desktop/Tablet only) */}
            {hasGithub && (
              <div className="hidden tablet:flex flex-col gap-1">
                <span className="project-meta-val text-[#111111]/40 tracking-[-0.01em]">
                  GitHub
                </span>
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub repository"
                  className="group inline-flex items-center justify-center w-[30px] h-[30px] rounded-[7px] shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
                >
                  <AnimatedArrowBox variant="live" size="live" direction="up-right" />
                </a>
              </div>
            )}
          </div>

          {/* Right: description */}
          <p className="project-intro text-[#111111]/70 leading-[1.6em] tracking-[-0.02em] desktop:max-w-[480px]">
            {item.description}
          </p>
        </motion.div>

        {/* ──────────────────── 3. Cover Image ──────────────────── */}
        {(() => {
          const heroAlt =
            item.title === 'Arch'
              ? 'Arch dashboard preview'
              : item.title === 'Daily Email Digest'
              ? 'Daily Email Digest workflow preview'
              : item.title === 'AirMouse'
              ? 'AirMouse hand gesture control preview'
              : item.title === 'Cenivo'
              ? 'Cenivo movie and TV discovery platform preview'
              : item.title === 'Hill Climbing Race'
              ? 'Hill Climbing Race game preview'
              : item.title === 'Games & Gadgets Haven'
              ? 'Games & Gadgets Haven storefront preview'
              : item.title;

          return (
            <motion.div
              {...fadeUp(0.2)}
              role="button"
              tabIndex={0}
              onClick={(e) => handleOpenLightbox(item.images.hero, heroAlt, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenLightbox(item.images.hero, heroAlt, e.currentTarget);
                }
              }}
              className="w-full rounded-[20px] tablet:rounded-[28px] desktop:rounded-[32px] overflow-hidden bg-[#E8E4DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 project-previewable-image select-none"
              style={{ aspectRatio: '16 / 9' }}
              aria-label={`Preview ${item.title} cover image`}
            >
              <img
                src={item.images.hero}
                alt={heroAlt}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />
            </motion.div>
          );
        })()}

        {/* ──────────────────── 4. Article Sections ──────────────────── */}
        <div className="project-content w-full desktop:max-w-[700px] flex flex-col gap-10 tablet:gap-12 desktop:gap-14">
          {item.sections.map((section, index) => {
            switch (section.type) {
              case 'text':
                return <TextSection key={index} section={section} index={index} />;
              case 'gallery':
                return (
                  <div key={index} className="w-full desktop:w-[calc(700px+((100vw-1180px)/2))] desktop:max-w-[1180px]">
                    <GallerySection section={section} title={item.title} onImageClick={handleOpenLightbox} />
                  </div>
                );
              case 'collage':
                return (
                  <div key={index} className="w-full desktop:w-[calc(700px+((100vw-1180px)/2))] desktop:max-w-[1180px]">
                    <CollageSection section={section} title={item.title} onImageClick={handleOpenLightbox} />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* ──────────────────── 5. More Projects ──────────────────── */}
        {moreProjects.length > 0 && (
          <section className="w-full pt-[var(--gap-thoughts-contact)] border-t border-[#111111]/10">
            <motion.h2
              {...fadeUpInView(0)}
              className="project-more-heading text-[#111111] leading-[1em] tracking-[-0.03em] mb-10 tablet:mb-12 desktop:mb-16"
            >
              More Projects
            </motion.h2>

            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-6 tablet:gap-x-8 desktop:gap-x-10 gap-y-12 tablet:gap-y-14 desktop:gap-y-16 w-full">
              {moreProjects.map((project, i) => (
                <MoreProjectCard
                  key={project.slug}
                  slug={project.slug}
                  title={project.title}
                  subtitle={project.shortDescription}
                  image={project.images.hero}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Shared Lightbox Modal Instance */}
      <ImageLightboxModal
        isOpen={Boolean(lightboxImage)}
        image={lightboxImage}
        onClose={handleCloseLightbox}
      />
    </article>
  );
};

export default WorkDetail;
