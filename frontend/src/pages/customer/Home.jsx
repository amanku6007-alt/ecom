import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';
import { fetchFeatured, fetchCategories } from '../../store/slices/productSlice';
import ProductCard from '../../components/common/ProductCard';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { featured, categories } = useSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="bg-blue-500/30 text-blue-100 text-sm px-3 py-1 rounded-full font-medium">🎉 Free shipping on orders over $50</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6 leading-tight">
              Shop Everything<br /><span className="text-yellow-300">You Need</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-md">Discover thousands of products from top brands at unbeatable prices.</p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/products?sort=-ratings" className="border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                Best Sellers
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-80 h-80 bg-white/10 rounded-3xl flex items-center justify-center text-8xl backdrop-blur-sm border border-white/20">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {categories.slice(0, 5).map(cat => (
              <Link key={cat._id} to={`/products?category=${cat._id}`}
                className="card p-4 text-center hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="text-3xl mb-2">
                  {cat.name === 'Electronics' ? '💻' : cat.name === 'Clothing' ? '👔' : cat.name === 'Books' ? '📚' : cat.name === 'Sports' ? '⚽' : '🏠'}
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>
      )}
    </div>
  );
}
