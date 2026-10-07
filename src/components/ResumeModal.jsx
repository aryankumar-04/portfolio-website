import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ResumeModal({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);

  // Lock page scrolling (including Lenis) without layout jump
  useEffect(() => {
    if (!isOpen) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.stop();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [isOpen]);

  // Focus close button on mount
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key press with capture phase to stop other listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 tablet:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
        >
          {/* Dark semi-transparent backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-[#111111]/75 backdrop-blur-[4px] cursor-pointer"
          />

          {/* Centered Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[94vw] tablet:w-[88vw] desktop:w-full desktop:max-w-[900px] h-[90vh] max-h-[90vh] bg-[#FAF7F3] border border-[#111111]/15 rounded-[20px] tablet:rounded-[24px] shadow-2xl flex flex-col overflow-hidden font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div className="shrink-0 px-4 tablet:px-6 py-2.5 tablet:py-3.5 border-b border-[#111111]/10 flex items-center justify-between gap-4 bg-[#FAF7F3]">
              <h3 className="font-sans font-medium text-[18px] tablet:text-[20px] text-[#111111] leading-tight tracking-[-0.02em] truncate m-0 select-none">
                Resume
              </h3>

              {/* Action Buttons: Download (left) and Close X (right-most) */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Download Button */}
                <a
                  href="/resume.pdf"
                  download="Aryan_Resume.pdf"
                  aria-label="Download resume"
                  className="w-10 h-10 tablet:w-9 tablet:h-9 rounded-[8px] border border-[#111111]/30 hover:border-[#111111] hover:bg-[#111111] hover:text-[#FAF7F3] text-[#111111] bg-[#FAF7F3] flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>

                {/* Close (X) Button */}
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume preview"
                  className="w-10 h-10 tablet:w-9 tablet:h-9 rounded-[8px] border border-[#111111]/30 hover:border-[#111111] hover:bg-[#111111] hover:text-[#FAF7F3] text-[#111111] bg-[#FAF7F3] flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
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
              </div>
            </div>

            {/* Resume Preview Body */}
            <div className="flex-1 w-full h-full bg-[#FAF7F3] overflow-hidden relative">
              <object
                data="/resume.pdf"
                type="application/pdf"
                className="w-full h-full block border-0"
                aria-label="Resume PDF"
              >
                <iframe
                  src="/resume.pdf"
                  title="Resume"
                  className="w-full h-full border-0 block"
                >
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center select-none bg-[#FAF7F3]">
                    <p className="font-sans text-[15px] tablet:text-[16px] text-[#111111]/70 mb-2">
                      Preview not available on this device. Use the download button.
                    </p>
                    <a
                      href="/resume.pdf"
                      download="Aryan_Resume.pdf"
                      className="font-sans font-medium text-[15px] tablet:text-[16px] text-[#111111] underline hover:opacity-75"
                    >
                      Download Resume
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default ResumeModal;
