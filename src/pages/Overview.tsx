import React, { useEffect, useState } from 'react';
import { Store, DollarSign, Users, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import { Customer, Sale, Product, Shop } from '../types';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

function Overview() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [customersRes, salesRes, productsRes, shopsRes] = await Promise.all([
          api.getCustomers(),
          api.getSales(),
          api.getProducts(),
          api.getShops(),
        ]);

        setCustomers(customersRes.data?.data || []);
        setSales(salesRes.data?.data || []);
        setProducts(productsRes.data?.data || []);
        setShops(shopsRes.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSales = Array.isArray(sales) ? sales.reduce((sum, sale) => sum + (sale.cashPaidAmount || 0), 0) : 0;

  const recentSales = Array.isArray(sales) 
    ? [...sales]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    : [];

  const chartData = Array.isArray(sales) ? sales.map(sale => ({
    date: new Date(sale.createdAt).toLocaleDateString(),
    amount: sale.cashPaidAmount
  })) : [];

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
          <p className="text-gray-300">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar activeTab="overview" />
      
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Shops" value={shops.length} Icon={Store} />
          <StatCard title="Total Sales" value={`$${totalSales.toFixed(2)}`} Icon={DollarSign} />
          <StatCard title="Total Customers" value={customers.length} Icon={Users} />
          <StatCard title="Total Products" value={products.length} Icon={Package} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Sales Trend</h2>
            <div className="h-[400px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: 'none' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No sales data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
            <div className="space-y-4">
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">ID: {sale.id}</p>
                      <p className="font-medium">${sale.cashPaidAmount.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-400">{new Date(sale.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No recent sales</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Overview;