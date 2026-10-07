import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Youtube, Github, ExternalLink } from 'lucide-react';

interface SocialIconProps {
  platform: 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'x' | 'github' | 'reddit' | string;
  url: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, url }) => {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        return <Twitter className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'reddit':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8c2.648 0 5.028 .826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59 -4.03 6.5 -9 6.5c-4.875 0 -8.845 -2.8 -9 -6.294l-1 -.206a2.5 2.5 0 0 1 2.326 -4.36c1.646 -1.313 4.026 -2.14 6.674 -2.14l.999 0" />
            <path d="M12 8l1 -5l6 1" />
            <circle cx="19" cy="4" r="1.25" fill="currentColor" stroke="none" />
            <circle cx="9" cy="13" r="1.25" fill="currentColor" stroke="none" />
            <circle cx="15" cy="13" r="1.25" fill="currentColor" stroke="none" />
            <path d="M10 17c.667 .333 1.333 .5 2 .5s1.333 -.167 2 -.5" />
          </svg>
        );
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-12 h-12 rounded-full border border-dark/15 flex items-center justify-center text-dark/70 hover:text-dark hover:border-dark hover:bg-dark/5 transition-all duration-300"
      aria-label={`Link to ${platform}`}
    >
      {getIcon()}
    </motion.a>
  );
};
