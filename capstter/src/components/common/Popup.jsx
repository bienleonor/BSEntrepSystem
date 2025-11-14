export const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-bronze rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl p-4 sm:p-6 md:p-8 mx-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Popup;