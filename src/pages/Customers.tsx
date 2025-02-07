import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Customer } from '../types';
import Sidebar from '../components/Sidebar';

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await api.getCustomers();
        setCustomers(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
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
          <p className="text-gray-300">Please wait while we fetch the customers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar activeTab="customers" />
      
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Customers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={customer.image}
                  alt={customer.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/64x64?text=User';
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold">{customer.name}</h3>
                  <p className="text-gray-400">{customer.phone}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Joined: {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Customers;