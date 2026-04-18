'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Search,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LayoutDashboard
} from 'lucide-react';
import { ProductsData, Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProducts() {
  const { darkMode, user } = useStore();
  const router = useRouter();
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

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
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categories = [...new Set(data?.products.map(p => p.category) || [])].sort();
  
  const filtered = (data?.products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !category || p.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} flex`}>
      {/* Sidebar (reused from dashboard) */}
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
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/20`}>
            <Package className="w-5 h-5" />
            Products
          </Link>
          {/* ... other nav links ... */}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`sticky top-0 z-30 px-8 py-4 border-b backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Manage Products</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{filtered.length} total products listed</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
             </button>
          </div>
        </header>

        <div className="p-8">
          <div className={`rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            {/* Filters Bar */}
            <div className="p-4 border-b dark:border-gray-800 flex flex-col md:flex-row items-center gap-4">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-gray-950 border-gray-800 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
                  />
               </div>
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`flex-1 md:w-48 px-4 py-2 rounded-xl border text-sm outline-none ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button className={`p-2 rounded-xl border transition-all ${darkMode ? 'border-gray-800 hover:bg-gray-800 text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[10px] uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <th className="px-6 py-4 font-black">ID</th>
                    <th className="px-6 py-4 font-black">Product</th>
                    <th className="px-6 py-4 font-black">Category</th>
                    <th className="px-6 py-4 font-black text-right">Price</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800">
                  {filtered.slice(0, 20).map((p) => (
                    <tr key={p.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">#{p.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border dark:border-gray-700 bg-white p-1">
                            <Image src={p.image} alt={p.name} fill className="object-contain" unoptimized />
                          </div>
                          <p className="text-sm font-bold truncate max-w-[200px]">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>{p.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">
                        {p.price.toLocaleString()} <span className="text-[9px] text-gray-500">RWF</span>
                      </td>
                      <td className="px-6 py-4">
                         {p.inStock ? (
                           <span className="inline-flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase bg-green-500/10 px-2 py-1 rounded-lg">
                             <CheckCircle2 className="w-3 h-3" /> In Stock
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase bg-red-500/10 px-2 py-1 rounded-lg">
                             <AlertCircle className="w-3 h-3" /> Out
                           </span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                           <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                           <Link href={`/product/${p.id}`} target="_blank" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-400 hover:text-blue-500 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                           </Link>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t dark:border-gray-800 flex items-center justify-between">
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Page 1 of 12</p>
               <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg border dark:border-gray-800 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg border dark:border-gray-800"><ChevronRight className="w-4 h-4" /></button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
