'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const { darkMode, user } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users/all');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, router]);

  if (!user || user.role !== 'ADMIN' || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex`}>
      <aside className={`w-64 shrink-0 border-r hidden lg:flex flex-col ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <div className={`font-bold text-base leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Simba</div>
              <div className="text-[10px] text-orange-600 font-bold uppercase tracking-tighter">Admin</div>
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
          <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-orange-600 text-white shadow-lg shadow-orange-600/20`}>
            <Users className="w-5 h-5" />
            Customers
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`sticky top-0 z-30 px-8 py-4 border-b backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <h1 className="text-xl font-bold tracking-tight">Customer Management</h1>
        </header>

        <div className="p-8">
          <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="p-4 border-b dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search customers..." 
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-slate-950 border-slate-800 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
                  />
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[10px] uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <th className="px-6 py-4 font-black">Customer</th>
                    <th className="px-6 py-4 font-black">Role</th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-orange-500 transition-all flex items-center justify-end gap-2 ml-auto">
                            <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
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
