import React, { useEffect, useRef, useState } from "react";

// CSS Keyframe animations injected once
const styleId = 'popup-animations';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes popupBackdropIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes popupBackdropOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes popupSlideIn {
      from { 
        opacity: 0; 
        transform: translateY(20px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
    @keyframes popupSlideOut {
      from { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
      to { 
        opacity: 0; 
        transform: translateY(20px) scale(0.95); 
      }
    }
    .popup-backdrop-enter {
      animation: popupBackdropIn 0.25s ease-out forwards;
    }
    .popup-backdrop-exit {
      animation: popupBackdropOut 0.2s ease-in forwards;
    }
    .popup-modal-enter {
      animation: popupSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .popup-modal-exit {
      animation: popupSlideOut 0.2s ease-in forwards;
    }
  `;
  document.head.appendChild(style);
}

export const Popup = ({ isOpen, onClose, title, children, closeOnOutside = true }) => {
  const containerRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const handleBackdropClick = (e) => {
    if (!closeOnOutside) return;
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose?.();
    }, 200);
  };

  // Handle mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (!isClosing) {
      setShouldRender(false);
    }
  }, [isOpen, isClosing]);

  // Keyboard and focus handling
  useEffect(() => {
    if (!shouldRender) return;
    const keyHandler = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", keyHandler);
    // Focus first input after animation starts
    setTimeout(() => {
      const preferred = containerRef.current?.querySelector('input, select, textarea');
      preferred?.focus();
    }, 100);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md z-50 p-2 sm:p-4 ${
        isClosing ? 'popup-backdrop-exit' : 'popup-backdrop-enter'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className={`pointer-events-auto bg-slate-800/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl p-5 sm:p-6 md:p-8 mx-auto relative border border-slate-700/50 max-h-[90vh] overflow-y-auto scroll-py-6 ring-1 ring-white/10 ${
          isClosing ? 'popup-modal-exit' : 'popup-modal-enter'
        }`}
      >
        {/* Close Button */}
        <button
          tabIndex={-1}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg transition-all duration-200"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Title */}
        {title && (
          <h2 className="text-lg sm:text-xl font-bold text-white/90 mb-5 pr-10">{title}</h2>
        )}
        {/* Content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
