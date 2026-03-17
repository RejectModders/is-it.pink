'use client';

import { motion } from 'framer-motion';

export function GameFooter() {
  return (
    <motion.footer 
      className="border-t border-border p-3 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground bg-card/50 backdrop-blur-xl"
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <p>
        Made with <span className="text-primary">love</span> by{' '}
        <a href="https://github.com/RejectModders" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
          RejectModders
        </a>
        {' | '}
        <a href="https://github.com/RejectModders/is-it.pink" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
          Open Source
        </a>
      </p>
    </motion.footer>
  );
}
