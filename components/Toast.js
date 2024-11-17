export default function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
} 