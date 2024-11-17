import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { FaTag, FaShoppingCart, FaPalette, FaDollarSign } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (productId) => {
    router.push(`/dashboard/products/${productId}`);
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

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalSales = products.reduce((acc, p) => acc + (p.sales?.length || 0), 0);
  const averagePrice = products.reduce((acc, p) => {
    const variants = p.variants || [];
    const avgProductPrice = variants.reduce((sum, v) => sum + v.price, 0) / variants.length;
    return acc + avgProductPrice;
  }, 0) / totalProducts;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to Tattoo Dashboard!</h1>
          <p className="text-gray-600">Here's an overview of your tattoo designs and sales.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-600 mb-1">Total Products</div>
                <div className="text-3xl font-bold">{totalProducts}</div>
              </div>
              <FaTag className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-600 mb-1">Active Designs</div>
                <div className="text-3xl font-bold">{activeProducts}</div>
              </div>
              <FaPalette className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-600 mb-1">Total Sales</div>
                <div className="text-3xl font-bold">{totalSales}</div>
              </div>
              <FaShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-600 mb-1">Avg. Price</div>
                <div className="text-3xl font-bold">${averagePrice.toFixed(2)}</div>
              </div>
              <FaDollarSign className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Style</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.slice(0, 5).map((product) => (
                  <tr 
                    key={product.internal_id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(product.internal_id)}
                  >
                    <td className="px-4 py-3 text-sm">{product.internal_id}</td>
                    <td className="px-4 py-3 text-sm flex items-center space-x-2">
                      {product.images?.[0]?.src && (
                        <img 
                          src={product.images[0].src} 
                          alt={product.title}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span>{product.title}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.category}</td>
                    <td className="px-4 py-3 text-sm">{product.style}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.sales?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 text-left hover:bg-gray-50 rounded-lg border">
              <h3 className="font-medium">Add New Design</h3>
              <p className="text-sm text-gray-600">Upload a new tattoo design</p>
            </button>
            <button className="p-4 text-left hover:bg-gray-50 rounded-lg border">
              <h3 className="font-medium">Manage Inventory</h3>
              <p className="text-sm text-gray-600">Update stock and prices</p>
            </button>
            <button className="p-4 text-left hover:bg-gray-50 rounded-lg border">
              <h3 className="font-medium">View Sales Report</h3>
              <p className="text-sm text-gray-600">Analyze your sales data</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 