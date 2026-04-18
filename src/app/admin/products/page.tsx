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
  LayoutDashboard,
  X,
  Upload,
  Loader2
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
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    inStock: true,
    image: '',
    unit: 'Pcs'
  });

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

  const categories = [...new Set(data?.products.map(p => p.category) || [])].sort();
  
  const filtered = (data?.products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !category || p.category === category;
    return matchesSearch && matchesCat;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const product: Product = {
        id: Math.floor(Math.random() * 10000) + 20000,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category || 'General',
        subcategoryId: 1,
        inStock: newProduct.inStock,
        image: newProduct.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop',
        unit: newProduct.unit
      };

      if (data) {
        setData({
          ...data,
          products: [product, ...data.products]
        });
      }

      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setNewProduct({ name: '', price: '', category: '', inStock: true, image: '', unit: 'Pcs' });
    }, 800);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      if (data) {
        setData({
          ...data,
          products: data.products.filter(p => p.id !== id)
        });
      }
    }
  };

  const handleImageUpload = () => {
    // Simulate a file upload by picking a random high-quality product image
    const demoImages = [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608686209041-723604bc0d44?q=80&w=400&auto=format&fit=crop'
    ];
    const randomImg = demoImages[Math.floor(Math.random() * demoImages.length)];
    setNewProduct({ ...newProduct, image: randomImg });
  };

  if (!user?.isAdmin || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/20`}>
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
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`sticky top-0 z-30 px-8 py-4 border-b backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Manage Products</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{filtered.length} total products listed</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
             >
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
                  <button 
                    onClick={() => {setSearch(''); setCategory('');}}
                    className={`p-2 rounded-xl border transition-all ${darkMode ? 'border-gray-800 hover:bg-gray-800 text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}
                    title="Clear Filters"
                  >
                    <X className="w-4 h-4" />
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
                           <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors" 
                            title="Delete"
                           >
                            <Trash2 className="w-4 h-4" />
                           </button>
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsAddModalOpen(false)} 
          />
          <div className={`relative w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl border animate-slide-up flex flex-col ${
            darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'
          }`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className="text-lg font-bold">Add New Product</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g., Organic Bananas"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Price (RWF)</label>
                  <input 
                    required
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Unit</label>
                  <select 
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <option value="Pcs">Pcs</option>
                    <option value="Kg">Kg</option>
                    <option value="Box">Box</option>
                    <option value="Bottle">Bottle</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                  <select 
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-1.5">
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={newProduct.inStock}
                        onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
                        className="w-4 h-4 accent-orange-500" 
                      />
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-orange-500 transition-colors">In Stock</span>
                   </label>
                </div>
                <div className="col-span-2">
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Product Image</label>
                   <div className="flex flex-col gap-3">
                     {newProduct.image ? (
                       <div className="relative w-full h-32 rounded-xl overflow-hidden border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <Image src={newProduct.image} alt="Preview" fill className="object-contain p-2" unoptimized />
                          <button 
                            type="button"
                            onClick={() => setNewProduct({...newProduct, image: ''})}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                          >
                            <X className="w-3 h-3" />
                          </button>
                       </div>
                     ) : (
                       <button 
                        type="button"
                        onClick={handleImageUpload}
                        className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${darkMode ? 'border-gray-700 hover:border-orange-500/50 hover:bg-gray-800' : 'border-gray-200 hover:border-orange-500/50 hover:bg-orange-50/30'}`}
                       >
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-xs font-bold text-gray-500">Click to upload image</span>
                       </button>
                     )}
                     <div className="relative">
                        <input 
                          type="text" 
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          placeholder="Or paste image URL here..."
                          className={`w-full px-4 py-2 rounded-xl border text-[10px] outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-orange-500' : 'bg-gray-50 border-gray-200 focus:border-orange-500'}`}
                        />
                     </div>
                   </div>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-gray-800 flex gap-3">
                 <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                 >
                   {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Save Product'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
