import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

interface FormButtonProps {
  text?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  text = 'Send Message',
  loading = false,
  disabled = false,
}) => {
  return (
    <motion.button
      type="submit"
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-cream text-dark hover:bg-white rounded-xl font-sans font-semibold text-base tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Sending...</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </motion.button>
  );
};
