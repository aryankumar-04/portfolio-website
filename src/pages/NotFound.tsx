import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-transparent">
      <div className="max-w-md flex flex-col items-center gap-6">
        <span className="font-sans text-sm font-semibold tracking-widest uppercase text-dark/40">
          Error 404
        </span>
        <h1 className="framer-h1 font-extrabold text-dark leading-none">
          404
        </h1>
        <p className="framer-title-22 text-dark/70 font-medium">
          The page you’re looking for doesn’t exist or has been relocated.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-dark text-cream text-sm font-semibold hover:bg-dark/90 transition-all shadow-md active:scale-95 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
