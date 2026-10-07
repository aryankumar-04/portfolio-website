import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '../components/TestimonialCard';
import { testimonialItems } from '../data/testimonials';

export const TestimonialsSection: React.FC = () => {
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
            Kind Words
          </span>
          <h2 className="framer-h2 font-semibold text-dark">Testimonials</h2>
        </motion.div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonialItems.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
