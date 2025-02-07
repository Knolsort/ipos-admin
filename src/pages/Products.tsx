import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Product } from '../types';
import Sidebar from '../components/Sidebar';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.getProducts();
        setProducts(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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
          <p className="text-gray-300">Please wait while we fetch the products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar activeTab="products" />
      
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-400 mb-4">{product.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.unitTypes.map((unit) => (
                    <span
                      key={unit}
                      className="px-2 py-1 bg-purple-900 text-purple-200 rounded-full text-sm"
                    >
                      {unit}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Code: {product.productCode}</span>
                  <span>•</span>
                  <span>{product.assured ? 'Assured' : 'Not Assured'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Products;