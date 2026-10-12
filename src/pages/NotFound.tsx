import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { hapticVeryLight } from '../utils/haptics';

export const NotFound: React.FC = () => {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-transparent">
      <div className="max-w-md flex flex-col items-center gap-6">
        <span className="font-sans text-sm font-semibold tracking-widest uppercase text-dark/40 dark:text-[#8F8B84]">
          Error 404
        </span>
        <h1 className="framer-h1 font-extrabold text-dark dark:text-[#FAF7F3] leading-none">
          404
        </h1>
        <p className="framer-title-22 text-dark/70 dark:text-[#B8B4AD] font-medium">
          The page you’re looking for doesn’t exist or has been relocated.
        </p>

        <Link
          to="/"
          onClick={() => hapticVeryLight()}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-dark text-cream hover:bg-dark/90 dark:bg-[#FAF7F3] dark:text-[#0D0D0C] dark:hover:bg-[#FFFFFF] text-sm font-semibold transition-all shadow-md active:scale-95 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
