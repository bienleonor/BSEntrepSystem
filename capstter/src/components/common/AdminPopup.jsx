import React, { useEffect, useRef } from "react";

export const AdminPopup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  closeOnOutside = true,
  maxWidth = 'max-w-md', // Tailwind width cap, e.g., 'max-w-4xl'
}) => {
  const containerRef = useRef(null);
  const openedAtRef = useRef(0);
  const hasInitialFocusRef = useRef(false);

  const handleBackdropClick = (e) => {
    if (!closeOnOutside) return;
    if (e.target !== e.currentTarget) return;
    // Prevent immediate closing on the same click that opened the popup
    const sinceOpen = Date.now() - openedAtRef.current;
    if (sinceOpen < 120) return; // debounce threshold (ms)
    onClose?.();
  };

  // Reset initial focus flag when popup closes
  useEffect(() => {
    if (!isOpen) {
      hasInitialFocusRef.current = false;
    }
  }, [isOpen]);

  // Handle keyboard and initial focus - only focus on first open
  useEffect(() => {
    if (!isOpen) return;
    openedAtRef.current = Date.now();
    
    const keyHandler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", keyHandler);
    
    // Only set initial focus once when popup opens, not on every re-render
    if (!hasInitialFocusRef.current) {
      hasInitialFocusRef.current = true;
      // Focus the first input/select/textarea, or fall back to container
      const firstInput = containerRef.current?.querySelector(
        'input:not([type="hidden"]):not([readonly]), select, textarea'
      );
      if (firstInput) {
        firstInput.focus();
      } else {
        containerRef.current?.focus();
      }
    }
    
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
      <div ref={containerRef} tabIndex={-1} className={`bg-black-300 rounded-t-xl sm:rounded-lg shadow-lg w-full ${maxWidth} p-4 sm:p-6 relative max-h-[85vh] overflow-y-auto border border-slate-600`}>
        <button
          className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onClick={onClose}
          aria-label="Close popup"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
        {title && <h2 className="text-xl sm:text-2xl font-bold mb-4 pr-10 text-white">{title}</h2>}
        <div className="space-y-4 text-white">{children}</div>
      </div>
    </div>
  );
};
