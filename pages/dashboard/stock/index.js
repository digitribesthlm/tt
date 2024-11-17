import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProductDetailModal from '../../../components/ProductDetailModal';
import { FaSync, FaSearch, FaEye, FaTable, FaTh, FaImage } from 'react-icons/fa';

export default function StockManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shopify/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase()) ||
    product.variant.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with view toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <div className="flex items-center space-x-4">
            <div className="btn-group">
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active' : ''}`}
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-active' : ''}`}
              >
                <FaTable className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={fetchProducts}
              className="btn btn-primary"
              disabled={loading}
            >
              <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Type</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <span className="loading loading-spinner loading-md"></span>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="flex items-center space-x-3">
                          {product.image?.src && (
                            <img
                              src={product.image.src}
                              alt={product.image.alt || product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <div className="font-bold">{product.title}</div>
                            <div className="text-sm text-gray-500">{product.vendor}</div>
                          </div>
                        </td>
                        <td>{product.variant.sku || '-'}</td>
                        <td>{product.product_type}</td>
                        <td>
                          <span className={`
                            px-2 py-1 rounded-full text-sm
                            ${product.variant.inventory_quantity <= 0 ? 'bg-red-100 text-red-800' :
                              product.variant.inventory_quantity < 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}
                          `}>
                            {product.variant.inventory_quantity}
                          </span>
                        </td>
                        <td>${product.variant.price}</td>
                        <td>{product.status || '-'}</td>
                        <td>{product.created_at || '-'}</td>
                        <td>{product.updated_at || '-'}</td>
                        <td>
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="btn btn-sm btn-ghost"
                            title="View Details"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="aspect-square relative">
                    {product.image?.src ? (
                      <img
                        src={product.image.src}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FaImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="btn btn-circle btn-sm btn-ghost bg-white/80 hover:bg-white"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                      <p className="text-sm text-gray-500">{product.vendor}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">
                        ${product.variant.price}
                      </span>
                      <span className={`
                        px-2 py-1 rounded-full text-sm
                        ${product.variant.inventory_quantity <= 0 ? 'bg-red-100 text-red-800' :
                          product.variant.inventory_quantity < 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}
                      `}>
                        Stock: {product.variant.inventory_quantity}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">SKU: {product.variant.sku || '-'}</span>
                      <span className={`
                        px-2 py-1 rounded-full
                        ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 