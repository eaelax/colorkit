'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy } from 'lucide-react';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  colorPreview?: string;
}

interface ToastContextType {
  showToast: (title: string, description?: string, colorPreview?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, description?: string, colorPreview?: string) => {
    toastIdCounter++;
    const id = `toast-${Date.now()}-${toastIdCounter}`;
    setToasts((prev) => [...prev, { id, title, description, colorPreview }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        id="toast-container"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900/95 dark:bg-neutral-100/95 text-neutral-100 dark:text-neutral-900 shadow-xl backdrop-blur-md border border-neutral-800 dark:border-neutral-200 text-sm font-medium"
            >
              {toast.colorPreview ? (
                <div
                  className="w-5 h-5 rounded-md shadow-inner ring-1 ring-white/20 dark:ring-black/20 shrink-0"
                  style={{ backgroundColor: toast.colorPreview }}
                />
              ) : (
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 dark:text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold leading-tight">{toast.title}</span>
                {toast.description && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono mt-0.5">
                    {toast.description}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
