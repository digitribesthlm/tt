import { useState } from 'react';

export default function StatusToggle({ productId, initialStatus, onStatusChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const handleToggle = async () => {
    setIsLoading(true);
    const newStatus = status === 'published' ? 'unpublished' : 'published';

    try {
      const response = await fetch(`/api/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert the toggle if there's an error
      setStatus(status);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${status === 'published' ? 'bg-green-500' : 'bg-gray-200'}
        `}
      >
        <span className="sr-only">Toggle status</span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${status === 'published' ? 'translate-x-5' : 'translate-x-0'}
            ${isLoading ? 'opacity-50' : ''}
          `}
        />
      </button>
      <span className={`text-sm ${status === 'published' ? 'text-green-600' : 'text-gray-500'}`}>
        {isLoading ? '...' : status === 'published' ? 'Published' : 'Unpublished'}
      </span>
    </div>
  );
} 