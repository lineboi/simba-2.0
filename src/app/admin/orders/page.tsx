'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  LayoutDashboard,
  Package,
  Users,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const ORDERS = [
  { id: 'ORD-78901', customer: 'Amina Uwase', email: 'amina@example.rw', total: '12,500', status: 'Delivered', date: 'April 18, 2026', items: 3 },
  { id: 'ORD-78902', customer: 'Eric Nshimiye', email: 'eric@example.rw', total: '4,200', status: 'Processing', date: 'April 18, 2026', items: 1 },
  { id: 'ORD-78903', customer: 'Marie Claire', email: 'marie@example.rw', total: '45,000', status: 'Pending', date: 'April 17, 2026', items: 8 },
  { id: 'ORD-78904', customer: 'Jean Pierre', email: 'jp@example.rw', total: '8,900', status: 'Cancelled', date: 'April 17, 2026', items: 2 },
  { id: 'ORD-78905', customer: 'Claudine Mukamana', email: 'claudine@example.rw', total: '22,100', status: 'Delivered', date: 'April 16, 2026', items: 5 },
];

export default function AdminOrders() {
  const { darkMode, user } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  if (!user?.isAdmin || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = statusFilter === 'All' ? ORDERS : ORDERS.filter(o => o.status === statusFilter);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} flex`}>
      {/* Sidebar (reused) */}
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
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/20`}>
            <ShoppingCart className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <Users className="w-5 h-5" />
            Customers
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`sticky top-0 z-30 px-8 py-4 border-b backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Orders Management</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Process and track customer orders</p>
          </div>
        </header>

        <div className="p-8">
          <div className={`rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            {/* Filters */}
            <div className="p-4 border-b dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                  {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        statusFilter === s
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-50 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
               </div>
               <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by ID or Name..." 
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-gray-950 border-gray-800 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
                  />
               </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[10px] uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <th className="px-6 py-4 font-black">Order ID</th>
                    <th className="px-6 py-4 font-black">Customer</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 font-black">Total</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800">
                  {filtered.map((o) => (
                    <tr key={o.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold">{o.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold truncate">{o.customer}</p>
                        <p className="text-[10px] text-gray-500 truncate">{o.email}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">{o.date}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{o.total} RWF</p>
                        <p className="text-[10px] text-gray-500">{o.items} items</p>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                           o.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                           o.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                           o.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                         }`}>
                           {o.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> :
                            o.status === 'Processing' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                           {o.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-orange-500 transition-all flex items-center justify-end gap-2 ml-auto">
                            <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                            <ArrowRight className="w-3 h-3" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
