import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const statusColors = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };
const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders, loading, total, pages } = useSelector(s => s.admin);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 20, ...(filter && { status: filter }) }));
  }, [dispatch, page, filter]);

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateOrderStatus({ id, orderStatus: status }));
    if (!result.error) toast.success('Order status updated');
    else toast.error(result.payload);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{total} total orders</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input w-auto text-sm">
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Items</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Total</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            </tr></thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6} className="py-3 px-4"><div className="h-10 bg-gray-100 rounded animate-pulse" /></td></tr>)
              ) : orders.map(order => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-gray-700">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.orderItems?.length} items</td>
                  <td className="py-3 px-4 font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <select value={order.orderStatus} onChange={e => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${statusColors[order.orderStatus]}`}>
                      {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-sm ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
