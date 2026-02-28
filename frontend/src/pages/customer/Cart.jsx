import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartTotal } from '../../store/slices/cartSlice';

export default function Cart() {
  const { items } = useSelector(s => s.cart);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Start adding products to your cart!</p>
      <Link to="/products" className="btn-primary inline-flex">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-3">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              <img src={item.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className="font-medium text-gray-900 text-sm hover:text-blue-600 line-clamp-2">{item.name}</Link>
                <p className="text-blue-600 font-bold mt-1">${item.price}</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))} className="p-1.5 hover:bg-gray-50"><Minus className="w-3.5 h-3.5" /></button>
                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))} className="p-1.5 hover:bg-gray-50"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <span className="font-bold text-gray-900 w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => dispatch(removeFromCart(item._id))} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <div className="lg:w-72">
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="text-green-600">{total >= 50 ? 'Free' : '$5.99'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax (10%)</span><span>${(total * 0.1).toFixed(2)}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>${(total + (total >= 50 ? 0 : 5.99) + total * 0.1).toFixed(2)}</span></div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary py-3">Proceed to Checkout</button>
            <Link to="/products" className="block text-center text-sm text-blue-600 hover:underline mt-3">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
