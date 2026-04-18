'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search,
  Mail,
  MapPin,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

const CUSTOMERS = [
  { id: 1, name: 'Amina Uwase', email: 'amina@example.rw', location: 'Kigali, Kicukiro', joined: 'Jan 12, 2026', orders: 12, totalSpent: '145,000', status: 'Active' },
  { id: 2, name: 'Eric Nshimiye', email: 'eric@example.rw', location: 'Kigali, Nyarugenge', joined: 'Feb 05, 2026', orders: 4, totalSpent: '42,000', status: 'Active' },
  { id: 3, name: 'Marie Claire', email: 'marie@example.rw', location: 'Musanze, Northern', joined: 'Mar 20, 2026', orders: 28, totalSpent: '890,500', status: 'VIP' },
  { id: 4, name: 'Jean Pierre', email: 'jp@example.rw', location: 'Huye, Southern', joined: 'Apr 02, 2026', orders: 1, totalSpent: '8,900', status: 'New' },
  { id: 5, name: 'Claudine Mukamana', email: 'claudine@example.rw', location: 'Kigali, Gasabo', joined: 'Apr 10, 2026', orders: 9, totalSpent: '122,100', status: 'Active' },
];

export default function AdminUsers() {
  const { darkMode, user } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filtered = CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

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
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
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
          <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/20`}>
            <Users className="w-5 h-5" />
            Customers
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`sticky top-0 z-30 px-8 py-4 border-b backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Customer Directory</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manage your user base and loyalty</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Customer
          </button>
        </header>

        <div className="p-8">
          <div className={`rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="p-4 border-b dark:border-gray-800">
               <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-gray-950 border-gray-800 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
                  />
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[10px] uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <th className="px-6 py-4 font-black">Customer</th>
                    <th className="px-6 py-4 font-black">Location</th>
                    <th className="px-6 py-4 font-black">Joined</th>
                    <th className="px-6 py-4 font-black text-center">Orders</th>
                    <th className="px-6 py-4 font-black text-right">Total Spent</th>
                    <th className="px-6 py-4 font-black text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800">
                  {filtered.map((c) => (
                    <tr key={c.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-black">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{c.name}</p>
                            <p className="text-[10px] text-gray-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <MapPin className="w-3 h-3 text-orange-500" />
                          {c.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">{c.joined}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-black ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{c.orders}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">
                        {c.totalSpent} <span className="text-[9px] text-gray-500 uppercase">RWF</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                           c.status === 'VIP' ? 'bg-purple-500/10 text-purple-500' :
                           c.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                           'bg-green-500/10 text-green-500'
                         }`}>
                           {c.status}
                         </span>
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
