import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Sale } from '../types';
import Sidebar from '../components/Sidebar';

function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const response = await api.getSales();
        setSales(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setError('Failed to load sales');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
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
          <p className="text-gray-300">Please wait while we fetch the sales</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar activeTab="sales" />
      
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Sales</h1>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Sale Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Sale Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sale.saleNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${sale.saleAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sale.saleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Sales;