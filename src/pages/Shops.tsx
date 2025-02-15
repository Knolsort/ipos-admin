import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Shop } from '../types';
import Sidebar from '../components/Sidebar';

function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true);
        const response = await api.getShops();
        setShops(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError('Failed to load shops');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-300">Please wait while we fetch the shops</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar activeTab="shops" />
      
      <main className="flex-1 p-5 pb-20 md:pb-5">
        <h1 className="text-3xl font-bold mb-8">Shops</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={shop.logo} 
                alt={shop.name} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{shop.name}</h3>
                <p className="text-gray-400 mb-2">{shop.location}</p>
                <p className="text-gray-400 mb-2">Phone: {shop.phone}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>GST: {shop.gst ? 'Yes' : 'No'}</span>
                  <span>•</span>
                  <span>Created: {new Date(shop.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Shops;