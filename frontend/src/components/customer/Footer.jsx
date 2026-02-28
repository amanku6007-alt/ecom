import { Link } from 'react-router-dom';
import { Package, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
            <Package className="w-6 h-6 text-blue-400" />
            <span>ShopNow</span>
          </div>
          <p className="text-sm leading-relaxed">Your trusted destination for quality products at competitive prices.</p>
          <div className="flex gap-4 mt-4">
            <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer" />
            <Mail className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
          </div>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?sort=-ratings" className="hover:text-white">Best Sellers</Link></li>
            <li><Link to="/products?sort=-createdAt" className="hover:text-white">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:text-white">My Profile</Link></li>
            <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-white">Shopping Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white cursor-pointer">Contact Us</span></li>
            <li><span className="hover:text-white cursor-pointer">FAQ</span></li>
            <li><span className="hover:text-white cursor-pointer">Returns Policy</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ShopNow. All rights reserved.
      </div>
    </footer>
  );
}
