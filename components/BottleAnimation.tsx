import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottleAnimationProps {
  onAnimationComplete: () => void;
}

const BottleAnimation: React.FC<BottleAnimationProps> = ({ onAnimationComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-64 h-64 flex flex-col items-center justify-center">
        
        {/* Paper falling animation */}
        <motion.div
          initial={{ y: -200, opacity: 0, scale: 1, rotate: 0 }}
          animate={{ 
            y: 40, 
            opacity: [0, 1, 1, 0], 
            scale: 0.2,
            rotate: 720
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          onAnimationComplete={onAnimationComplete}
          className="absolute z-10"
        >
          <div className="w-16 h-20 bg-yellow-100 border border-yellow-200 shadow-md flex items-center justify-center">
            <span className="text-[8px] text-gray-400">Notes...</span>
          </div>
        </motion.div>

        {/* Bottle SVG */}
        <svg viewBox="0 0 100 200" className="w-32 h-64 drop-shadow-xl">
          <motion.path
            d="M 30 0 L 70 0 L 70 40 L 90 60 L 90 190 Q 90 200 80 200 L 20 200 Q 10 200 10 190 L 10 60 L 30 40 Z"
            fill="rgba(255, 255, 255, 0.4)"
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          />
          {/* Cork */}
          <rect x="30" y="-10" width="40" height="10" fill="#8B4513" rx="2" />
        </svg>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-[-40px] text-white font-medium"
        >
          Bottling your thoughts...
        </motion.div>
      </div>
    </div>
  );
};

export default BottleAnimation;