import React from 'react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  index: string;
  title: string;
  description: string;
  tags: string[];
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  index,
  title,
  description,
  tags,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group w-full p-8 md:p-10 rounded-20 border border-dark/10 bg-cream hover:border-dark/30 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div className="flex items-start md:items-center gap-6 md:gap-10">
        <span className="font-sans text-xl md:text-2xl font-light text-dark/40 group-hover:text-dark transition-colors">
          {index}
        </span>
        <div>
          <h3 className="framer-h3 font-medium text-dark group-hover:text-dark transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-dark/70 text-sm md:text-base max-w-xl font-sans leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-tight bg-dark/5 text-dark/80 border border-dark/5 group-hover:border-dark/15 group-hover:bg-dark/10 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
