// OrderSuccess.jsx
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
export default function OrderSuccess() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-8">Thank you for your purchase. You'll receive a confirmation shortly.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/orders" className="btn-primary flex items-center gap-2"><Package className="w-4 h-4" /> My Orders</Link>
        <Link to="/products" className="btn-secondary flex items-center gap-2">Continue Shopping <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}
