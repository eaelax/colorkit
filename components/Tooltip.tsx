'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: number;
}

/**
 * Universal Tooltip component adhering to theme requirements:
 * - In LIGHT mode: Dark container (bg-slate-900 text-white)
 * - In DARK mode: Light container (bg-white text-slate-950)
 */
export default function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
  delay = 100,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Position positioning classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          className={`pointer-events-none absolute z-50 whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold rounded-md shadow-lg transition-opacity duration-150 animate-in fade-in zoom-in-95 ${positionClasses}
            /* In Light Mode: Dark text box with white text */
            bg-slate-900 text-white border border-slate-800
            /* In Dark Mode: Light text box with dark text */
            dark:bg-white dark:text-slate-950 dark:border-slate-200
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}
