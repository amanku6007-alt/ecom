import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../../store/slices/productSlice';
import ProductCard from '../../components/common/ProductCard';

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, total, pages, page } = useSelector(s => s.products);
  const { categories } = useSelector(s => s.products);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = { page: currentPage, limit: 12, sort };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    dispatch(fetchProducts(params));
  }, [dispatch, keyword, category, sort, currentPage]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {keyword ? `Results for "${keyword}"` : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} products found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 btn-secondary md:hidden">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`w-60 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="card p-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Sort By</h3>
              </div>
              <select value={sort} onChange={e => updateParam('sort', e.target.value)} className="input text-sm">
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings">Top Rated</option>
                <option value="-totalSold">Best Selling</option>
              </select>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="category" checked={!category} onChange={() => updateParam('category', '')} className="text-blue-600" />
                  All Categories
                </label>
                {categories.map(cat => (
                  <label key={cat._id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="category" checked={category === cat._id} onChange={() => updateParam('category', cat._id)} className="text-blue-600" />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {(keyword || category) && (
              <button onClick={() => setSearchParams({})} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
                <X className="w-4 h-4" /> Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-52 bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => updateParam('page', p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
