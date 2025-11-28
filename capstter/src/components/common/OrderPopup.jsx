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
      className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-2"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div ref={containerRef} className="bg-slate-300 rounded-t-xl sm:rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6 relative max-h-[85vh] overflow-y-auto border border-slate-600">
        <button
          className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onClick={onClose}
          aria-label="Close order popup"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
        {title && <h2 className="text-xl sm:text-2xl font-bold mb-4 pr-10">{title}</h2>}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
