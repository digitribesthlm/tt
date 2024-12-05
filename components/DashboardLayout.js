import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from './Footer';
import { FaHome, FaBox, FaSignOutAlt, FaBars } from 'react-icons/fa';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    console.log('DashboardLayout mounted, current path:', router.pathname);
    const userData = localStorage.getItem('user');
    console.log('User data from localStorage:', userData ? 'exists' : 'not found');
    
    if (!userData) {
      console.log('No user data found, redirecting to home');
      router.push('/');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      console.log('User data parsed successfully');
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/');
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: 'Stock Management',
      path: '/dashboard/stock',
      icon: <FaBox className="w-5 h-5" />,
    },
  ];

  // If we're still loading the user, show a loading state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <FaBars className="h-6 w-6" />
                </button>
                <span className="text-xl font-bold text-gray-800 ml-2">Admin Panel</span>
              </div>
              <div className="hidden lg:flex lg:items-center lg:ml-6 lg:space-x-4">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      router.pathname === item.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-base font-medium ${
                  router.pathname === item.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}