import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxModalProps {
  isOpen: boolean;
  image: LightboxImage | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  image,
  onClose,
  triggerRef,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Lock page scroll (including Lenis) without layout jump and restore exact position
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    if (typeof window !== 'undefined' && (window as any).__lenis) {
      (window as any).__lenis.stop();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
      if (window.scrollY !== scrollY) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [isOpen]);

  // Focus close button on open, return focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = (document.activeElement as HTMLElement) || null;
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      if (triggerRef?.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      } else if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [isOpen, triggerRef]);

  // Trap focus & close on Escape key press (capture phase)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab') {
        // Trap focus inside modal
        e.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && image && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 tablet:p-6 cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt || 'Expanded image'}
          onClick={onClose}
        >
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-hidden="true"
            className="absolute inset-0 bg-[#111111]/80 backdrop-blur-[4px] pointer-events-none"
          />

          {/* Close (X) Button at TOP RIGHT corner of the screen */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close image"
            style={{
              top: 'max(16px, env(safe-area-inset-top, 16px))',
              right: 'max(16px, env(safe-area-inset-right, 16px))',
            }}
            className="fixed z-[110] w-10 h-10 tablet:w-11 tablet:h-11 rounded-full bg-[#FAF7F3] hover:bg-[#111111] text-[#111111] hover:text-[#FAF7F3] border border-[#111111]/25 hover:border-[#111111] shadow-lg flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Centered Image Container - object-fit contain, never cropped, margin around */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex items-center justify-center max-w-[92vw] max-h-[88vh] cursor-default pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.src}
              alt={image.alt || 'Expanded article cover'}
              className="max-w-[92vw] max-h-[88vh] w-auto h-auto object-contain rounded-[14px] tablet:rounded-[18px] desktop:rounded-[22px] shadow-2xl select-none block"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightboxModal;
