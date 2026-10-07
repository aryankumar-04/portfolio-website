import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost } from '../types/cms';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const imageSrc = post.cardImage || post.coverImage || post.cover || '';
  const dateText = post.date || post.publishedDate || 'May 5, 2025';
  const descText = post.cardDescription || post.subheading || post.excerpt || post.summary || '';

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReducedMotion ? 0 : (index % 3) * 0.1,
      }}
      className="w-full h-[var(--blog-list-card-height,460px)] flex"
    >
      <Link
        to={`/blog/${post.slug}`}
        state={{ fromInternal: true }}
        className="group relative w-full h-full rounded-[var(--blog-list-card-radius,20px)] overflow-hidden flex flex-col justify-end p-[var(--blog-list-card-padding,20px)] select-none block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] cursor-pointer"
      >
        {/* Background Image with Framer Spring-like Hover Zoom (104%) */}
        <img
          src={imageSrc}
          alt={`${post.title} cover`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center will-change-transform transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
        />

        {/* Dark gradient overlay at bottom: exact 70% height from rgba(84,84,84,0) to rgb(0,0,0) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-[70%] pointer-events-none rounded-b-[var(--blog-list-card-radius,20px)] z-0"
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
              dateTime={dateText}
              className="font-sans font-normal text-[#FAF7F3] leading-[1.4em] tracking-[-0.04em] block m-0"
              style={{
                fontFamily: 'var(--work-font-family, Archivo, "Archivo Placeholder", sans-serif)',
                fontStyle: 'normal',
                fontSize: 'var(--blog-list-card-date-font-size, 16px)',
                fontWeight: 'var(--blog-list-card-date-font-weight, 400)',
              }}
            >
              {dateText}
            </time>
            <h3
              className="font-sans font-medium text-[#FAF7F3] leading-[1.2em] tracking-[-0.02em] [text-wrap:balance] m-0"
              style={{
                fontFamily: 'var(--work-font-family, Archivo, "Archivo Placeholder", sans-serif)',
                fontStyle: 'normal',
                fontSize: 'var(--blog-list-card-title-font-size, 32px)',
                fontWeight: 'var(--blog-list-card-title-font-weight, 500)',
              }}
            >
              {post.title}
            </h3>
          </div>
          <p
            className="font-sans font-normal text-[#FAF7F3] leading-[1.4em] tracking-[-0.04em] m-0"
            style={{
              fontFamily: 'var(--work-font-family, Archivo, "Archivo Placeholder", sans-serif)',
              fontStyle: 'normal',
              fontSize: 'var(--blog-list-card-desc-font-size, 16px)',
              fontWeight: 'var(--blog-list-card-desc-font-weight, 400)',
            }}
          >
            {descText}
          </p>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
