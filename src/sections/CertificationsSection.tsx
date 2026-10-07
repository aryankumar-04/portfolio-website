import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CERTIFICATION_ITEMS, CertificationItem } from '../data/educationData';
import { playedOnce } from '../utils/playedOnce';

function getDownloadFileName(name: string): string {
  // e.g. "SQL (Advanced)" -> "SQL-Advanced-Certificate.pdf"
  const sanitized = name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${sanitized}-Certificate.pdf`;
}

export const CertificationsSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const hasPlayed = playedOnce.has('certifications');

  // Single modal instance state reused across all certificates
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  const openModal = (cert: CertificationItem) => {
    setSelectedCert(cert);
  };

  const closeModal = () => {
    setSelectedCert(null);
  };

  // Lock page scroll (including Lenis smooth scroll) when modal is open
  useEffect(() => {
    if (selectedCert) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        if (typeof window !== 'undefined' && (window as any).__lenis) {
          (window as any).__lenis.start();
        }
      };
    }
  }, [selectedCert]);

  // Close on Escape key press
  useEffect(() => {
    if (!selectedCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  return (
    <section
      id="certifications"
      className="w-full bg-transparent pt-[var(--edu-cert-section-gap)] pb-0 scroll-mt-20"
      style={{ fontSynthesis: 'none' }}
    >
      <div className="max-w-[1180px] mx-auto px-6 tablet:px-10 desktop:px-0">
        {/* Section Heading */}
        <motion.h2
          initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="edu-cert-heading text-[#111111] leading-[0.95em] tracking-[-0.03em] select-none m-0"
        >
          Certifications
        </motion.h2>

        {/* Certifications List */}
        <ul
          role="list"
          className="mt-[var(--edu-cert-heading-gap)] flex flex-col gap-[var(--edu-cert-row-gap)] w-full"
        >
          {CERTIFICATION_ITEMS.map((item: CertificationItem, index: number) => (
            <motion.li
              key={item.id}
              initial={hasPlayed || prefersReducedMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: prefersReducedMotion ? 0 : index * 0.1,
              }}
              onAnimationComplete={() => playedOnce.add('certifications')}
              className="py-0 flex flex-row items-start gap-4 tablet:gap-6 desktop:gap-8 transition-colors duration-300 w-full"
            >
              {/* Certificate Issuer Logo (HackerRank) */}
              <div
                className="w-[var(--edu-cert-logo-size)] h-[var(--edu-cert-logo-size)] shrink-0 flex items-center justify-center select-none"
                aria-hidden="true"
              >
                <img
                  src={item.logo}
                  alt={`${item.issuer} logo`}
                  loading="lazy"
                  className="w-full h-full object-contain object-center select-none"
                  onError={(e) => {
                    // Fallback to initial letter only if image fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement && !target.parentElement.querySelector('span')) {
                      const fallback = document.createElement('span');
                      fallback.className = 'font-sans font-medium text-[20px] tablet:text-[22px] desktop:text-[24px] text-[#111111]/40 select-none';
                      fallback.textContent = item.issuer.charAt(0);
                      target.parentElement.appendChild(fallback);
                    }
                  }}
                />
              </div>

              {/* Text Column & Actions */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Certificate Name */}
                <h3 className="edu-cert-item-title text-[#111111] leading-[1.2em] tracking-[-0.02em] select-none m-0">
                  {item.name}
                </h3>

                {/* Meta Line */}
                <p className="cert-meta-line text-[#111111]/50 leading-[1.4em] tracking-[-0.02em] select-none mt-1 tablet:mt-1.5 m-0">
                  {item.issuer} • ID: {item.certId}
                </p>

                {/* Issued Date */}
                <p className="cert-issued-date text-[#111111]/50 leading-[1.4em] tracking-[-0.02em] select-none mt-1 m-0">
                  {item.issuedDate}
                </p>

                {/* Action Buttons: Verify & Preview Side by Side */}
                <div className="cert-btn-group">
                  {/* Verify ↗ Button */}
                  <a
                    href={item.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-btn-base cert-btn-verify group"
                    aria-label={`Verify ${item.name} certificate on HackerRank`}
                  >
                    <span>Verify</span>
                    <span className="cert-arrow-box" aria-hidden="true">
                      {/* Expanding hover fill circle */}
                      <span className="cert-arrow-box-fill" />
                      {/* Primary arrow (exits top-right on hover) */}
                      <span className="cert-arrow-icon-primary">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </span>
                      {/* Secondary arrow (enters from bottom-left on hover) */}
                      <span className="cert-arrow-icon-hover">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </span>
                    </span>
                  </a>

                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => openModal(item)}
                    className="cert-btn-base cert-btn-preview"
                    aria-label={`Preview ${item.name} certificate`}
                  >
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Reusable Certificate PDF Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 tablet:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-certificate-title"
          >
            {/* Dimmed Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#111111]/75 backdrop-blur-[4px] cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[94vw] tablet:w-[92vw] desktop:w-full desktop:max-w-[960px] h-[85vh] max-h-[85vh] bg-[#FAF7F3] border border-[#111111]/15 rounded-[20px] tablet:rounded-[24px] shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="shrink-0 px-5 tablet:px-7 py-3.5 tablet:py-4.5 border-b border-[#111111]/10 flex items-center justify-between gap-4 bg-[#FAF7F3]">
                {/* Title (Certificate Name) */}
                <h4
                  id="modal-certificate-title"
                  className="modal-cert-title text-[#111111] leading-tight tracking-[-0.02em] truncate m-0"
                >
                  {selectedCert.name}
                </h4>

                {/* Right Actions: Download Button & Close (X) Button */}
                <div className="flex items-center gap-2.5 tablet:gap-3 shrink-0">
                  {/* Download Button (anchor download attribute) */}
                  <a
                    href={selectedCert.pdfPath}
                    download={getDownloadFileName(selectedCert.name)}
                    className="modal-download-btn inline-flex items-center justify-center px-4 py-1.5 tablet:px-5 tablet:py-2 rounded-full border border-[#111111]/30 hover:border-[#111111] hover:bg-[#111111] hover:text-[#FAF7F3] text-[#111111] transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
                  >
                    Download
                  </a>

                  {/* Close (X) Button */}
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close certificate preview"
                    className="w-8 h-8 tablet:w-9 tablet:h-9 rounded-full border border-[#111111]/30 hover:border-[#111111] hover:bg-[#111111] hover:text-[#FAF7F3] text-[#111111] flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
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
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body: PDF Embed / Iframe */}
              <div className="flex-1 w-full h-full bg-[#E8E4DF] overflow-hidden relative flex items-center justify-center">
                {selectedCert.pdfPath ? (
                  <object
                    data={selectedCert.pdfPath}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <iframe
                      src={selectedCert.pdfPath}
                      title={`${selectedCert.name} Certificate`}
                      className="w-full h-full border-0"
                    >
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center select-none">
                        <p className="font-sans text-[16px] text-[#111111]/70 mb-3">
                          Inline preview is not supported on this browser.
                        </p>
                        <a
                          href={selectedCert.pdfPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans font-medium text-[16px] text-[#111111] underline hover:opacity-75"
                        >
                          Open PDF
                        </a>
                      </div>
                    </iframe>
                  </object>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center select-none">
                    <p className="font-sans font-medium text-[20px] text-[#111111] mb-1">
                      {selectedCert.name}
                    </p>
                    <p className="font-sans text-[15px] text-[#111111]/50 max-w-[340px]">
                      PDF document preview placeholder.
                    </p>
                    <a
                      href={selectedCert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 font-sans font-medium text-[14px] text-[#111111] underline hover:opacity-75"
                    >
                      Open PDF
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificationsSection;
