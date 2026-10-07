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
      className="p-8 rounded-20 border border-dark/10 bg-white/70 backdrop-blur-sm flex flex-col justify-between gap-6 hover:border-dark/30 hover:shadow-md transition-all duration-300"
    >
      <div>
        <Quote className="w-6 h-6 text-dark/20 mb-4" />
        <p className="font-sans text-base md:text-lg text-dark/90 leading-relaxed italic">
          "{item.content}"
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-dark/5">
        <img
          src={item.avatar}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="w-10 h-10 rounded-full object-cover border border-dark/10"
        />
        <div>
          <h4 className="font-sans font-semibold text-sm text-dark">{item.name}</h4>
          <p className="font-sans text-xs text-dark/60">
            {item.role} • {item.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
