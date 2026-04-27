'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  MapPin,
  ClipboardList,
  User,
  CheckCircle,
  Package,
  AlertCircle
} from 'lucide-react';
import { Order, User as UserType, Product } from '@/lib/types';
import Link from 'next/link';

interface BranchStock {
  id: string;
  productId: number;
  quantity: number;
  product: Product & { category: { name: string } };
}

type Tab = 'orders' | 'inventory';

export default function AdminDashboard() {
  const { darkMode, user } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stock, setStock] = useState<BranchStock[]>([]);
  const [staff, setStaff] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === 'CUSTOMER') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (user.role === 'ADMIN') {
          const ordersRes = await fetch('/api/orders/all');
          setOrders(await ordersRes.json());
        } else if (user.branchId) {
          const ordersRes = await fetch(`/api/orders/branch/${user.branchId}`);
          setOrders(await ordersRes.json());
          
          if (user.role === 'BRANCH_MANAGER') {
            const staffRes = await fetch(`/api/branches/${user.branchId}/staff`);
            setStaff(await staffRes.json());
          }

          const stockRes = await fetch(`/api/branches/${user.branchId}/stock`);
          setStock(await stockRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignStaff = async (orderId: string, staffId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedStaffId: staffId, status: 'accepted' }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted', assignedStaffId: staffId } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = async (productId: number, newQuantity: number) => {
    if (!user?.branchId) return;
    try {
      const res = await fetch(`/api/branches/${user.branchId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      if (res.ok) {
        setStock(prev => prev.map(s => s.productId === productId ? { ...s, quantity: newQuantity } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFlagNoShow = async (userId: string, orderId: string) => {
    if (!confirm('Are you sure you want to flag this customer as a No-Show? This will cancel the order and increase their future deposit requirement.')) return;
    try {
      const res = await fetch(`/api/users/${userId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
        alert('Customer flagged and order cancelled.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = user?.role === 'BRANCH_STAFF' 
    ? orders.filter(o => o.assignedStaffId === user.id)
    : orders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'accepted': return 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20';
      case 'preparing': return 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20';
      case 'ready': return 'bg-green-100 text-green-600 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
      case 'completed': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  if (!user || user.role === 'CUSTOMER' || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-black animate-pulse uppercase tracking-[0.2em] text-[10px]">Simba Portal Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex`}>
      {/* Sidebar */}
      <aside className={`w-72 shrink-0 border-r hidden lg:flex flex-col ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <div>
              <div className="font-black text-lg tracking-tighter leading-none">Simba 2.0</div>
              <div className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-1">Management</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</div>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'orders' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Orders Queue
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'inventory' ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Branch Inventory
          </button>
          <div className="pt-8 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Exit</div>
          <Link href="/" className="block">
            <button className={`w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              <ShoppingCart className="w-4 h-4" />
              Back to Shop
            </button>
          </Link>
        </nav>

        <div className="p-6 border-t dark:border-slate-800">
           <div className={`p-4 rounded-3xl ${darkMode ? 'bg-slate-800/50' : 'bg-slate-100'} flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black shadow-lg">
                {user.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black truncate uppercase tracking-tight">{user.name}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className={`sticky top-0 z-30 px-8 py-6 border-b backdrop-blur-md flex items-center justify-between ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              {activeTab === 'orders' ? 'Orders Pipeline' : 'Local Inventory'}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-600" />
              Simba {user.branchId ? 'Supermarket' : 'Global Admin'}
            </p>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'orders' ? (
            <div className="space-y-8">
              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {[
                   { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'text-amber-500' },
                   { label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length, color: 'text-orange-500' },
                   { label: 'Ready', count: orders.filter(o => o.status === 'ready').length, color: 'text-green-500' },
                   { label: 'Completed', count: orders.filter(o => o.status === 'completed').length, color: 'text-blue-500' },
                 ].map(stat => (
                   <div key={stat.label} className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                     <p className={`text-3xl font-black ${stat.color}`}>{stat.count}</p>
                   </div>
                 ))}
              </div>

              {/* Orders Table */}
              <div className={`rounded-[2.5rem] border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="p-8 border-b dark:border-slate-800">
                  <h2 className="text-xl font-black tracking-tighter">Order Processing Queue</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <th className="px-8 py-5">Order ID</th>
                        <th className="px-8 py-5">Customer</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Staff Assignment</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-8 py-6 text-xs font-black uppercase">#{order.id.slice(-6)}</td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-black">{order.user?.name || 'Guest User'}</p>
                            <p className="text-[10px] font-black text-orange-600 uppercase">RWF {order.total.toLocaleString()}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border tracking-widest ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            {user.role === 'BRANCH_MANAGER' ? (
                              <select 
                                value={order.assignedStaffId || ''}
                                onChange={(e) => handleAssignStaff(order.id, e.target.value)}
                                className={`w-full text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl outline-none border transition-all ${
                                  darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <option value="">Assign Staff</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                            ) : (
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                {order.assignedStaffId === user.id ? 'Assigned to Me' : 'N/A'}
                              </p>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {(order.status === 'pending' || order.status === 'ready' || order.status === 'accepted' || order.status === 'preparing') && order.userId && (
                                <button 
                                  onClick={() => handleFlagNoShow(order.userId!, order.id)}
                                  className="px-3 py-2 text-[8px] font-black uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-200 transition-all mr-2"
                                  title="Flag as No-Show"
                                >
                                  No-Show
                                </button>
                              )}
                              {user.role === 'BRANCH_STAFF' && order.status === 'accepted' && (
                                <button onClick={() => handleUpdateStatus(order.id, 'preparing')} className="px-4 py-2 bg-orange-600 text-white text-[9px] font-black uppercase rounded-xl">Start</button>
                              )}
                              {user.role === 'BRANCH_STAFF' && order.status === 'preparing' && (
                                <button onClick={() => handleUpdateStatus(order.id, 'ready')} className="px-4 py-2 bg-green-600 text-white text-[9px] font-black uppercase rounded-xl">Finish</button>
                              )}
                              {order.status === 'ready' && (
                                <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase rounded-xl">Complete</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Inventory Table */}
              <div className={`rounded-[2.5rem] border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="p-8 border-b dark:border-slate-800">
                  <h2 className="text-xl font-black tracking-tighter">Branch Catalog & Stock</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <th className="px-8 py-5">Product Name</th>
                        <th className="px-8 py-5">Category</th>
                        <th className="px-8 py-5">Current Stock</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {stock.map((item) => (
                        <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-8 py-6 text-xs font-black uppercase">{item.product.name}</td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.product.category.name}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <input 
                                 type="number"
                                 value={item.quantity}
                                 onChange={(e) => handleUpdateStock(item.productId, parseInt(e.target.value))}
                                 className={`w-20 px-3 py-2 rounded-xl text-xs font-black border outline-none ${
                                   darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                 }`}
                               />
                               <span className="text-[10px] font-bold text-slate-400 uppercase">{item.product.unit}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {item.quantity <= 0 ? (
                              <span className="flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase">
                                <AlertCircle className="w-3 h-3" /> Out of Stock
                              </span>
                            ) : item.quantity < 15 ? (
                              <span className="flex items-center gap-1.5 text-amber-500 text-[9px] font-black uppercase">
                                <AlertCircle className="w-3 h-3" /> Low Stock
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-green-500 text-[9px] font-black uppercase">
                                <CheckCircle className="w-3 h-3" /> Healthy
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button 
                               onClick={() => handleUpdateStock(item.productId, 0)}
                               className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline"
                             >
                               Mark Sold Out
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
