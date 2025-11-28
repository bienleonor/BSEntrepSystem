import React, { useEffect, useRef } from "react";

export const Popup = ({ isOpen, onClose, title, children, closeOnOutside = true }) => {
  const containerRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (!closeOnOutside) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  // Run effect only when open to avoid hook order change issues and extraneous listeners
  useEffect(() => {
    if (!isOpen) return; // guard: do nothing when closed
    const keyHandler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", keyHandler);
    // Prefer first input/select/textarea over close button to avoid "focus lock" perception
    const preferred = containerRef.current?.querySelector('input, select, textarea');
    preferred?.focus();
    return () => window.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);

  if (!isOpen) return null; // placed after hooks to keep hook order stable

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-2"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={containerRef}
        // Ensure inner container captures pointer events and does not bubble to backdrop
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto bg-slate-300 rounded-t-xl sm:rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl p-4 sm:p-6 md:p-8 mx-auto relative border border-slate-700 max-h-[90vh] overflow-y-auto scroll-py-6"
      >
        <button
          tabIndex={-1}
          className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onClick={onClose}
          aria-label="Close popup"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
        {title && <h2 className="text-base sm:text-lg font-semibold mb-4 pr-10">{title}</h2>}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default Popup;