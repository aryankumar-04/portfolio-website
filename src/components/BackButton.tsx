import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { homeScroll } from '../utils/homeScroll';
import { AnimatedArrowBox } from './AnimatedArrowBox';

export interface BackButtonProps {
  className?: string;
  fallbackTo?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  className = 'mb-2',
  fallbackTo = '/',
  label = 'Back',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else if (homeScroll.hasPosition()) {
      navigate(fallbackTo, { replace: true, state: { restoreHome: true } });
    } else {
      navigate(fallbackTo, { replace: true });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        const isInputFocused =
          activeTag === 'input' ||
          activeTag === 'textarea' ||
          activeTag === 'select' ||
          (document.activeElement as HTMLElement)?.isContentEditable;
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
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <button
        type="button"
        onClick={handleBack}
        className="work-back-btn group inline-flex items-center gap-2.5 text-[#111111] hover:text-[#111111]/75 transition-colors select-none min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 rounded"
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
          {label}
        </span>
      </button>
    </motion.div>
  );
};

export default BackButton;
