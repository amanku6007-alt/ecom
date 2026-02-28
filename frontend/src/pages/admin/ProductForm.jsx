import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save, Image } from 'lucide-react';
import { fetchCategories } from '../../store/slices/productSlice';
import { createProduct, updateProduct } from '../../store/slices/adminSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector(s => s.products);
  const { loading } = useSelector(s => s.admin);

  const [form, setForm] = useState({
    name: '', description: '', price: '', comparePrice: '',
    category: '', brand: '', stock: '', sku: '',
    isFeatured: false, isActive: true,
    images: [{ public_id: 'default', url: '' }],
  });

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => {
        const p = data.product;
        setForm({
          name: p.name, description: p.description, price: p.price,
          comparePrice: p.comparePrice || '', category: p.category?._id || '',
          brand: p.brand || '', stock: p.stock, sku: p.sku || '',
          isFeatured: p.isFeatured, isActive: p.isActive,
          images: p.images?.length ? p.images : [{ public_id: 'default', url: '' }],
        });
      }).catch(() => toast.error('Failed to load product'));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...form, price: Number(form.price), stock: Number(form.stock),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      images: form.images.filter(img => img.url),
    };
    if (!productData.images.length) productData.images = [{ public_id: 'default', url: 'https://via.placeholder.com/400' }];

    const result = isEdit
      ? await dispatch(updateProduct({ id, ...productData }))
      : await dispatch(createProduct(productData));

    if (!result.error) {
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm({...form, [k]: e.target.value}) });

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-gray-900">Basic Info</h2>
          <div>
            <label className="text-sm font-medium text-gray-700">Product Name *</label>
            <input {...f('name')} className="input mt-1" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description *</label>
            <textarea {...f('description')} className="input mt-1 h-28 resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <input {...f('brand')} className="input mt-1" placeholder="Apple, Nike..." />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">SKU</label>
              <input {...f('sku')} className="input mt-1" placeholder="Auto-generated if empty" />
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-gray-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price ($) *</label>
              <input {...f('price')} type="number" min="0" step="0.01" className="input mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Compare Price ($)</label>
              <input {...f('comparePrice')} type="number" min="0" step="0.01" className="input mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stock *</label>
              <input {...f('stock')} type="number" min="0" className="input mt-1" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Category *</label>
            <select {...f('category')} className="input mt-1" required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Image className="w-5 h-5" /> Product Image URL</h2>
          <div>
            <label className="text-sm font-medium text-gray-700">Image URL</label>
            <input
              value={form.images[0]?.url || ''}
              onChange={e => setForm({...form, images: [{ public_id: 'img_' + Date.now(), url: e.target.value }]})}
              className="input mt-1" placeholder="https://example.com/image.jpg"
            />
            {form.images[0]?.url && (
              <img src={form.images[0].url} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" onError={e => e.target.style.display='none'} />
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4">Settings</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6">
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link to="/admin/products" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
