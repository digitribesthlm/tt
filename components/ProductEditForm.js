import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

export default function ProductEditForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: product.title || '',
    description: product.description || '',
    category: product.category || '',
    style: product.style || '',
    status: product.status || 'active',
    is_unique: product.is_unique || false,
    variants: product.variants || [],
    metadata: {
      tattoo_details: {
        placement_suggestions: product.metadata?.tattoo_details?.placement_suggestions || [],
        healing_time: product.metadata?.tattoo_details?.healing_time || '',
        pain_level: product.metadata?.tattoo_details?.pain_level || 5,
        complexity: product.metadata?.tattoo_details?.complexity || 'Medium',
        style_notes: product.metadata?.tattoo_details?.style_notes || ''
      },
      artist_notes: product.metadata?.artist_notes || '',
      care_instructions: product.metadata?.care_instructions || ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [section]: {
          ...prev.metadata[section],
          [field]: value
        }
      }
    }));
  };

  const handlePlacementChange = (e) => {
    const placements = e.target.value.split(',').map(p => p.trim());
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tattoo_details: {
          ...prev.metadata.tattoo_details,
          placement_suggestions: placements
        }
      }
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === 'price' ? parseFloat(value) : value
    };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <input
          type="text"
          name="style"
          value={formData.style}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="select select-bordered"
        >
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Is Unique</label>
        <input
          type="checkbox"
          name="is_unique"
          checked={formData.is_unique}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Variants</label>
        {formData.variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="variants.price"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1">
        <label className="block text-sm font-medium text-gray-700">Metadata</label>
        <div className="grid grid-cols-1">
          <label className="block text-sm font-medium text-gray-700">Tattoo Details</label>
          <div className="grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-700">Placement Suggestions</label>
            <input
              type="text"
              name="metadata.tattoo_details.placement_suggestions"
              value={formData.metadata.tattoo_details.placement_suggestions.join(',')}
              onChange={handlePlacementChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-700">Healing Time</label>
            <input
              type="text"
              name="metadata.tattoo_details.healing_time"
              value={formData.metadata.tattoo_details.healing_time}
              onChange={handleMetadataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-700">Pain Level</label>
            <input
              type="number"
              name="metadata.tattoo_details.pain_level"
              value={formData.metadata.tattoo_details.pain_level}
              onChange={handleMetadataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-700">Complexity</label>
            <select
              name="metadata.tattoo_details.complexity"
              value={formData.metadata.tattoo_details.complexity}
              onChange={handleMetadataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="grid grid-cols-1">
            <label className="block text-sm font-medium text-gray-700">Style Notes</label>
            <textarea
              name="metadata.tattoo_details.style_notes"
              value={formData.metadata.tattoo_details.style_notes}
              onChange={handleMetadataChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1">
          <label className="block text-sm font-medium text-gray-700">Artist Notes</label>
          <textarea
            name="metadata.artist_notes"
            value={formData.metadata.artist_notes}
            onChange={handleMetadataChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-1">
          <label className="block text-sm font-medium text-gray-700">Care Instructions</label>
          <textarea
            name="metadata.care_instructions"
            value={formData.metadata.care_instructions}
            onChange={handleMetadataChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-6">
        <button type="submit" className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <FaSave className="mr-2 h-4 w-4" />
          Save
        </button>
        <button type="button" onClick={onCancel} className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <FaTimes className="mr-2 h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
} 