import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articles } from '../data/articles.js';
import grainImg from '../assets/grain.png';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { ROUTE_TITLES } from '../config/site.js';
import { AnimatedArrowBox } from '../components/AnimatedArrowBox';
import { getArticleReadRecord, recordArticleRead, formatReadAgo } from '../utils/readHistory.js';
import { ImageLightboxModal } from '../components/ImageLightboxModal';

/* ============================================================
   Reduced-motion detection
   ============================================================ */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fadeUp = (delay = 0) =>
  prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 25 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
      };

const fadeUpInView = (delay = 0) =>
  prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 25 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
      };

/* ============================================================
   Newsletter Submission Helper
   ============================================================ */
// TODO: connect your endpoint
async function submitNewsletter(email) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 800);
      controller.signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('Request timed out. Please try again.'));
      });
    });
    clearTimeout(timeoutId);
    return { success: true };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/* ============================================================
   Newsletter Card Component
   ============================================================ */
function NewsletterCard({ idPrefix = 'desktop' }) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const lastSubmitTimeRef = useRef(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // Honeypot check (bot detection)
    if (honeypot) {
      setStatus('success');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email.');
      setStatus('error');
      return;
    }

    if (trimmedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    // Rate limiting: 1 submit per 30 seconds
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 30000) {
      setErrorMessage('Please wait a moment before subscribing again.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      await submitNewsletter(trimmedEmail);
      lastSubmitTimeRef.current = Date.now();
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Unable to subscribe at this moment. Please try again.');
    }
  };

  return (
    <div className="relative w-full rounded-[24px] tablet:rounded-[28px] bg-[#111111] p-6 tablet:p-7 desktop:p-8 flex flex-col overflow-hidden shadow-md select-none">
      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[24px] tablet:rounded-[28px]"
        style={{
          backgroundImage: `url(${grainImg})`,
          backgroundRepeat: 'repeat',
          opacity: 0.12,
          mixBlendMode: 'overlay',
        }}
      />

      <div className="relative z-[2] flex flex-col">
        <h5
          className="text-white tracking-[-0.02em] leading-snug m-0"
          style={{
            fontFamily: 'var(--work-font-family)',
            fontStyle: 'normal',
            fontSize: 'var(--article-newsletter-title-font-size)',
            fontWeight: 'var(--article-newsletter-title-font-weight)',
          }}
        >
          Join the newsletter
        </h5>
        <p
          className="text-white/70 mt-1.5 leading-normal m-0"
          style={{
            fontFamily: 'var(--work-font-family)',
            fontStyle: 'normal',
            fontSize: 'var(--article-newsletter-sub-font-size)',
            fontWeight: 'var(--article-newsletter-sub-font-weight)',
          }}
        >
          Be the first to read our articles.
        </p>

        {status === 'success' ? (
          <div className="mt-5 py-4 px-4 rounded-[12px] bg-white/10 border border-white/15 text-center">
            <p
              className="text-white m-0"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Thanks for subscribing!
            </p>
            <p
              className="text-white/70 text-[12px] mt-1 m-0"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontWeight: 400,
              }}
            >
              You will receive our latest updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col">
            {/* Visually hidden honeypot */}
            <input
              type="text"
              name="b_newsletter_hp"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="sr-only"
              aria-hidden="true"
            />

            {/* Email Label (visually hidden) */}
            <label htmlFor={`newsletter-email-${idPrefix}`} className="sr-only">
              Email address
            </label>

            <input
              id={`newsletter-email-${idPrefix}`}
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Enter your email"
              className="w-full h-[46px] px-4 rounded-[12px] bg-transparent border border-white/20 text-white placeholder-white/40 text-[16px] focus:outline-none focus:border-white transition-colors"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontWeight: 400,
              }}
            />

            {status === 'error' && errorMessage && (
              <p
                className="text-[#FF8080] text-[12px] mt-2 m-0"
                style={{
                  fontFamily: 'var(--work-font-family)',
                  fontStyle: 'normal',
                }}
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full h-[46px] rounded-[12px] bg-white text-[#111111] tracking-[-0.01em] hover:bg-white/90 active:scale-[0.98] transition-all duration-200 mt-3 flex items-center justify-center disabled:opacity-60 cursor-pointer"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontSize: 'var(--article-newsletter-btn-font-size)',
                fontWeight: 'var(--article-newsletter-btn-font-weight)',
              }}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Block Renderer Component
   ============================================================ */
function BlockRenderer({ blocks }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="flex flex-col gap-6 tablet:gap-7 desktop:gap-8 mt-10 tablet:mt-12 desktop:mt-14 w-full">
      {blocks.map((block, index) => {
        if (block.type === 'heading' || block.type === 'h2') {
          return (
            <motion.h2
              key={index}
              {...fadeUpInView(0)}
              className="text-[#111111] leading-[1.12em] tracking-[-0.025em] mt-4 m-0"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontSize: 'var(--article-h2-font-size)',
                fontWeight: 'var(--article-h2-font-weight)',
              }}
            >
              {block.text}
            </motion.h2>
          );
        }

        if (block.type === 'subheading' || block.type === 'h5' || block.type === 'h3') {
          return (
            <motion.h3
              key={index}
              {...fadeUpInView(0)}
              className="article-subheading text-[#111111] leading-[1.2em] tracking-[-0.02em] mt-2 m-0"
              style={{
                fontFamily: 'var(--article-subheading-font-family, Archivo, "Archivo Placeholder", sans-serif)',
                fontStyle: 'var(--article-subheading-font-style, normal)',
                fontSize: 'var(--article-subheading-font-size)',
                fontWeight: 'var(--article-subheading-font-weight)',
              }}
            >
              {block.text}
            </motion.h3>
          );
        }

        if (block.type === 'quote' || block.type === 'blockquote') {
          return (
            <motion.blockquote
              key={index}
              {...fadeUpInView(0)}
              className="text-[#111111] my-2 pl-4 border-l-2 border-[#111111]/30 leading-[1.65em] m-0"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontSize: 'var(--article-body-font-size)',
                fontWeight: 'var(--article-body-font-weight)',
              }}
            >
              {block.text}
            </motion.blockquote>
          );
        }

        if (block.type === 'paragraph' || block.type === 'p') {
          // Render paragraph with inline links if present
          if (block.links && block.links.length > 0) {
            let renderedContent = [block.text];

            block.links.forEach((link, linkIdx) => {
              const nextContent = [];
              renderedContent.forEach((chunk) => {
                if (typeof chunk === 'string' && chunk.includes(link.text)) {
                  const parts = chunk.split(link.text);
                  parts.forEach((part, pIdx) => {
                    if (part) nextContent.push(part);
                    if (pIdx < parts.length - 1) {
                      nextContent.push(
                        <a
                          key={`link-${linkIdx}-${pIdx}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 decoration-[#111111]/40 hover:decoration-[#111111] text-[#111111] transition-colors"
                          style={{
                            fontFamily: 'var(--work-font-family)',
                            fontStyle: 'normal',
                            fontSize: 'var(--article-body-font-size)',
                            fontWeight: 'var(--article-body-font-weight)',
                          }}
                        >
                          {link.text}
                        </a>
                      );
                    }
                  });
                } else {
                  nextContent.push(chunk);
                }
              });
              renderedContent = nextContent;
            });

            return (
              <motion.p
                key={index}
                {...fadeUpInView(0)}
                className="text-[#111111]/80 leading-[1.65em] tracking-[-0.015em] m-0"
                style={{
                  fontFamily: 'var(--work-font-family)',
                  fontStyle: 'normal',
                  fontSize: 'var(--article-body-font-size)',
                  fontWeight: 'var(--article-body-font-weight)',
                }}
              >
                {renderedContent}
              </motion.p>
            );
          }

          return (
            <motion.p
              key={index}
              {...fadeUpInView(0)}
              className="text-[#111111]/80 leading-[1.65em] tracking-[-0.015em] m-0"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontSize: 'var(--article-body-font-size)',
                fontWeight: 'var(--article-body-font-weight)',
              }}
            >
              {block.text}
            </motion.p>
          );
        }

        if (block.type === 'list') {
          return (
            <motion.ul
              key={index}
              {...fadeUpInView(0)}
              role="list"
              className="space-y-3 pl-5 list-disc marker:text-[#111111]/70 text-[#111111]/80 leading-[1.6em]"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontSize: 'var(--article-body-font-size)',
                fontWeight: 'var(--article-body-font-weight)',
              }}
            >
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </motion.ul>
          );
        }

        if (block.type === 'image') {
          return (
            <motion.figure
              key={index}
              {...fadeUpInView(0)}
              className="w-full rounded-[20px] overflow-hidden my-4 bg-[#E8E4DF]"
            >
              <img
                src={block.src}
                alt={block.alt || 'Article visual'}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
            </motion.figure>
          );
        }

        return null;
      })}
    </div>
  );
}

/* ============================================================
   Main Blog Article Page Component
   ============================================================ */
export default function BlogArticle() {
  const { slug } = useParams();
  const [readAgoText, setReadAgoText] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [moreArticles, setMoreArticles] = useState([]);
  const imageTriggerRef = useRef(null);

  // Find article by slug or alias
  const article = useMemo(() => {
    return articles.find(
      (a) => a.slug === slug || (a.aliases && a.aliases.includes(slug))
    );
  }, [slug]);

  useEffect(() => {
    if (!article) {
      setMoreArticles([]);
      return;
    }

    const shuffled = articles.filter((item) => item.slug !== article.slug);
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    setMoreArticles(shuffled.slice(0, 3));
  }, [article?.slug]);

  useDocumentTitle(ROUTE_TITLES.thoughts);

  // Read history tracking: load previous read time and update current visit
  useEffect(() => {
    if (!article?.slug) return;
    const prev = getArticleReadRecord(article.slug);
    if (prev && prev.timestamp) {
      setReadAgoText(formatReadAgo(prev.timestamp));
    } else {
      setReadAgoText(null);
    }
    recordArticleRead(article.slug);
  }, [article?.slug]);

  // Update meta description
  useEffect(() => {
    if (article) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.summary || article.cardDescription || '');
      }
    }
  }, [article]);

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/blog', { replace: true });
    }
  };

  // Escape key shortcut to return to previous page (when no menu or input is focused)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) return;
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isInputFocused =
          activeTag === 'input' ||
          activeTag === 'textarea' ||
          activeTag === 'select' ||
          document.activeElement?.isContentEditable;
        const isMenuOpen = document.querySelector('[aria-expanded="true"]') !== null;
        if (!isInputFocused && !isMenuOpen) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isLightboxOpen]);

  // Redirect if slug not found
  if (!article) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="w-full bg-transparent">
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0 pt-[100px] tablet:pt-[110px] desktop:pt-[120px] pb-[var(--gap-contact-footer)]">
        {/* Main Content Layout: Article column + Sticky Sidebar on Desktop */}
        <div className="flex flex-col desktop:flex-row desktop:justify-between desktop:items-start gap-12 desktop:gap-16">
          {/* Article Column (takes ~58% of 1180px container, max-w-[700px]) */}
          <article className="w-full desktop:max-w-[700px] flex flex-col">
            {/* Back Button */}
            <motion.div {...fadeUp(0)} className="mb-6 tablet:mb-8">
              <button
                type="button"
                onClick={handleBack}
                className="work-back-btn group inline-flex items-center gap-2.5 text-[#111111] hover:text-[#111111]/75 transition-colors select-none min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 rounded cursor-pointer"
                aria-label="Go back to previous page"
              >
                <AnimatedArrowBox variant="light" size="sm" direction="left" />
                <span
                  className="tracking-[-0.02em]"
                  style={{
                    fontFamily: 'var(--work-font-family)',
                    fontStyle: 'var(--work-font-style)',
                    fontSize: 'var(--work-back-font-size)',
                    fontWeight: 'var(--work-back-font-weight)',
                  }}
                >
                  Back
                </span>
              </button>
            </motion.div>

            {/* Header: Title */}
            <header className="flex flex-col">
              <motion.h1
                {...fadeUp(0)}
                className="text-[#111111] leading-[1.02em] tracking-[-0.03em] select-none m-0"
                style={{
                  fontFamily: 'var(--work-font-family)',
                  fontStyle: 'normal',
                  fontSize: 'var(--article-title-font-size)',
                  fontWeight: 'var(--article-title-font-weight)',
                }}
              >
                {article.title}
              </motion.h1>

              {/* Summary Paragraph */}
              {article.summary && (
                <motion.p
                  {...fadeUp(0.1)}
                  className="text-[#111111]/70 leading-[1.5em] tracking-[-0.01em] max-w-[480px] mt-4 tablet:mt-5 m-0"
                  style={{
                    fontFamily: 'var(--work-font-family)',
                    fontStyle: 'normal',
                    fontSize: 'var(--article-intro-font-size)',
                    fontWeight: 'var(--article-intro-font-weight)',
                  }}
                >
                  {article.summary}
                </motion.p>
              )}

              {/* Meta Row: Date on left, Reading time on right */}
              <motion.div
                {...fadeUp(0.15)}
                className="flex items-center justify-between w-full pt-4 tablet:pt-5 border-t border-[#111111]/10 mt-6"
              >
                <time
                  dateTime={article.date}
                  className="text-[#111111]/60"
                  style={{
                    fontFamily: 'var(--work-font-family)',
                    fontStyle: 'normal',
                    fontSize: 'var(--article-meta-font-size)',
                    fontWeight: 'var(--article-meta-font-weight)',
                  }}
                >
                  {article.date}
                </time>
                <span
                  className="text-[#111111]/60"
                  style={{
                    fontFamily: 'var(--work-font-family)',
                    fontStyle: 'normal',
                    fontSize: 'var(--article-meta-font-size)',
                    fontWeight: 'var(--article-meta-font-weight)',
                  }}
                >
                  {readAgoText || ''}
                </span>
              </motion.div>
            </header>

            {/* Cover Image: Rounded corners ~28px, full article width, eager loading */}
            <motion.figure
              ref={imageTriggerRef}
              {...fadeUp(0.2)}
              onClick={() => setIsLightboxOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsLightboxOpen(true);
                }
              }}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label="Expand image"
              className="w-full aspect-[16/10] rounded-[20px] tablet:rounded-[24px] desktop:rounded-[28px] overflow-hidden bg-[#E8E4DF] mt-6 tablet:mt-8 shadow-sm cursor-pointer desktop:cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 select-none"
            >
              <img
                src={article.cover}
                alt={`${article.title} cover`}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center pointer-events-none"
              />
            </motion.figure>

            {/* Body Content Blocks */}
            <BlockRenderer blocks={article.blocks} />

            {/* Newsletter Card for Mobile & Tablet (Inline after body) */}
            <div className="block desktop:hidden w-full mt-12 tablet:mt-16">
              <NewsletterCard idPrefix="mobile" />
            </div>
          </article>

          {/* Desktop Sticky Sidebar for Newsletter Card */}
          <aside
            aria-label="Newsletter subscription"
            className="hidden desktop:block desktop:w-[320px] desktop:sticky desktop:top-[120px] shrink-0 desktop:mt-[180px] self-start"
          >
            <NewsletterCard idPrefix="desktop" />
          </aside>
        </div>

        {/* ──────────────────── More Articles Section ──────────────────── */}
        {article && (
          <section className="w-full pt-[var(--gap-thoughts-contact)] border-t border-[#111111]/10">
            <motion.h2
              {...fadeUpInView(0)}
              className="text-[#111111] leading-[1.05em] tracking-[-0.03em] select-none m-0 mb-8 tablet:mb-10 desktop:mb-12"
              style={{
                fontFamily: 'var(--work-font-family)',
                fontStyle: 'normal',
                fontSize: 'var(--article-more-heading-font-size)',
                fontWeight: 'var(--article-more-heading-font-weight)',
              }}
            >
              More Articles
            </motion.h2>

            <ul
              role="list"
              className={`grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-[16px] w-full items-stretch${moreArticles.length ? '' : ' min-h-[460px]'}`}
            >
              {moreArticles.map((item, index) => (
                <motion.li
                  key={item.slug}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                  }}
                  className="h-[460px] w-full flex"
                >
                  <article className="w-full h-full">
                    <Link
                      to={`/blog/${item.slug}`}
                      state={{ fromInternal: true }}
                      className="group relative w-full h-[460px] rounded-[20px] overflow-hidden flex flex-col justify-end p-[20px] select-none block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] cursor-pointer"
                    >
                      {/* Background Image with Framer Spring-like Hover Zoom (104%) */}
                      <img
                        src={item.cardImage || item.cover}
                        alt={`${item.title} cover`}
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
                            dateTime={item.date}
                            className="font-sans font-normal text-[#FAF7F3] text-[16px] leading-[1.4em] tracking-[-0.04em] block"
                          >
                            {item.date}
                          </time>
                          <h3
                            className="font-sans font-medium text-[#FAF7F3] leading-[1.2em] tracking-[-0.02em] [text-wrap:balance] m-0"
                            style={{
                              fontSize: 'var(--article-card-title-font-size)',
                              fontWeight: 'var(--article-card-title-font-weight)',
                            }}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <p
                          className="font-sans font-normal text-[#FAF7F3] leading-[1.4em] tracking-[-0.04em] m-0"
                          style={{
                            fontSize: 'var(--article-card-meta-font-size)',
                            fontWeight: 'var(--article-card-meta-font-weight)',
                          }}
                        >
                          {item.cardDescription || item.summary}
                        </p>
                      </div>
                    </Link>
                  </article>
                </motion.li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Shared Lightbox Modal for Article Cover */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        image={article.cover ? { src: article.cover, alt: `${article.title} cover` } : null}
        onClose={() => setIsLightboxOpen(false)}
        triggerRef={imageTriggerRef}
      />
    </main>
  );
}
