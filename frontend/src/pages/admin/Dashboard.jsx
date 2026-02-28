import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Package, TrendingUp, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { fetchDashboard } from '../../store/slices/adminSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const statusColors = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector(s => s.admin);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (loading || !dashboard) return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{Array(2).fill(0).map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-xl" />)}</div>
    </div>
  );

  const { stats, recentOrders, topProducts, monthlyRevenue } = dashboard;

  const chartData = monthlyRevenue?.map(d => ({
    month: months[d._id.month - 1], revenue: Math.round(d.revenue), orders: d.orders
  })) || [];

  const orderChange = stats.lastMonthOrders > 0
    ? Math.round(((stats.monthOrders - stats.lastMonthOrders) / stats.lastMonthOrders) * 100)
    : 0;

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue?.toFixed(0)}`, sub: `$${stats.monthRevenue?.toFixed(0)} this month`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Orders', value: stats.totalOrders, sub: `${stats.monthOrders} this month`, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Users', value: stats.totalUsers, sub: `+${stats.monthUsers} this month`, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Products', value: stats.totalProducts, sub: stats.lowStockProducts > 0 ? `⚠️ ${stats.lowStockProducts} low stock` : 'All stocked', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-4">Revenue (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val) => [`$${val}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-4">Orders (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders?.slice(0, 5).map(order => (
              <div key={order._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-gray-500 text-xs">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.totalPrice?.toFixed(2)}</p>
                  <span className={`${statusColors[order.orderStatus]} text-xs`}>{order.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Top Products</h3>
            <Link to="/admin/products" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {topProducts?.slice(0, 5).map((product, i) => (
              <div key={product._id} className="flex items-center gap-3 text-sm">
                <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                <img src={product.images?.[0]?.url} alt={product.name} className="w-8 h-8 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-gray-500 text-xs">{product.totalSold} sold</p>
                </div>
                <span className="font-medium text-gray-900">${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
