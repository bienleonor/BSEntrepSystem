export const Popup = ({ isOpen, onClose, title, children, closeOnOutside = true }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (!closeOnOutside) return;
    // Only close if the click originated on the backdrop, not on inner content
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="bg-slate-300 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl p-4 sm:p-6 md:p-8 mx-auto relative border border-slate-700"
      >
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-200"
          onClick={onClose}
          aria-label="Close popup"
        >
          &times;
        </button>
        {title && <h2 className="text-lg font-semibold mb-4 ">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Popup;