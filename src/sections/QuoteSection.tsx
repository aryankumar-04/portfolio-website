import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
// @ts-ignore
import grainImg from '../assets/grain.png';

const quoteText =
  'From idea to launch. Clean, scalable digital products built to move fast, stay simple, and perform in real-world use, driven by clarity, structured systems, and intentional design.';

const words = quoteText.split(' ');
const totalWords = words.length;
const windowSize = 0.06;
const revealEnd = 0.55;

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

const Word: React.FC<WordProps> = ({ children, range, progress, reducedMotion }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);

  if (reducedMotion) {
    return (
      <span className="inline-block mr-[0.28em] my-[0.05em] text-[#111111]">
        {children}
      </span>
    );
  }

  return (
    <span className="inline-block mr-[0.28em] my-[0.05em]">
      <motion.span
        style={{ opacity }}
        className="inline-block text-[#111111] will-change-[opacity]"
      >
        {children}
      </motion.span>
    </span>
  );
};

// Chunks representing the sub-phrases between breakpoint-specific line breaks
const CHUNKS: Array<{
  words: number[];
  breakAfter: React.ReactNode;
}> = [
  // Mobile Line 1 (0..4) / Tablet Line 1 (0..6) / Desktop Line 1 (0..7)
  {
    words: [0, 1, 2, 3, 4], // From idea to launch. Clean,
    breakAfter: <br className="block tablet:hidden" />,
  },
  {
    words: [5, 6], // scalable digital
    breakAfter: <br className="hidden tablet:block desktop:hidden" />,
  },
  {
    words: [7], // products
    breakAfter: <br className="hidden desktop:block" />,
  },
  // Mobile Line 2 (5..9) / Tablet Line 2 (7..14) / Desktop Line 2 (8..16)
  {
    words: [8, 9], // built to
    breakAfter: <br className="block tablet:hidden" />,
  },
  {
    words: [10, 11, 12, 13, 14], // move fast, stay simple, and
    breakAfter: <br className="block desktop:hidden" />,
  },
  // Mobile Line 3 (10..14) / Tablet Line 3 (15..21) / Desktop Line 2 cont.
  {
    words: [15, 16], // perform in
    breakAfter: <br className="hidden desktop:block" />,
  },
  // Mobile Line 4 (15..19) / Tablet Line 3 cont. / Desktop Line 3 (17..23)
  {
    words: [17, 18, 19], // real-world use, driven
    breakAfter: <br className="block tablet:hidden" />,
  },
  {
    words: [20, 21], // by clarity,
    breakAfter: <br className="hidden tablet:block desktop:hidden" />,
  },
  // Mobile Line 5 (20..23) / Tablet Line 4 (22..26) / Desktop Line 3 cont.
  {
    words: [22, 23], // structured systems,
    breakAfter: <br className="block tablet:hidden desktop:block" />,
  },
  // Mobile Line 6 (24..26) / Tablet Line 4 cont. / Desktop Line 4 (24..26)
  {
    words: [24, 25, 26], // and intentional design.
    breakAfter: null,
  },
];

export const QuoteSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.25,
    restDelta: 0.0005,
  });

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent"
      style={{
        height: prefersReducedMotion ? 'auto' : '140vh',
      }}
    >
      {/* Sticky pinned viewport */}
      <div
        className={
          prefersReducedMotion
            ? 'relative w-full py-24 tablet:py-32 flex items-center justify-center'
            : 'sticky top-0 w-full h-screen flex items-center justify-center'
        }
        style={{
          overflow: 'clip',
          transform: 'translateZ(0)',
        }}
      >
        {/* Centered text container */}
        <div className="relative z-[2] w-full max-w-[440px] tablet:max-w-[850px] desktop:max-w-[1100px] mx-auto px-4 tablet:px-8 desktop:px-0 text-center select-none">
          <p
            className="font-sans font-medium font-[500] text-[#111111] leading-[1.35em] tablet:leading-[1.3em] desktop:leading-[1.28em] tracking-[-0.02em] tablet:tracking-[-0.025em] desktop:tracking-[-0.03em] text-[24px] tablet:text-[34px] desktop:text-[42px]"
            style={{ fontWeight: 500 }}
          >
            {CHUNKS.map((chunk, chunkIdx) => (
              <React.Fragment key={chunkIdx}>
                <span className="inline-block whitespace-nowrap">
                  {chunk.words.map((i) => {
                    const start = (i / (totalWords - 1)) * (revealEnd - windowSize);
                    const end = start + windowSize;
                    return (
                      <Word
                        key={i}
                        range={[start, end]}
                        progress={smooth}
                        reducedMotion={prefersReducedMotion}
                      >
                        {words[i]}
                      </Word>
                    );
                  })}
                </span>
                {chunk.breakAfter}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
