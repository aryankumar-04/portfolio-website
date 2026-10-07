import React from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '../components/BlogCard';
import { TextArrowButton } from '../components/TextArrowButton';
import { blogPosts } from '../data/blog';

export const BlogSection: React.FC = () => {
  const displayedPosts = blogPosts.slice(0, 2);

  return (
    <section className="w-full bg-cream py-24 md:py-32">
      <div className="max-w-framer mx-auto px-6 md:px-12 flex flex-col gap-12 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <span className="font-sans text-xs tracking-widest uppercase font-semibold text-dark/40">
            Writing & Insights
          </span>
          <h2 className="framer-h2 font-semibold text-dark">Thoughts</h2>
        </motion.div>

        {/* Grid with posts + AllPosts promo card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {displayedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}

          {/* Framer AllPostsCard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 md:p-10 rounded-20 bg-dark text-cream flex flex-col justify-between gap-10 shadow-xl"
          >
            <h3 className="framer-body-44 font-normal text-cream leading-tight">
              See how we shape brands with clarity and craft— explore our blog
            </h3>

            <div className="pt-6 border-t border-cream/10">
              <TextArrowButton
                text="Explore All Posts"
                href="/blog"
                variant="light"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
