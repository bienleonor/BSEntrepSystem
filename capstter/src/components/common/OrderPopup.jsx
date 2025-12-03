import React, { useEffect, useRef } from "react";

export const OrderPopup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  closeOnOutside = true
}) => {
  const containerRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (!closeOnOutside) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  // Keep hook order stable; only act when open
  useEffect(() => {
    if (!isOpen) return;
    const keyHandler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", keyHandler);
    const focusable = containerRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
    return () => window.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md z-50 p-3 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div 
        ref={containerRef} 
        className="bg-slate-800/95 backdrop-blur-xl rounded-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg lg:max-w-xl p-5 sm:p-8 relative max-h-[90vh] overflow-y-auto border border-slate-700/50 ring-1 ring-slate-600/20"
      >
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full"
          onClick={onClose}
          aria-label="Close order popup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 pr-12 text-slate-100 tracking-tight">
            {title}
          </h2>
        )}
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
};
