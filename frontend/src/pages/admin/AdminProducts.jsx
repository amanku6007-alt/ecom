import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { fetchProducts } from '../../store/slices/productSlice';
import { deleteProduct } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading, total, pages } = useSelector(s => s.products);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 15, sort: '-createdAt' };
    if (search) params.keyword = search;
    dispatch(fetchProducts(params));
  }, [dispatch, page, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const result = await dispatch(deleteProduct(id));
    if (!result.error) { toast.success('Product deleted'); dispatch(fetchProducts({ page, limit: 15 })); }
    else toast.error(result.payload);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{total} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="card p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)} className="input pl-10 max-w-xs" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-600">Product</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-600">Category</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-600">Price</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-600">Stock</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-600">Rating</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-3 px-2"><div className="h-10 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : products.map(product => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0]?.url} alt={product.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{product.category?.name}</td>
                  <td className="py-3 px-2 font-medium">${product.price}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">⭐ {Number(product.ratings).toFixed(1)}</td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/${product._id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(product._id, product.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-sm ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
