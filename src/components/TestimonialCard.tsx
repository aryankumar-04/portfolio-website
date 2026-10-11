import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TestimonialItem } from '../types/cms';

interface TestimonialCardProps {
  item: TestimonialItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-20 border border-dark/10 dark:border-[rgba(17,17,17,0.08)] bg-white/70 dark:bg-[#F1EDE6] backdrop-blur-sm flex flex-col justify-between gap-6 hover:border-dark/30 dark:hover:border-[rgba(17,17,17,0.15)] shadow-none dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:shadow-md dark:hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.7)] transition-all duration-300"
    >
      <div>
        <Quote className="w-6 h-6 text-dark/20 dark:text-[#111111] mb-4" />
        <p className="font-sans text-base md:text-lg text-dark/90 dark:text-[#111111] leading-relaxed italic">
          "{item.content}"
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-dark/5 dark:border-[rgba(17,17,17,0.15)]">
        <img
          src={item.avatar}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="w-10 h-10 rounded-full object-cover border border-dark/10 dark:border-[rgba(17,17,17,0.15)]"
        />
        <div>
          <h4 className="font-sans font-semibold text-sm text-dark dark:text-[#111111]">{item.name}</h4>
          <p className="font-sans text-xs text-dark/60 dark:text-[#6B675F]">
            {item.role} • {item.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
