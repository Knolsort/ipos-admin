import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Product } from '../types';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { Edit, Plus, ShieldAlert, ShieldCheck } from 'lucide-react';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.getProducts();
        setProducts(response.data.data || []);
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

      <main className="flex-1 p-5 pb-24 md:pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold ">Products</h1>
          <Link to={'/create-products'} className='btn btn-sm btn-secondary'> <Plus /> </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative bg-gray-900 rounded-lg overflow-hidden ">
              <Link to="/edit-product" state={{ product }} className='btn btn-sm btn-secondary absolute top-2 right-2'><Edit /></Link>
              <div className='w-full bg-white p-2'>
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="mx-auto bg-white h-48 "
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4 relative">

                <div className="flex gap-1">
                  <span className='mt-1'>{product.assured ? <ShieldCheck className='text-green-500 ' /> : <ShieldAlert className='text-red-500' />}</span>
                  <div className="flex flex-col p-0 m-0">
                    <span className="text-xl font-bold">{product.name}</span>
                    <span className=" font-bold text-purple-200 text-sm">{product.brand?.name}</span>
                  </div>
                </div>
                {product.description && (
                  <p className="text-gray-400 mb-4">{product.description}</p>
                )}
                <div className="flex justify-between items-center gap-2 text-sm text-gray-400">
                  <span>Category: </span> <span className='text-gray-500'>{product.category.name}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400 flex-wrap gap-2 mt-1">
                  Unit Types:
                  <div className="flex gap-2">
                    {product.unitTypes.map((unit) => (
                      <span
                        key={unit}
                        className="text-sm text-gray-500"
                      >
                        {unit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-2 text-sm text-gray-400">
                  <span>Code: </span> <span className='text-gray-500'>{product.productCode}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-sm text-gray-400">
                  <span>Slug:</span><span className='text-gray-500'>{product.slug}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-sm text-gray-400">
                  <span>Barcode: </span> <span className='text-gray-500'>{product.barcode}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-sm text-gray-400">
                  <span>Other names:</span>
                  <div className="flex gap-2">
                    {product.otherNames.map((name) => (
                      <span
                        key={name}
                        className="text-sm text-gray-500"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
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