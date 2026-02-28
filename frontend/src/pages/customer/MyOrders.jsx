import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { fetchMyOrders } from '../../store/slices/orderSlice';

const statusColors = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function MyOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="animate-pulse space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}</div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
          <Link to="/products" className="btn-primary inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={statusColors[order.orderStatus] || 'badge-info'}>{order.orderStatus}</span>
              </div>
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {order.orderItems.slice(0, 4).map((item, i) => (
                  <img key={i} src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                ))}
                {order.orderItems.length > 4 && <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">+{order.orderItems.length - 4}</div>}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
                <Link to={`/orders/${order._id}`} className="text-sm text-blue-600 hover:underline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
