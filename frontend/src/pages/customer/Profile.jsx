import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Save } from 'lucide-react';
import { updateProfile } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(form));
    if (!result.error) toast.success('Profile updated!');
    else toast.error(result.payload);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <img src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&size=80`}
            alt={user?.name} className="w-20 h-20 rounded-full object-cover" />
          <div>
            <h2 className="font-bold text-lg text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input pl-10" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (read-only)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={user?.email} className="input pl-10 bg-gray-50 cursor-not-allowed" readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input pl-10" placeholder="+1 234 567 8900" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
