import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { fetchCategories } from '../../store/slices/productSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { categories } = useSelector(s => s.products);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categories/${editing}`, form);
        toast.success('Category updated');
        setEditing(null);
      } else {
        await api.post('/categories', form);
        toast.success('Category created');
      }
      setForm({ name: '', description: '' });
      dispatch(fetchCategories());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/categories/${id}`); toast.success('Category deleted'); dispatch(fetchCategories()); }
    catch { toast.error('Failed to delete'); }
  };

  const startEdit = (cat) => { setEditing(cat._id); setForm({ name: cat.name, description: cat.description || '' }); };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4">{editing ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input mt-1 h-20 resize-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex items-center gap-2 flex-1 justify-center">
                <Plus className="w-4 h-4" /> {editing ? 'Update' : 'Create'}
              </button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }} className="btn-secondary">Cancel</button>}
            </div>
          </form>
        </div>
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Slug</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
