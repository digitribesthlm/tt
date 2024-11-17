import { FaTimes, FaBox, FaTag, FaClock, FaImage } from 'react-icons/fa';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Images and Basic Info */}
            <div className="space-y-6">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {product.image?.src ? (
                  <img
                    src={product.image.src}
                    alt={product.image.alt || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.all_images?.slice(1).map((img, index) => (
                  <img
                    key={img.id}
                    src={img.src}
                    alt={`Product image ${index + 2}`}
                    className="aspect-square rounded-lg object-cover"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Vendor</span>
                    <p>{product.vendor}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type</span>
                    <p>{product.product_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <p className={`inline-flex px-2 py-1 rounded-full text-sm ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Handle</span>
                    <p className="truncate">{product.handle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Variants and Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Main Variant Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">SKU</span>
                    <p>{product.variant.sku || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price</span>
                    <p>${product.variant.price}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Stock</span>
                    <p className={`inline-flex px-2 py-1 rounded-full text-sm ${
                      product.variant.inventory_quantity <= 0 ? 'bg-red-100 text-red-800' :
                      product.variant.inventory_quantity < 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {product.variant.inventory_quantity}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Weight</span>
                    <p>{product.variant.weight} {product.variant.weight_unit}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Description</h3>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.body_html }}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Created</span>
                    <p>{new Date(product.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Updated</span>
                    <p>{new Date(product.updated_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Published</span>
                    <p>{product.published_at ? new Date(product.published_at).toLocaleString() : '-'}</p>
                  </div>
                </div>
              </div>

              {product.tags && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 