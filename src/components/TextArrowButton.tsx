import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface TextArrowButtonProps {
  text: string;
  href?: string;
  isExternal?: boolean;
  variant?: 'light' | 'dark' | 'outline';
  onClick?: () => void;
  className?: string;
}

export const TextArrowButton: React.FC<TextArrowButtonProps> = ({
  text,
  href,
  isExternal = false,
  variant = 'dark',
  onClick,
  className = '',
}) => {
  const isDark = variant === 'dark';
  const isOutline = variant === 'outline';

  const baseStyles =
    'group inline-flex items-center justify-between gap-3 px-6 py-3.5 rounded-full font-sans text-sm font-semibold tracking-tight transition-all duration-300';
  
  const variantStyles = isDark
    ? 'bg-dark text-cream hover:bg-dark/90 active:scale-[0.98]'
    : isOutline
    ? 'border border-dark/20 text-dark hover:border-dark hover:bg-dark hover:text-cream active:scale-[0.98]'
    : 'bg-cream text-dark hover:bg-white active:scale-[0.98] shadow-sm';

  const content = (
    <>
      <span>{text}</span>
      <motion.span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cream/10 group-hover:bg-cream/20 transition-colors"
        whileHover={{ x: 2, y: -2 }}
      >
        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`${baseStyles} ${variantStyles} ${className}`}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
};
