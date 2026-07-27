import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import {
  X,
  LayoutDashboard,
  Package,
  Boxes,
  Calendar,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export default function AdminPortalModal() {
  const { isAdminOpen, setIsAdminOpen, formatPrice, products, addProduct, orders, setOrders, appointments } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'inventory' | 'appointments' | 'new-product'
  const [trafficPeriod, setTrafficPeriod] = useState('today');

  const trafficData = {
    today: { visitors: '1,280', change: '+12.4%' },
    week: { visitors: '8,420', change: '+18.1%' },
    month: { visitors: '34,190', change: '+22.5%' },
    allTime: { visitors: '148,200', change: '+45.8%' },
  };

  // Live Inventory State (starts empty as requested)
  const [inventory, setInventory] = useState([]);
  
  // Inventory Form State
  const [invName, setInvName] = useState('');
  const [invCat, setInvCat] = useState('');
  const [invStock, setInvStock] = useState('');
  const [invCost, setInvCost] = useState('');

  const handleAddInventory = (e) => {
    e.preventDefault();
    const count = parseInt(invStock) || 0;
    const newItem = {
      id: `st-${Date.now()}`,
      name: invName,
      category: invCat,
      stock: count,
      unitCostUSD: parseFloat(invCost) || 0.00,
      status: count < 100 ? 'Low Stock' : 'In Stock'
    };
    setInventory((prev) => [...prev, newItem]);
    setInvName('');
    setInvCat('');
    setInvStock('');
    setInvCost('');
  };



  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Featured');
  const [newPrice, setNewPrice] = useState('550');
  const [newTagline, setNewTagline] = useState('');
  const [newImage, setNewImage] = useState('');
  const [isProductAdded, setIsProductAdded] = useState(false);

  if (!isAdminOpen) return null;

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    setIsProductAdded(true);

    const newBouquet = {
      id: `bouq-${Date.now()}`,
      name: newTitle,
      tagline: newTagline,
      priceUSD: parseFloat(newPrice) || 390,
      rating: 5.0,
      reviewsCount: 1,
      category: newCategory,
      occasion: newCategory === 'Wedding' ? 'Wedding' : 'Anniversary',
      image: newImage || '/assets/images/sovereign_red_roses_1785005575575.png',
      badge: 'New Arrival',
      isNew: true,
      is3D: false,
      flowerTypes: ['Rare Custom Import'],
      description: newTagline
    };

    addProduct(newBouquet);

    setTimeout(() => {
      setIsProductAdded(false);
      setNewTitle('');
      setNewTagline('');
      setNewPrice('550');
      setNewImage('');
      setActiveTab('inventory'); // Go back to inventory tab to see the new product at the very top!
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/95 backdrop-blur-2xl p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="w-full max-w-7xl h-[92vh] glass-panel border border-gold-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-gold-lg relative overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gold-500/20 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-emerald-900 border border-gold-400/50 flex items-center justify-center font-serif font-bold text-obsidian-950 text-sm shadow-gold-sm">
              BH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-gold-gradient">Bloom Hand Made Gift</span>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 text-[10px] uppercase font-serif font-bold tracking-widest">
                  Sovereign VIP Admin Atelier
                </span>
              </div>
              <p className="text-[11px] text-pearl-300/70 font-light">
                Logged in as: <strong>Master Floral Architect & Director</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 rounded-full border border-gold-500/40 text-gold-300 hover:bg-gold-500/20 text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Exit Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-gold-500/15 text-xs">
          {[
            { id: 'dashboard', label: '📊 Dashboard & Analytics', icon: LayoutDashboard },
            { id: 'orders', label: '📦 Live Orders Manager', icon: Package },
            { id: 'inventory', label: '💐 Stem Inventory', icon: Boxes },
            { id: 'appointments', label: '📅 VIP Consultations', icon: Calendar },
            { id: 'new-product', label: '➕ Add New Bouquet', icon: PlusCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-serif font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm'
                    : 'bg-obsidian-900 border border-gold-500/20 text-pearl-300 hover:border-gold-500/40 hover:text-gold-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Portal View Area */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
          
          {/* TAB 1: DASHBOARD ANALYTICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                
                <div className="glass-panel p-5 rounded-2xl border border-gold-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-pearl-300">
                    <span>Monthly Revenue</span>
                    <DollarSign className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-gold-gradient block">
                    {formatPrice(184500)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">↑ +24.8% vs last month</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-gold-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-pearl-300">
                    <span>Active VIP Orders</span>
                    <Package className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-pearl-50 block">{orders.length} Orders</span>
                  <span className="text-[10px] text-gold-300 font-medium">
                    {orders.filter(o => o.status === 'In Preparation').length} preparing • {orders.filter(o => o.status === 'Out for Delivery').length} out
                  </span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-gold-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-pearl-300">
                    <span>Website Visitors</span>
                    <select
                      value={trafficPeriod}
                      onChange={(e) => setTrafficPeriod(e.target.value)}
                      className="bg-obsidian-900 border border-gold-500/20 text-gold-300 text-[10px] rounded px-1.5 py-0.5 outline-none cursor-pointer font-serif font-bold"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="allTime">All Time</option>
                    </select>
                  </div>
                  <span className="text-2xl font-serif font-bold text-pearl-50 block">
                    {trafficData[trafficPeriod].visitors}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">↑ {trafficData[trafficPeriod].change} vs prev</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-gold-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-pearl-300">
                    <span>Stem Inventory Integrity</span>
                    <Boxes className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-pearl-50 block">4,245 Stems</span>
                  <span className="text-[10px] text-emerald-400 font-medium">98.5% Prime Condition</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-gold-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-pearl-300">
                    <span>VIP Consultations</span>
                    <Calendar className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-pearl-50 block">{appointments.length} Booked</span>
                  <span className="text-[10px] text-gold-300 font-medium">Live bookings from consultations desk</span>
                </div>

              </div>

              {/* Regional Sales Breakdown & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-4">
                  <h4 className="font-serif font-bold text-base text-pearl-50">Global Boutique Revenue Share</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-pearl-200 mb-1">
                        <span>Paris Flagship (Place Vendôme)</span>
                        <span className="font-bold text-gold-400">38% ({formatPrice(70110)})</span>
                      </div>
                      <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-gold-gradient h-full w-[38%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-pearl-200 mb-1">
                        <span>Dubai Flagship (Downtown Palace)</span>
                        <span className="font-bold text-gold-400">28% ({formatPrice(51660)})</span>
                      </div>
                      <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full w-[28%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-pearl-200 mb-1">
                        <span>London Flagship (Mayfair)</span>
                        <span className="font-bold text-gold-400">20% ({formatPrice(36900)})</span>
                      </div>
                      <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-gold-500 h-full w-[20%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-pearl-200 mb-1">
                        <span>Mumbai Luxury Quarter (Bandra)</span>
                        <span className="font-bold text-gold-400">14% ({formatPrice(25830)})</span>
                      </div>
                      <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-pearl-300 h-full w-[14%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-4">
                  <h4 className="font-serif font-bold text-base text-pearl-50">Recent VIP Activity</h4>
                  <div className="space-y-3 text-xs text-pearl-300">
                    <div className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/15 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-pearl-50 block">New Order #BLM-889421</span>
                        <span className="text-[10px] text-pearl-400">100 Red Roses Box • New York</span>
                      </div>
                      <span className="text-gold-gradient font-bold">{formatPrice(450)}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-obsidian-900 border border-gold-500/15 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-pearl-50 block">Consultation Scheduled</span>
                        <span className="text-[10px] text-pearl-400">Royal Wedding Gala • Dubai</span>
                      </div>
                      <span className="text-emerald-400 font-bold">Confirmed</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: LIVE ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-lg text-pearl-50">Active Orders Management</h4>
                <span className="text-xs text-pearl-400">Total: {orders.length} Active Orders</span>
              </div>

              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="text-center py-16 space-y-3 border border-gold-500/10 rounded-2xl bg-obsidian-900/40">
                    <Package className="w-12 h-12 text-gold-500/30 mx-auto" />
                    <p className="font-serif text-pearl-200 text-base">No live orders received yet.</p>
                    <p className="text-xs text-pearl-400 font-light">Acquire items from the boutique shop page to see orders populate here.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-500/15 pb-3">
                        <div>
                          <span className="font-serif font-bold text-base text-gold-gradient">{order.id}</span>
                          <span className="text-xs text-pearl-200 ml-3">Client: <strong>{order.client}</strong></span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase font-serif ${
                          order.status === 'Out for Delivery' ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-300' : 'bg-gold-500/20 border border-gold-400 text-gold-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-pearl-300 font-light">
                        <div><strong>Arrangement:</strong> {order.product}</div>
                        <div><strong>Delivery Slot:</strong> {order.timeSlot}</div>
                        <div><strong>Investment:</strong> <span className="font-serif font-bold text-gold-400">{formatPrice(order.amountUSD)}</span></div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-gold-500/10">
                        <span className="text-[11px] text-pearl-400 font-medium">Update VIP Status:</span>
                        {['In Preparation', 'Quality Checked', 'Out for Delivery', 'Delivered'].map((st) => (
                          <button
                            key={st}
                            onClick={() => updateOrderStatus(order.id, st)}
                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold transition-all ${
                              order.status === st
                                ? 'bg-gold-500 text-obsidian-950'
                                : 'bg-obsidian-900 border border-gold-500/20 text-pearl-300 hover:border-gold-500/40'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STEM INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-lg text-pearl-50">Rare Stem & Flower Inventory</h4>
                <span className="text-xs text-emerald-400 font-medium">All stems climate-controlled at 4°C</span>
              </div>

              {/* Add Inventory Item Inline Form */}
              <form onSubmit={handleAddInventory} className="glass-panel p-4 rounded-2xl border border-gold-500/20 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-gold-400 block mb-1">Stem Variety Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ecuadorian Grand Prix Red Roses"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs outline-none text-pearl-100 placeholder-pearl-400/50"
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold-400 block mb-1">Category:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roses"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs outline-none text-pearl-100 placeholder-pearl-400/50"
                    value={invCat}
                    onChange={(e) => setInvCat(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold-400 block mb-1">Initial Stock:</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500"
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs outline-none text-pearl-100 placeholder-pearl-400/50"
                    value={invStock}
                    onChange={(e) => setInvStock(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gold-400 block mb-1">Unit Cost ($):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 2.50"
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-2.5 text-xs outline-none text-pearl-100 placeholder-pearl-400/50"
                      value={invCost}
                      onChange={(e) => setInvCost(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>

              <div className="glass-panel rounded-2xl overflow-hidden border border-gold-500/20">
                {inventory.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Boxes className="w-12 h-12 text-gold-500/30 mx-auto" />
                    <p className="font-serif text-pearl-200 text-base">Your climate-controlled inventory is empty.</p>
                    <p className="text-xs text-pearl-400 font-light">Add new stem varieties using the form above to populate the ledger.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs text-pearl-200">
                    <thead className="bg-obsidian-900 border-b border-gold-500/20 text-gold-400 uppercase font-serif">
                      <tr>
                        <th className="p-3.5">Stem Variety</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Current Stock</th>
                        <th className="p-3.5">Unit Cost</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gold-500/5 transition-colors">
                          <td className="p-3.5 font-semibold text-pearl-50">{item.name}</td>
                          <td className="p-3.5 text-pearl-300">{item.category}</td>
                          <td className="p-3.5 font-bold text-gold-gradient">{item.stock} Stems</td>
                          <td className="p-3.5">{formatPrice(item.unitCostUSD)}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'Low Stock' ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Published Bouquets Catalog */}
              <div className="pt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-lg text-pearl-50">Published Haute Couture Bouquets</h4>
                  <span className="text-xs text-gold-400 font-medium">Total: {products.length} Designs (Newest First)</span>
                </div>
                
                <div className="glass-panel rounded-2xl overflow-hidden border border-gold-500/20">
                  <table className="w-full text-left text-xs text-pearl-200">
                    <thead className="bg-obsidian-900 border-b border-gold-500/20 text-gold-400 uppercase font-serif">
                      <tr>
                        <th className="p-3.5">Image</th>
                        <th className="p-3.5">Bouquet Name</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Occasion</th>
                        <th className="p-3.5">VIP Price</th>
                        <th className="p-3.5">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gold-500/5 transition-colors">
                          <td className="p-3.5">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gold-500/20" />
                          </td>
                          <td className="p-3.5 font-semibold text-pearl-50">{p.name}</td>
                          <td className="p-3.5 text-pearl-300">{p.category}</td>
                          <td className="p-3.5 text-pearl-300">{p.occasion}</td>
                          <td className="p-3.5 font-bold text-gold-gradient">{formatPrice(p.priceUSD)}</td>
                          <td className="p-3.5 text-gold-400">★ {p.rating} ({p.reviewsCount})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: VIP APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="font-serif font-bold text-lg text-pearl-50">Scheduled VIP Consultations</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-16 space-y-3 border border-gold-500/10 rounded-2xl bg-obsidian-900/40 w-full col-span-2">
                    <Calendar className="w-12 h-12 text-gold-500/30 mx-auto" />
                    <p className="font-serif text-pearl-200 text-base">No VIP consultations scheduled yet.</p>
                    <p className="text-xs text-pearl-400 font-light">Book appointments using the consultation calendar on the shop page.</p>
                  </div>
                ) : (
                  appointments.map((appt) => (
                    <div key={appt.id} className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-gold-400">{appt.occasion}</span>
                      <h5 className="font-serif font-bold text-base text-pearl-50">{appt.client}</h5>
                      <p className="text-xs text-pearl-300 font-light">Date: {appt.date} • {appt.time} ({appt.format})</p>
                      <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-[10px] inline-block font-bold">
                        Master Architect Assigned
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ADD NEW BOUQUET */}
          {activeTab === 'new-product' && (
            <div className="max-w-2xl mx-auto glass-panel p-6 rounded-2xl border border-gold-500/30 space-y-5 animate-fadeIn">
              <h4 className="font-serif font-bold text-xl text-pearl-50 text-center">Add New Haute Couture Arrangement</h4>
              
              {isProductAdded ? (
                <div className="p-4 rounded-2xl bg-gold-500/20 border border-gold-400 text-gold-300 text-center font-serif font-bold text-xs uppercase tracking-widest animate-fadeIn">
                  ✨ Product Published Successfully to Haute Couture Catalog!
                </div>
              ) : (
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <label className="text-xs text-pearl-300 block mb-1">Bouquet / Product Title:</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. The Imperial Emerald Orchid Cloche"
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-pearl-300 block mb-1">Category:</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
                      >
                        <option value="Featured">Featured</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Hampers">Hampers</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-pearl-300 block mb-1">VIP Price ($ USD):</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
                      />
                    </div>
                  </div>

                  {/* Photo Upload Field */}
                  <div>
                    <label className="text-xs text-pearl-300 block mb-1">Bouquet Photo:</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Image Preview Box */}
                      <div className="w-20 h-20 rounded-xl bg-obsidian-900 border border-gold-500/20 overflow-hidden flex items-center justify-center shrink-0">
                        {newImage ? (
                          <img src={newImage} alt="Bouquet Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-pearl-400">No Image</span>
                        )}
                      </div>
                      
                      <div className="flex-1 w-full space-y-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          id="bouquet-photo-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="bouquet-photo-upload"
                            className="px-4 py-2 rounded-xl bg-obsidian-900 border border-gold-500/30 hover:border-gold-500/60 text-gold-300 text-xs font-serif font-bold cursor-pointer transition-all select-none"
                          >
                            Choose Image File
                          </label>
                          {newImage && (
                            <button
                              type="button"
                              onClick={() => setNewImage('')}
                              className="text-xs text-red-400 hover:text-red-300 font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-pearl-400">Upload a custom bouquet image, or leave empty to use a default luxury visual.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-pearl-300 block mb-1">Tagline & Description:</label>
                    <textarea
                      rows="2"
                      required
                      value={newTagline}
                      onChange={(e) => setNewTagline(e.target.value)}
                      placeholder="Enter rare stem details, packaging type, and 24K gold trim info..."
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-xs text-pearl-100 outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform"
                  >
                    Publish to Sovereign Catalog
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
