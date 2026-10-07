import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '../components/BlogCard';
import { BackButton } from '../components/BackButton';
import { blogPosts } from '../data/blog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ROUTE_TITLES } from '../config/site';
import { useRestoreBlogScroll } from '../hooks/useRestoreBlogScroll';
import { blogScroll } from '../utils/blogScroll';

export const BlogArchive: React.FC = () => {
  useDocumentTitle(ROUTE_TITLES.thoughts);
  useRestoreBlogScroll();

  useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Discover ideas, perspectives, and creative thinking shaped by our work in brand identity and art direction. Each article explores how thoughtful design helps brands with clarity and intention.'
      );
    }

    return () => {
      blogScroll.save();
    };
  }, []);

  return (
    <main className="w-full bg-[#FAF7F3] pt-[var(--blog-list-pt)] pb-[var(--blog-list-pb)]">
      <div className="w-full max-w-[var(--blog-list-container-max-w)] mx-auto px-[var(--blog-list-container-px)] flex flex-col gap-[var(--blog-list-container-gap)]">
        {/* Heading Block */}
        <div className="flex flex-col gap-[10px] w-full items-start text-left">
          {/* Back Button */}
          <BackButton />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[#111111] leading-[1em] tracking-[-0.02em] max-w-[var(--blog-list-h1-max-w)] m-0 select-none"
            style={{
              fontFamily: 'var(--work-font-family, Archivo, "Archivo Placeholder", sans-serif)',
              fontStyle: 'normal',
              fontSize: 'var(--blog-list-h1-font-size)',
              fontWeight: 'var(--blog-list-h1-font-weight)',
            }}
          >
            My Brightest Thoughts
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#111111] leading-[1.4em] tracking-[-0.04em] max-w-[var(--blog-list-intro-max-w)] m-0"
            style={{
              fontFamily: 'var(--work-font-family, Archivo, "Archivo Placeholder", sans-serif)',
              fontStyle: 'normal',
              fontSize: 'var(--blog-list-intro-font-size)',
              fontWeight: 'var(--blog-list-intro-font-weight)',
            }}
          >
            Discover ideas, perspectives, and creative thinking shaped by our work in brand identity and art direction. Each article explores how thoughtful design helps brands with clarity and intention.
          </motion.p>
        </div>

        {/* 3-Column Desktop / 2-Column Tablet / 1-Column Mobile Grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-[var(--blog-list-grid-gap)] w-full items-stretch">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id || post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default BlogArchive;
