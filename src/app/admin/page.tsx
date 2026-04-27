'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  MapPin,
  ClipboardList
} from 'lucide-react';
import { Order, User } from '@/lib/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const { darkMode, user } = useStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === 'CUSTOMER') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        let ordersRes;
        if (user.role === 'ADMIN') {
          ordersRes = await fetch('/api/orders/all');
        } else if (user.branchId) {
          ordersRes = await fetch(`/api/orders/branch/${user.branchId}`);
          
          if (user.role === 'BRANCH_MANAGER') {
            const staffRes = await fetch(`/api/branches/${user.branchId}/staff`);
            const staffData = await staffRes.json();
            setStaff(staffData);
          }
        }
        
        if (ordersRes) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

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

  const filteredOrders = user.role === 'BRANCH_STAFF' 
    ? orders.filter(o => o.assignedStaffId === user.id)
    : orders;

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
          <button className={`w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all bg-orange-600 text-white shadow-xl shadow-orange-600/20`}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
            <ClipboardList className="w-4 h-4" />
            Orders List
          </button>
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
            <h1 className="text-2xl font-black tracking-tighter">
              {user.role === 'BRANCH_MANAGER' ? 'Branch Overview' : user.role === 'BRANCH_STAFF' ? 'My Assignments' : 'System Overview'}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-600" />
              {user.branchId ? 'Simba Supermarket Branch' : 'HQ Portal'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Time</p>
                <p className="text-sm font-black">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Orders Section */}
          <div className={`rounded-[2.5rem] border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tighter">Active Orders</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Management & Fulfillment</p>
              </div>
              <div className="flex gap-2">
                 {['pending', 'accepted', 'ready', 'completed'].map(s => (
                   <span key={s} className="text-[8px] font-black uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 tracking-widest">{s}</span>
                 ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Assigned To</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="space-y-3">
                          <ShoppingCart className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto" />
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">No orders found at this time</p>
                        </div>
                      </td>
                    </tr>
                  ) : orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-xs font-black tracking-tight uppercase">#{order.id.slice(-6)}</p>
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">
                          {order.depositPaid ? 'Deposit Paid' : 'Unpaid'}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-black tracking-tight">{order.userId ? 'Registered User' : 'Guest'}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">RWF {order.total.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl tracking-widest ${
                           order.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/10' :
                           order.status === 'ready' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' :
                           order.status === 'completed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10' :
                           'bg-slate-100 text-slate-600 dark:bg-slate-800'
                         }`}>
                           {order.status}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                        {user.role === 'BRANCH_MANAGER' ? (
                          <select 
                            value={order.assignedStaffId || ''}
                            onChange={(e) => handleAssignStaff(order.id, e.target.value)}
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl outline-none border transition-all ${
                              darkMode ? 'bg-slate-800 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-200 focus:border-orange-500'
                            }`}
                          >
                            <option value="">Unassigned</option>
                            {staff.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                             {order.assignedStaffId === user.id ? 'Me' : 'N/A'}
                          </p>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                           {user.role === 'BRANCH_STAFF' && order.status === 'accepted' && (
                             <button 
                               onClick={() => handleUpdateStatus(order.id, 'preparing')}
                               className="px-4 py-2 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-600/20"
                             >
                               Start Prep
                             </button>
                           )}
                           {user.role === 'BRANCH_STAFF' && order.status === 'preparing' && (
                             <button 
                               onClick={() => handleUpdateStatus(order.id, 'ready')}
                               className="px-4 py-2 bg-green-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-green-600/20"
                             >
                               Mark Ready
                             </button>
                           )}
                           {order.status === 'ready' && (
                             <button 
                               onClick={() => handleUpdateStatus(order.id, 'completed')}
                               className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20"
                             >
                               Complete
                             </button>
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
      </main>
    </div>
  );
}
