export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 