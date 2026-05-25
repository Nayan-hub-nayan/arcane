import React from 'react';
import { X, Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="trailer-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            id="trailer-modal-card"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-primary/20 bg-surface-container-low shadow-[0_0_50px_rgba(189,0,255,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Title */}
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary fill-primary" />
                <span className="font-display font-bold text-lg text-primary tracking-wide">
                  ARCANE OFFICIAL CINEMATIC
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-surface-variant transition-colors text-on-surface hover:text-primary"
                id="close-trailer-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video / Simulator */}
            <div className="relative aspect-video w-full bg-slate-950">
              <iframe
                className="w-full h-full border-0"
                src="https://www.youtube.com/embed/fXmAurh012s?autoplay=1&rel=0"
                title="Arcane | Official Trailer | Netflix"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
            </div>

            {/* Footer description */}
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-container-lowest">
              <div className="flex gap-3 items-start">
                <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-medium text-white text-sm">
                    League of Legends • Animated Masterpiece
                  </h4>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Set in the utopian region of Piltover and the oppressed underground of Zaun, 
                    the story follows the origins of two iconic League champions-and the power that will tear them apart.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-primary bg-primary/10 px-3 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                LIVE SIMULATION
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
