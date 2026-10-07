import React from 'react';

export interface AnimatedArrowBoxProps {
  /**
   * Direction of the arrow motion:
   * - 'up-right': arrow points diagonally up-right, exits top-right, enters from bottom-left
   * - 'left': arrow points left, exits to the left, enters from the right (mirrored)
   */
  direction?: 'up-right' | 'left';
  /**
   * Color variant:
   * - 'dark': cream border & fill for dark cards (Thoughts reference)
   * - 'light': dark border & fill for light background sections/pages
   * - 'live': subtle border & fill for Live Link buttons
   */
  variant?: 'light' | 'dark' | 'live';
  /**
   * Sizing:
   * - 'md': 28px box, 8px border-radius (Thoughts reference)
   * - 'sm': 26px box, 6px border-radius (Featured Projects, Back buttons)
   * - 'live': 30px box, 7px border-radius (Live Link button)
   */
  size?: 'sm' | 'md' | 'live';
  className?: string;
}

export const AnimatedArrowBox: React.FC<AnimatedArrowBoxProps> = ({
  direction = 'up-right',
  variant = 'light',
  size = 'sm',
  className = '',
}) => {
  const isDarkVariant = variant === 'dark';
  const isLiveVariant = variant === 'live' || size === 'live';
  const isMd = size === 'md';

  // Box dimensions and border styling
  const boxStyles = isLiveVariant
    ? `w-[30px] h-[30px] rounded-[7px] border border-[#111111]/30 transition-colors duration-200 group-hover:border-[#111111] group-focus-visible:border-[#111111]`
    : isMd
    ? `w-[28px] h-[28px] rounded-[8px] border ${isDarkVariant ? 'border-[#FAF7F3]' : 'border-[#111111]'}`
    : `w-[26px] h-[26px] rounded-[6px] border ${isDarkVariant ? 'border-[#FAF7F3]' : 'border-[#111111]'}`;

  // Fill colors for expanding circle and arrow contrast
  const circleColor = isDarkVariant ? 'bg-[#FAF7F3]' : 'bg-[#111111]';
  const primaryArrowColor = isDarkVariant ? 'text-[#FAF7F3]' : 'text-[#111111]';
  const secondaryArrowColor = isDarkVariant ? 'text-[#111111]' : 'text-[#FAF7F3]';

  return (
    <span
      aria-hidden="true"
      className={`${boxStyles} relative overflow-hidden flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {isLiveVariant ? (
        direction === 'left' ? (
          <>
            {/* Mirrored live variant */}
            <span
              className={`rounded-full ${circleColor} absolute -bottom-[4px] -right-[4px] w-[1px] h-[1px] transition-all duration-300 ease-out group-hover:w-[48px] group-hover:h-[48px] group-focus-visible:w-[48px] group-focus-visible:h-[48px] pointer-events-none z-0`}
            />
            <span className={`${primaryArrowColor} absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-x-full group-focus-visible:-translate-x-full z-[1] pointer-events-none`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </span>
            <span className={`${secondaryArrowColor} absolute inset-0 flex items-center justify-center translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0 z-[1] pointer-events-none`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </span>
          </>
        ) : (
          <>
            {/* Expanding background circle on hover */}
            <span
              className={`rounded-full ${circleColor} absolute -bottom-[4px] -left-[4px] w-[1px] h-[1px] transition-all duration-300 ease-out group-hover:w-[48px] group-hover:h-[48px] group-focus-visible:w-[48px] group-focus-visible:h-[48px] pointer-events-none z-0`}
            />

            {/* Primary arrow: centered at rest, exits toward top-right on hover/focus (scaled 100% of box size) */}
            <span className={`${primaryArrowColor} absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full group-focus-visible:translate-x-full group-focus-visible:-translate-y-full z-[1] pointer-events-none`}>
              <svg
                width="13"
                height="13"
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

            {/* Secondary arrow: enters from bottom-left (-100% of box size) to center on hover/focus */}
            <span className={`${secondaryArrowColor} absolute inset-0 flex items-center justify-center -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 z-[1] pointer-events-none`}>
              <svg
                width="13"
                height="13"
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
          </>
        )
      ) : direction === 'up-right' ? (
        <>
          {/* Expanding background circle on hover */}
          <span
            className={`rounded-full ${circleColor} absolute -bottom-[4px] -left-[4px] w-[1px] h-[1px] transition-all duration-300 ease-out group-hover:w-[35px] group-hover:h-[35px] group-focus-visible:w-[35px] group-focus-visible:h-[35px] pointer-events-none z-0`}
          />

          {/* Primary arrow: centered at rest, exits toward top-right on hover/focus */}
          {isMd ? (
            <svg
              role="presentation"
              viewBox="0 0 24 24"
              className={`w-[20px] h-[20px] -rotate-45 ${primaryArrowColor} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out group-hover:left-[unset] group-hover:-right-[17px] group-hover:-top-[17px] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:left-[unset] group-focus-visible:-right-[17px] group-focus-visible:-top-[17px] group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 z-[1]`}
            >
              <path
                d="M 8 8 L 12 4 M 12 4 L 8 0 M 12 4 L 0 4"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(6 8)"
              />
            </svg>
          ) : (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${primaryArrowColor} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out group-hover:left-[unset] group-hover:-right-[17px] group-hover:-top-[17px] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:left-[unset] group-focus-visible:-right-[17px] group-focus-visible:-top-[17px] group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 z-[1]`}
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          )}

          {/* Secondary arrow: enters from bottom-left to center on hover/focus with inverted contrast color */}
          {isMd ? (
            <svg
              role="presentation"
              viewBox="0 0 24 24"
              className={`w-[20px] h-[20px] -rotate-45 ${secondaryArrowColor} absolute -bottom-[17px] -left-[17px] transition-all duration-300 ease-out group-hover:bottom-[unset] group-hover:left-1/2 group-hover:top-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-focus-visible:bottom-[unset] group-focus-visible:left-1/2 group-focus-visible:top-1/2 group-focus-visible:-translate-x-1/2 group-focus-visible:-translate-y-1/2 z-[1]`}
            >
              <path
                d="M 8 8 L 12 4 M 12 4 L 8 0 M 12 4 L 0 4"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(6 8)"
              />
            </svg>
          ) : (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${secondaryArrowColor} absolute -bottom-[17px] -left-[17px] transition-all duration-300 ease-out group-hover:bottom-[unset] group-hover:left-1/2 group-hover:top-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-focus-visible:bottom-[unset] group-focus-visible:left-1/2 group-focus-visible:top-1/2 group-focus-visible:-translate-x-1/2 group-focus-visible:-translate-y-1/2 z-[1]`}
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          )}
        </>
      ) : (
        <>
          {/* Mirrored: Expanding background circle on hover from bottom-right */}
          <span
            className={`rounded-full ${circleColor} absolute -bottom-[4px] -right-[4px] w-[1px] h-[1px] transition-all duration-300 ease-out group-hover:w-[35px] group-hover:h-[35px] group-focus-visible:w-[35px] group-focus-visible:h-[35px] pointer-events-none z-0`}
          />

          {/* Primary arrow: centered at rest, exits toward LEFT on hover/focus */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${primaryArrowColor} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out group-hover:-left-[17px] group-hover:translate-x-0 group-focus-visible:-left-[17px] group-focus-visible:translate-x-0 z-[1]`}
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>

          {/* Secondary arrow: enters from RIGHT to center on hover/focus with inverted contrast color */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${secondaryArrowColor} absolute -right-[17px] top-1/2 -translate-y-1/2 transition-all duration-300 ease-out group-hover:right-[unset] group-hover:left-1/2 group-hover:-translate-x-1/2 group-focus-visible:right-[unset] group-focus-visible:left-1/2 group-focus-visible:-translate-x-1/2 z-[1]`}
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </>
      )}
    </span>
  );
};

export default AnimatedArrowBox;
