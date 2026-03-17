'use client';

import { X, Share2, Twitter, MessageCircle, Copy, Check, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  shareText: string;
  copied: boolean;
  copyToClipboard: () => void;
  shareToTwitter: () => void;
  shareToWhatsApp: () => void;
}

export function ShareModal({
  showShareModal,
  setShowShareModal,
  shareText,
  copied,
  copyToClipboard,
  shareToTwitter,
  shareToWhatsApp,
}: ShareModalProps) {
  return (
    <AnimatePresence>
      {showShareModal && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
          <motion.div
            className="relative bg-card border border-border rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share Your Score
            </h3>
            
            <div className="bg-muted p-4 rounded-xl mb-4 text-sm">
              {shareText}
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <motion.button
                onClick={shareToTwitter}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.06 }}
              >
                <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                <span className="text-xs font-medium">Twitter</span>
              </motion.button>
              <motion.button
                onClick={shareToWhatsApp}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.06 }}
              >
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
                <span className="text-xs font-medium">WhatsApp</span>
              </motion.button>
              <motion.button
                onClick={copyToClipboard}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.06 }}
              >
                {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                <span className="text-xs font-medium">{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>
            
            <motion.button
              onClick={copyToClipboard}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.06 }}
            >
              <Link2 className="w-4 h-4" />
              {copied ? 'Copied to Clipboard!' : 'Copy Link'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
