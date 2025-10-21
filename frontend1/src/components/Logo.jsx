import React from 'react';
import { motion } from 'framer-motion';
import logoPng from '../pages/2896418.png';

function Logo({
  className = '',
  onClick,
  showText = true,
  iconSizeClass = 'w-8 h-8 md:w-10 md:h-10',
  innerImgSizeClass = 'w-8 h-8 md:w-9 md:h-9',
  containerGradientClass = 'bg-gradient-to-r from-cyan-500 to-blue-500',
  textSizeClass = 'text-xl md:text-2xl',
  subtitle = 'Code • Learn • Solve',
  withButtonWrapper = false
}) {
  const Content = (
    <div className={`flex items-center gap-3 min-w-0 group ${className || ''}`}
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`${iconSizeClass} ${containerGradientClass} rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/20 group-hover:shadow-cyan-500/40 transition-all duration-300`}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={innerImgSizeClass}
        >
          <img src={logoPng} alt="CoderWorld Logo" className="w-full h-full object-contain" />
        </motion.div>
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSizeClass} font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 truncate`}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            CoderWorld
          </span>
          <span
            className="text-xs text-slate-400 group-hover:text-cyan-400 transition-colors duration-300 hidden md:block"
            style={{ fontFamily: "'Source Code Pro', monospace" }}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );

  if (withButtonWrapper) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex items-center gap-3 min-w-0 group"
      >
        {Content}
      </motion.button>
    );
  }

  return (
    <div onClick={onClick} className="cursor-pointer">
      {Content}
    </div>
  );
}

export default Logo;






