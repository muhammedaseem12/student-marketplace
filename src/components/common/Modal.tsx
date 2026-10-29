'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-slate-900/45 animate-fade-in" aria-hidden="true" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="studora-modal-title"
        className={`relative z-10 flex max-h-[85dvh] w-full min-h-0 flex-col overflow-hidden rounded-t-2xl border border-sky-100 bg-white shadow-2xl sm:rounded-2xl ${maxWidth} dark:border-slate-800 dark:bg-slate-900`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-sky-100 px-4 py-4 sm:px-6 dark:border-slate-800">
          <h3 id="studora-modal-title" className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-sky-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">
          {children}
        </div>
      </section>
    </div>,
    document.body
  );
};
