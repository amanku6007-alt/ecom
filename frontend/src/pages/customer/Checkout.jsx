import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../store/slices/orderSlice';
import { clearCart, selectCartTotal } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(s => s.cart);
  const { loading } = useSelector(s => s.orders);
  const subtotal = useSelector(selectCartTotal);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const [form, setForm] = useState({
    name: '', street: '', city: '', state: '', zip: '', country: 'US', phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      orderItems: items.map(i => ({ product: i._id, name: i.name, image: i.images?.[0]?.url || '', price: i.price, quantity: i.quantity })),
      shippingAddress: form,
      paymentInfo: { id: 'demo_' + Date.now(), status: 'paid', method: 'card' },
      itemsPrice: subtotal, taxPrice: tax, shippingPrice: shipping, totalPrice: total,
    };
    const result = await dispatch(createOrder(orderData));
    if (!result.error) {
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/order/success');
    } else {
      toast.error(result.payload);
    }
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm({...form, [k]: e.target.value}) });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="text-sm font-medium text-gray-700">Full Name</label><input {...f('name')} className="input mt-1" required /></div>
              <div className="sm:col-span-2"><label className="text-sm font-medium text-gray-700">Street Address</label><input {...f('street')} className="input mt-1" required /></div>
              <div><label className="text-sm font-medium text-gray-700">City</label><input {...f('city')} className="input mt-1" required /></div>
              <div><label className="text-sm font-medium text-gray-700">State</label><input {...f('state')} className="input mt-1" required /></div>
              <div><label className="text-sm font-medium text-gray-700">ZIP Code</label><input {...f('zip')} className="input mt-1" required /></div>
              <div><label className="text-sm font-medium text-gray-700">Country</label><input {...f('country')} className="input mt-1" required /></div>
              <div className="sm:col-span-2"><label className="text-sm font-medium text-gray-700">Phone</label><input {...f('phone')} className="input mt-1" type="tel" /></div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Payment</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              🎯 <strong>Demo Mode:</strong> Payment is simulated. No real card data needed. Connect Stripe for live payments.
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base font-semibold">
            {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="lg:w-72">
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Order ({items.length} items)</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item._id} className="flex gap-2 text-sm">
                  <img src={item.images?.[0]?.url} alt={item.name} className="w-10 h-10 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-gray-500">×{item.quantity} — ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="mb-3" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${tax.toFixed(2)}</span></div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
