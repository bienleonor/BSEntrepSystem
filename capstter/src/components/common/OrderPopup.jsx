export const OrderPopup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  closeOnOutside = true // default true
}) => {
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
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-300 rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};
