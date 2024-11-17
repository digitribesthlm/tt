import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from './Footer';
import { FaHome, FaBox, FaSignOutAlt, FaBars } from 'react-icons/fa';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col">
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
              <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                {menuItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      router.pathname === item.path
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-2 text-base font-medium ${
                    router.pathname === item.path
                      ? 'text-blue-500 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-8 py-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
} 