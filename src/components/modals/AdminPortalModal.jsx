import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';
import { assetPath } from '../../utils/assetPath';
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
  Filter,
  Lock,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Star,
  AlertTriangle
} from 'lucide-react';

export default function AdminPortalModal() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    formatPrice,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    setOrders,
    appointments,
    traffic,
    cloudSyncStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'inventory' | 'appointments' | 'new-product'
  const [trafficPeriod, setTrafficPeriod] = useState('today');

  const trafficData = {
    today: { visitors: traffic.today.toLocaleString(), change: '+12.4%' },
    week: { visitors: traffic.week.toLocaleString(), change: '+18.1%' },
    month: { visitors: traffic.month.toLocaleString(), change: '+22.5%' },
    allTime: { visitors: traffic.allTime.toLocaleString(), change: '+45.8%' },
  };

  // Live Inventory State
  const [inventory, setInventory] = useState([]);
  
  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Featured');
  const [newPrice, setNewPrice] = useState('550');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');
  const [newStock, setNewStock] = useState('50');
  const [newAvailability, setNewAvailability] = useState('In Stock');
  const [newDeliveryTime, setNewDeliveryTime] = useState('Same-Day VIP Express');
  const [newTags, setNewTags] = useState('Handmade, Ecuadorian Stems, Gold Box');
  const [isFeatured, setIsFeatured] = useState(true);
  const [newTagline, setNewTagline] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isProductAdded, setIsProductAdded] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Featured');
  const [editPrice, setEditPrice] = useState('');
  const [editDiscountPrice, setEditDiscountPrice] = useState('');
  const [editStock, setEditStock] = useState('50');
  const [editAvailability, setEditAvailability] = useState('In Stock');
  const [editDeliveryTime, setEditDeliveryTime] = useState('Same-Day VIP Express');
  const [editTagline, setEditTagline] = useState('');
  const [isEditSaved, setIsEditSaved] = useState(false);

  // Delete Product Confirmation State
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Reset login state when the modal closes
  useEffect(() => {
    if (!isAdminOpen) {
      setIsAdminAuthenticated(false);
      setAdminPassword('');
      setLoginError(false);
    }
  }, [isAdminOpen]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin') {
      setIsAdminAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Multiple Image Upload & Compression Handler
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploadError('');
    setIsUploading(true);
    setUploadProgress(10);

    const processedImages = [];
    let count = 0;

    files.forEach((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setUploadError('❌ Unsupported file format. Please upload JPG, JPEG, PNG, or WebP images.');
        setIsUploading(false);
        setUploadProgress(0);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
          processedImages.push(compressedDataUrl);
          count++;

          const progress = Math.round((count / files.length) * 100);
          setUploadProgress(progress);

          if (count === files.length) {
            setUploadedImages((prev) => [...prev, ...processedImages]);
            setIsUploading(false);
            setUploadProgress(0);
          }
        };
        img.onerror = () => {
          setUploadError('❌ Failed to process image file. Please try another file.');
          setIsUploading(false);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (indexToRemove) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    setIsProductAdded(true);

    const mainImg = uploadedImages.length > 0
      ? uploadedImages[0]
      : assetPath('/assets/images/sovereign_red_roses_1785005575575.png');

    const newBouquet = {
      id: `bouq-${Date.now()}`,
      name: newTitle,
      tagline: newTagline,
      description: newTagline,
      priceUSD: parseFloat(newPrice) || 390,
      originalPriceUSD: newDiscountPrice ? parseFloat(newDiscountPrice) : null,
      rating: 5.0,
      reviewsCount: 1,
      category: newCategory,
      occasion: newCategory === 'Wedding' ? 'Wedding' : 'Anniversary',
      image: mainImg,
      images: uploadedImages.length > 0 ? uploadedImages : [mainImg],
      stock: parseInt(newStock) || 50,
      availability: newAvailability,
      deliveryTime: newDeliveryTime,
      tags: newTags ? newTags.split(',').map((t) => t.trim()) : ['Handmade', 'Luxury'],
      isFeatured: isFeatured,
      badge: isFeatured ? 'Featured Luxury' : 'New Arrival',
      isNew: true,
      is3D: false,
      flowerTypes: ['Rare Custom Import']
    };

    addProduct(newBouquet);

    setTimeout(() => {
      setIsProductAdded(false);
      setNewTitle('');
      setNewTagline('');
      setNewPrice('550');
      setNewDiscountPrice('');
      setUploadedImages([]);
      setActiveTab('inventory'); // Switch to inventory tab to view published product
    }, 1200);
  };

  // Open Product Edit Drawer / Form
  const startEditingProduct = (p) => {
    setEditingProduct(p);
    setEditTitle(p.name);
    setEditCategory(p.category || 'Featured');
    setEditPrice(p.priceUSD?.toString() || '390');
    setEditDiscountPrice(p.originalPriceUSD?.toString() || '');
    setEditStock(p.stock?.toString() || '50');
    setEditAvailability(p.availability || 'In Stock');
    setEditDeliveryTime(p.deliveryTime || 'Same-Day VIP Express');
    setEditTagline(p.tagline || p.description || '');
    setIsEditSaved(false);
  };

  const handleSaveEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editTitle,
      category: editCategory,
      priceUSD: parseFloat(editPrice) || 390,
      originalPriceUSD: editDiscountPrice ? parseFloat(editDiscountPrice) : null,
      stock: parseInt(editStock) || 50,
      availability: editAvailability,
      deliveryTime: editDeliveryTime,
      tagline: editTagline,
      description: editTagline
    });

    setIsEditSaved(true);
    setTimeout(() => {
      setIsEditSaved(false);
      setEditingProduct(null);
    }, 1000);
  };

  // Confirm and Execute Delete Product
  const confirmDeleteProduct = (id) => {
    deleteProduct(id);
    setDeletingProductId(null);
  };

  if (!isAdminOpen) return null;

  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/95 backdrop-blur-2xl p-4 flex items-center justify-center animate-fadeIn">
        <div className="w-full max-w-md glass-panel border border-gold-500/40 rounded-3xl p-8 relative space-y-6 shadow-gold-lg text-center">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 text-pearl-300 hover:text-gold-400 font-bold transition-colors"
          >
            ✕
          </button>

          <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-400">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-pearl-50">Atelier Administration</h3>
            <p className="text-xs text-pearl-300 font-light max-w-xs mx-auto">
              Please authenticate to unlock the sovereign floral command centre.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Enter Password"
                className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3.5 text-center text-xs text-pearl-100 outline-none tracking-widest focus:border-gold-400 transition-colors"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              {loginError && (
                <p className="text-[10px] text-red-400 mt-2 font-serif">Incorrect admin credentials. Try 'admin'.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform"
            >
              Authenticate VIP Access
            </button>
          </form>
        </div>
      </div>
    );
  }

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
            {/* Cloud Sync Status Badge */}
            {cloudSyncStatus === 'syncing' && (
              <span className="px-3 py-1.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-1.5 font-mono animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Syncing to Cloud…
              </span>
            )}
            {cloudSyncStatus === 'success' && (
              <span className="px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3 h-3" />
                Published to All Devices ✓
              </span>
            )}
            {cloudSyncStatus === 'error' && (
              <span className="px-3 py-1.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-xs flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-3 h-3" />
                Cloud Sync Failed (Local Saved)
              </span>
            )}
            {cloudSyncStatus === 'idle' && (
              <span className="px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Live — All Devices In Sync
              </span>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full bg-obsidian-900 border border-gold-500/30 text-pearl-300 hover:text-gold-400 transition-colors"
              aria-label="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gold-500/20 overflow-x-auto py-2">
          {[
            { id: 'dashboard', label: '📊 Command Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: '📦 Live Orders Manager', icon: Package },
            { id: 'inventory', label: '🌹 Stem & Catalog Vault', icon: Boxes },
            { id: 'appointments', label: '📅 VIP Consultations', icon: Calendar },
            { id: 'new-product', label: '✨ Publish New Bouquet', icon: PlusCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-gold-gradient text-obsidian-950 shadow-gold-sm'
                    : 'text-pearl-300 hover:text-gold-300 hover:bg-gold-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto py-6 pr-2">
          
          {/* TAB 1: COMMAND DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Traffic Summary Widget */}
              <div className="glass-panel p-5 rounded-2xl border border-gold-500/25 space-y-4">
                <div className="flex items-center justify-between border-b border-gold-500/15 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gold-400" />
                    <h4 className="font-serif font-bold text-base text-pearl-50">Live Traffic & Pageviews</h4>
                  </div>

                  <div className="flex items-center gap-1.5 bg-obsidian-900 p-1 rounded-full border border-gold-500/20 text-[11px]">
                    {['today', 'week', 'month', 'allTime'].map((pd) => (
                      <button
                        key={pd}
                        onClick={() => setTrafficPeriod(pd)}
                        className={`px-3 py-1 rounded-full uppercase font-serif transition-colors ${
                          trafficPeriod === pd
                            ? 'bg-gold-500/30 text-gold-300 font-bold'
                            : 'text-pearl-400 hover:text-pearl-200'
                        }`}
                      >
                        {pd}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="bg-obsidian-900/60 p-4 rounded-xl border border-gold-500/15">
                    <span className="text-[10px] text-pearl-400 uppercase tracking-widest block">Active Pageviews</span>
                    <span className="text-2xl font-serif font-bold text-gold-gradient">
                      {trafficData[trafficPeriod].visitors}
                    </span>
                  </div>

                  <div className="bg-obsidian-900/60 p-4 rounded-xl border border-gold-500/15">
                    <span className="text-[10px] text-pearl-400 uppercase tracking-widest block">Total Sales Revenue</span>
                    <span className="text-2xl font-serif font-bold text-emerald-400">
                      {formatPrice(orders.reduce((acc, o) => acc + o.amountUSD, 0))}
                    </span>
                  </div>

                  <div className="bg-obsidian-900/60 p-4 rounded-xl border border-gold-500/15">
                    <span className="text-[10px] text-pearl-400 uppercase tracking-widest block">Total Confirmed Orders</span>
                    <span className="text-2xl font-serif font-bold text-pearl-50">
                      {orders.length} Orders
                    </span>
                  </div>

                  <div className="bg-obsidian-900/60 p-4 rounded-xl border border-gold-500/15">
                    <span className="text-[10px] text-pearl-400 uppercase tracking-widest block">Catalog Designs</span>
                    <span className="text-2xl font-serif font-bold text-gold-300">
                      {products.length} Bouquets
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-lg text-pearl-50">Confirmed Customer Orders</h4>
                <span className="text-xs text-pearl-400">Total: {orders.length} Confirmed Orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 space-y-3 border border-gold-500/10 rounded-2xl bg-obsidian-900/40">
                  <Package className="w-12 h-12 text-gold-500/30 mx-auto" />
                  <p className="font-serif text-pearl-200 text-base">No live orders received yet.</p>
                  <p className="text-xs text-pearl-400 font-light">Acquire items from the boutique shop page to see orders populate here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold-500/15 pb-3 gap-2">
                        <div>
                          <span className="text-xs font-mono font-bold text-gold-400">{order.id}</span>
                          <h5 className="font-serif font-bold text-base text-pearl-50">{order.customerInfo?.fullName || order.client || 'Valued Customer'}</h5>
                          <p className="text-[11px] text-pearl-400 font-mono">{order.customerInfo?.mobileNumber} • {order.customerInfo?.email || order.userEmail}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-sm font-serif font-bold text-emerald-400 block">{formatPrice(order.amountUSD)}</span>
                          <span className="text-[10px] text-pearl-300">{order.date} ({order.timeSlot})</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <p className="text-pearl-300 font-light">
                            <strong>Shipping Address:</strong> {order.location}
                          </p>
                          <p className="text-pearl-300 font-light">
                            <strong>Payment Method:</strong> {order.paymentMethod} (ID: {order.paymentId})
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-pearl-300 font-bold text-[11px]">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-2 text-xs text-gold-300 outline-none"
                          >
                            <option value="Order Placed & Payment Confirmed">Order Placed & Payment Confirmed</option>
                            <option value="Preparing Handmade Gift">Preparing Handmade Gift</option>
                            <option value="Master Architect Inspecting">Master Architect Inspecting</option>
                            <option value="Out for White-Glove Delivery">Out for White-Glove Delivery</option>
                            <option value="Delivered & Handed Over">Delivered & Handed Over</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INVENTORY VAULT (With Full Real-Time Edit & Delete Actions) */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-pearl-50">Catalog & Stock Vault</h4>
                  <p className="text-xs text-pearl-400">All edits & deletions synchronize instantly across the entire website on all devices.</p>
                </div>
                <span className="text-xs text-gold-400 font-medium">Total: {products.length} Products Live</span>
              </div>

              {/* Published Catalog Table */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-gold-500/20">
                <table className="w-full text-left text-xs text-pearl-200">
                  <thead className="bg-obsidian-900 border-b border-gold-500/20 text-gold-400 uppercase font-serif">
                    <tr>
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Bouquet Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">VIP Price</th>
                      <th className="p-3.5 text-center">Actions (Edit / Delete)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/10">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gold-500/5 transition-colors">
                        <td className="p-3.5">
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gold-500/20" />
                        </td>
                        <td className="p-3.5 font-semibold text-pearl-50">
                          {p.name}
                          <span className="text-[10px] text-pearl-400 block font-mono font-normal">{p.sku || p.id}</span>
                        </td>
                        <td className="p-3.5 text-pearl-300">{p.category}</td>
                        <td className="p-3.5 font-bold text-gold-gradient">{p.stock || 50} Stems</td>
                        <td className="p-3.5 font-bold text-emerald-400">{formatPrice(p.priceUSD)}</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEditingProduct(p)}
                              className="p-1.5 rounded-lg bg-gold-500/20 border border-gold-400/50 text-gold-300 hover:text-white transition-colors"
                              title="Edit Product Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingProductId(p.id)}
                              className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:text-white transition-colors"
                              title="Delete Product from Catalog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PUBLISH NEW BOUQUET */}
          {activeTab === 'new-product' && (
            <div className="max-w-3xl mx-auto glass-panel p-6 rounded-2xl border border-gold-500/30 space-y-6 animate-fadeIn">
              <div className="text-center space-y-1">
                <h4 className="font-serif font-bold text-xl text-pearl-50">Publish New Haute Couture Product</h4>
                <p className="text-xs text-pearl-300 font-light">Admin product creator with multiple image upload & automatic WebP optimization.</p>
              </div>
              
              {isProductAdded ? (
                <div className="p-4 rounded-2xl bg-gold-500/20 border border-gold-400 text-gold-300 text-center font-serif font-bold text-xs uppercase tracking-widest animate-fadeIn space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-gold-400 mx-auto" />
                  <p>✨ Product Published Successfully to Haute Couture Catalog!</p>
                </div>
              ) : (
                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  
                  <div>
                    <label className="text-pearl-300 block mb-1 font-semibold">Product Name / Title *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. The Sovereign Royal Velvet Roses"
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-pearl-300 block mb-1 font-semibold">Category *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                      >
                        <option value="Featured">Featured</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Hampers">Hampers</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-pearl-300 block mb-1 font-semibold">Selling Price ($ USD) *</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="550"
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="text-pearl-300 block mb-1 font-semibold">Original Price ($ USD) (Optional)</label>
                      <input
                        type="number"
                        value={newDiscountPrice}
                        onChange={(e) => setNewDiscountPrice(e.target.value)}
                        placeholder="650"
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-pearl-300 block mb-1 font-semibold">Stock Quantity *</label>
                      <input
                        type="number"
                        required
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="50"
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="text-pearl-300 block mb-1 font-semibold">Availability *</label>
                      <select
                        value={newAvailability}
                        onChange={(e) => setNewAvailability(e.target.value)}
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Pre-Order">Pre-Order</option>
                        <option value="Limited Edition">Limited Edition</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-pearl-300 block mb-1 font-semibold">Delivery Window *</label>
                      <select
                        value={newDeliveryTime}
                        onChange={(e) => setNewDeliveryTime(e.target.value)}
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                      >
                        <option value="Same-Day VIP Express">Same-Day VIP Express</option>
                        <option value="24-Hour Delivery">24-Hour Delivery</option>
                        <option value="Scheduled Delivery">Scheduled Delivery</option>
                      </select>
                    </div>
                  </div>

                  {/* Multiple Product Images Upload & Preview Section */}
                  <div className="space-y-3 pt-2">
                    <label className="text-pearl-300 block font-semibold">Product Images (JPG, JPEG, PNG, WebP) *</label>

                    {uploadError && (
                      <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">{uploadError}</p>
                    )}

                    {isUploading && (
                      <div className="space-y-1.5 p-3 rounded-xl bg-obsidian-900 border border-gold-500/30">
                        <div className="flex items-center justify-between text-[11px] text-gold-300 font-bold">
                          <span>Uploading & Optimizing Images...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                          <div className="h-full bg-gold-gradient transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <label
                        htmlFor="multiple-product-images-input"
                        className="h-24 rounded-xl border-2 border-dashed border-gold-500/40 hover:border-gold-400 bg-obsidian-900/60 flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center group"
                      >
                        <UploadCloud className="w-6 h-6 text-gold-400 group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-[10px] text-gold-300 font-bold">Upload Photos</span>
                        <span className="text-[9px] text-pearl-400">Multiple files supported</span>
                        <input
                          type="file"
                          id="multiple-product-images-input"
                          multiple
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleMultipleImagesChange}
                          className="hidden"
                        />
                      </label>

                      {uploadedImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-gold-500/30 group bg-obsidian-900">
                          <img src={imgUrl} alt={`Product Upload ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-obsidian-950/80 text-gold-400 text-[8px] font-mono">
                            {idx === 0 ? 'Cover' : `#${idx + 1}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-950/90 text-red-300 hover:text-white transition-colors"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-pearl-300 block mb-1 font-semibold">Search Tags (Comma separated):</label>
                      <input
                        type="text"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="Ecuadorian, Velvet Box, Gold Trim"
                        className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                      />
                    </div>

                    <div className="flex items-center justify-between bg-obsidian-900 p-3 rounded-xl border border-gold-500/20">
                      <div>
                        <span className="text-pearl-100 font-semibold block">Featured Product Toggle</span>
                        <span className="text-[10px] text-pearl-400">Show in Homepage Showcase</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFeatured(!isFeatured)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                          isFeatured ? 'bg-gold-400' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-obsidian-950 transition-transform ${
                          isFeatured ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-pearl-300 block mb-1 font-semibold">Description & Crafting Details *</label>
                    <textarea
                      rows="3"
                      required
                      value={newTagline}
                      onChange={(e) => setNewTagline(e.target.value)}
                      placeholder="Enter stem details, box material, 24K gold rose accents, and preservation instructions..."
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none focus:border-gold-400"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform"
                  >
                    Publish Product Immediately
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Edit Product Popup Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/90 backdrop-blur-2xl p-4 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-lg glass-panel border border-gold-500/40 rounded-3xl p-6 relative space-y-4 shadow-gold-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <h4 className="font-serif font-bold text-lg text-pearl-50">Edit Product: {editingProduct.name}</h4>
              <button onClick={() => setEditingProduct(null)} className="text-pearl-300 hover:text-gold-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isEditSaved ? (
              <div className="p-4 rounded-xl bg-gold-500/20 border border-gold-400 text-gold-300 text-center font-serif font-bold text-xs uppercase tracking-widest">
                ✨ Product Changes Updated Instantly Across Website!
              </div>
            ) : (
              <form onSubmit={handleSaveEditProduct} className="space-y-3 text-xs">
                <div>
                  <label className="text-pearl-300 block mb-1 font-semibold">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-pearl-300 block mb-1 font-semibold">Selling Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-pearl-300 block mb-1 font-semibold">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-pearl-300 block mb-1 font-semibold">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none"
                    >
                      <option value="Featured">Featured</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Hampers">Hampers</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-pearl-300 block mb-1 font-semibold">Availability</label>
                    <select
                      value={editAvailability}
                      onChange={(e) => setEditAvailability(e.target.value)}
                      className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Pre-Order">Pre-Order</option>
                      <option value="Limited Edition">Limited Edition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-pearl-300 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows="2"
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                    className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl p-3 text-pearl-100 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-sm hover:scale-[1.02] transition-transform"
                >
                  Save & Synchronize Immediately
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/90 backdrop-blur-2xl p-4 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-sm glass-panel border border-red-500/40 rounded-3xl p-6 relative space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-pearl-50">Delete Product from Catalog?</h4>
              <p className="text-xs text-pearl-300 font-light">
                This action will instantly remove the product from all homepage sections, collections, search results, carts, and wishlists across all active user sessions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="py-2.5 rounded-full border border-gold-500/30 text-pearl-200 text-xs font-serif font-bold hover:bg-gold-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteProduct(deletingProductId)}
                className="py-2.5 rounded-full bg-red-950 border border-red-500 text-red-300 text-xs font-serif font-bold hover:bg-red-900 transition-colors"
              >
                Delete Instantly
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
