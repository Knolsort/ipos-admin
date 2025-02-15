import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, ShoppingCart, Users, Package } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview', path: '/' },
    { id: 'shops', icon: Store, label: 'Shops', path: '/shops' },
    { id: 'sales', icon: ShoppingCart, label: 'Sales', path: '/sales' },
    { id: 'customers', icon: Users, label: 'Customers', path: '/customers' },
    { id: 'products', icon: Package, label: 'Products', path: '/products' },
  ];

  return (
    <>
      <div className="hidden md:block sticky top-0 left-0 w-64 bg-gray-900  max-h-screen p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Store className="w-8 h-8 text-purple-500" />
          <h1 className="text-white text-xl font-bold">POS Admin</h1>
        </div>
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-2 p-3 rounded-lg mb-2 ${isActive
                  ? 'bg-purple-900 text-purple-200'
                  : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className='fixed md:hidden bottom-0 left-0 w-full z-40 bg-gray-900 p-4'>
        <nav className='flex justify-between overflow-auto hide-scrollbar'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-2 p-3 rounded-lg  ${isActive
                  ? 'bg-purple-900 text-purple-200'
                  : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;