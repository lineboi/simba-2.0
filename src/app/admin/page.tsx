'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { ProductsData, Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const { darkMode, user } = useStore();
  const router = useRouter();
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/login');
      return;
    }
    fetch('/simba_products.json')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [user, router]);

  if (!user?.isAdmin || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Simba Admin Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Products', value: data?.products.length || 0, icon: <Package className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Orders', value: 42, icon: <ShoppingCart className="w-5 h-5" />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total Customers', value: '1.2k', icon: <Users className="w-5 h-5" />, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Revenue (MTD)', value: 'RWF 2.4M', icon: <TrendingUp className="w-5 h-5" />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const recentOrders = [
    { id: '#78901', customer: 'Amina Uwase', total: '12,500', status: 'Delivered', date: '2 mins ago' },
    { id: '#78902', customer: 'Eric Nshimiye', total: '4,200', status: 'Processing', date: '15 mins ago' },
    { id: '#78903', customer: 'Marie Claire', total: '45,000', status: 'Pending', date: '1 hour ago' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} flex`}>
      {/* Sidebar */}
      <aside className={`w-64 shrink-0 border-r hidden lg:flex flex-col ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <div className={`font-bold text-base leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simba</div>
              <div className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/20`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <ShoppingCart className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <Users className="w-5 h-5" />
            Customers
          </Link>
        </nav>

        <div className="p-4 border-t dark:border-gray-800">
           <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">Administrator</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className={`sticky top-0 z-30 px-8 py-4 border-b backdrop-blur-md flex items-center justify-between ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <h1 className="text-xl font-bold tracking-tight">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
             <div className="relative group hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                type="text" 
                placeholder="Global search..." 
                className={`pl-10 pr-4 py-2 rounded-xl border text-xs outline-none transition-all w-64 ${darkMode ? 'bg-gray-900 border-gray-800 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
               />
             </div>
             <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl shadow-lg shadow-orange-500/20 transition-all">
                <Plus className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className={`p-6 rounded-2xl border transition-all hover:shadow-md ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className="text-green-500 text-[10px] font-bold">+12.5%</span>
                </div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Products */}
            <div className={`xl:col-span-2 rounded-2xl border flex flex-col ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
                <h2 className="font-bold text-base">Recent Products</h2>
                <Link href="/admin/products" className="text-orange-500 text-xs font-bold hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`text-[10px] uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <th className="px-6 py-4 font-black">Product</th>
                      <th className="px-6 py-4 font-black">Category</th>
                      <th className="px-6 py-4 font-black">Price</th>
                      <th className="px-6 py-4 font-black">Stock</th>
                      <th className="px-6 py-4 font-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-800">
                    {data?.products.slice(0, 5).map((p) => (
                      <tr key={p.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border dark:border-gray-700 bg-white p-1">
                              <Image src={p.image} alt={p.name} fill className="object-contain" unoptimized />
                            </div>
                            <p className="text-sm font-bold truncate max-w-[150px]">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>{p.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold">{p.price.toLocaleString()} RWF</td>
                        <td className="px-6 py-4">
                           {p.inStock ? (
                             <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase"><CheckCircle2 className="w-3 h-3" /> In Stock</span>
                           ) : (
                             <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase"><AlertCircle className="w-3 h-3" /> Out</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center gap-2">
                             <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                             <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className={`rounded-2xl border flex flex-col ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
               <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
                <h2 className="font-bold text-base">Recent Orders</h2>
                <Link href="/admin/orders" className="text-orange-500 text-xs font-bold hover:underline flex items-center gap-1">
                   All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="p-6 space-y-6">
                 {recentOrders.map((order) => (
                   <div key={order.id} className="flex items-center gap-4 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                        order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {order.status === 'Delivered' ? <CheckCircle2 className="w-5 h-5" /> : 
                         order.status === 'Processing' ? <Clock className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-0.5">
                            <p className="text-sm font-bold truncate">{order.customer}</p>
                            <p className="text-xs font-bold">{order.total} RWF</p>
                         </div>
                         <div className="flex justify-between items-center text-[10px]">
                            <p className="text-gray-500 uppercase font-bold tracking-tighter">{order.id} · {order.date}</p>
                            <span className={
                              order.status === 'Delivered' ? 'text-green-500' : 
                              order.status === 'Processing' ? 'text-blue-500' : 'text-orange-500'
                            }>{order.status}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-auto p-6 pt-0">
                 <button className={`w-full py-3 rounded-xl border-2 border-dashed text-xs font-bold uppercase tracking-widest transition-all ${darkMode ? 'border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-400' : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-500'}`}>
                    View Full Reports
                 </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
