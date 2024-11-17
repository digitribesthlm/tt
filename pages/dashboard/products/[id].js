import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';
import ProductEditForm from '../../../components/ProductEditForm';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import Toast from '../../../components/Toast';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update product');

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
      // You might want to add error handling UI here
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setToast({
        message: 'Product successfully deleted',
        type: 'success'
      });

      // Wait a moment before redirecting
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error deleting product:', error);
      setToast({
        message: 'Failed to delete product',
        type: 'error'
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          {!isEditing && (
            <div className="flex space-x-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-outline btn-primary"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-outline btn-error"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ProductEditForm 
              product={product}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          // Product Overview
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {product.images?.[0]?.src ? (
                  <img 
                    src={product.images[0].src}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images?.map((image, index) => (
                    <img 
                      key={index}
                      src={image.src}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                  <div className="flex space-x-2">
                    <span className="badge badge-primary">{product.category}</span>
                    <span className="badge badge-secondary">{product.style}</span>
                    <span className={`badge ${
                      product.status === 'active' ? 'badge-success' : 'badge-error'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Variants</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {product.variants?.map((variant, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="font-medium">{variant.title}</div>
                          <div className="text-gray-600">${variant.price}</div>
                          <div className="text-sm text-gray-500">
                            Stock: {variant.inventory_quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {product.metadata?.tattoo_details && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tattoo Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Placement: </span>
                          {product.metadata.tattoo_details.placement_suggestions.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Healing Time: </span>
                          {product.metadata.tattoo_details.healing_time}
                        </div>
                        <div>
                          <span className="font-medium">Pain Level: </span>
                          {product.metadata.tattoo_details.pain_level}/10
                        </div>
                        <div>
                          <span className="font-medium">Complexity: </span>
                          {product.metadata.tattoo_details.complexity}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleDelete} 
        title="Confirm Deletion" 
        message="Are you sure you want to delete this product?"
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </DashboardLayout>
  );
} 