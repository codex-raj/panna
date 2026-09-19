import React, { useState } from 'react';
import { 
  X, Plus, Package, Truck, DollarSign, CheckCircle2, 
  Trash2, Edit3, Shield, AlertTriangle, Tag, Sparkles
} from 'lucide-react';
import { Book, Order, SellRequest, Coupon, BookCondition, BookFormat, BookCategory } from '../types';
import { formatINR, calculateDiscountPercent } from '../utils/formatters';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  orders: Order[];
  sellRequests: SellRequest[];
  coupons: Coupon[];
  onAddBook: (newBook: Book) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onApproveSellRequest: (requestId: string) => void;
  onAddCoupon: (newCoupon: Coupon) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  books,
  orders,
  sellRequests,
  coupons,
  onAddBook,
  onUpdateOrderStatus,
  onApproveSellRequest,
  onAddCoupon
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'sell_requests' | 'coupons'>('inventory');

  // New book state
  const [showAddBook, setShowAddBook] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<BookCategory>('Fiction');
  const [newSubcategory, setNewSubcategory] = useState('Contemporary');
  const [newPrice, setNewPrice] = useState(199);
  const [newMrp, setNewMrp] = useState(499);
  const [newCondition, setNewCondition] = useState<BookCondition>('like_new');
  const [newFormat, setNewFormat] = useState<BookFormat>('paperback');
  const [newStock, setNewStock] = useState(5);
  const [newDesc, setNewDesc] = useState('');

  // New coupon state
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(50);
  const [newMinOrder, setNewMinOrder] = useState(299);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    const gradients = [
      'linear-gradient(135deg, #2F6657 0%, #1A3930 100%)',
      'linear-gradient(135deg, #8B3A2B 0%, #522017 100%)',
      'linear-gradient(135deg, #1F3A52 0%, #0F1C28 100%)',
      'linear-gradient(135deg, #D6A419 0%, #7A5B0A 100%)'
    ];
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];

    const created: Book = {
      id: `book-${Date.now()}`,
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      subcategory: newSubcategory,
      price: newPrice,
      mrp: newMrp,
      condition: newCondition,
      conditionDescription: 'Inspected by Panna grading team.',
      accentColor: '#2F6657',
      tags: ['Catalog', 'Reader Pick'],
      conditionOptions: [
        { condition: newCondition, price: newPrice, stock: newStock, description: 'Inspected copy' }
      ],
      coverGradient: randomGrad,
      rating: 4.8,
      reviewCount: 1,
      stock: newStock,
      isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      publisher: 'HarperCollins India',
      publicationYear: 2023,
      pages: 320,
      language: 'English',
      format: newFormat,
      description: newDesc || 'A captivating verified book from the Panna readers community.',
      isBestseller: true
    };

    onAddBook(created);
    setShowAddBook(false);
    setNewTitle('');
    setNewAuthor('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const created: Coupon = {
      code: newCode.toUpperCase(),
      discountType: 'flat',
      value: newDiscount,
      minOrder: newMinOrder,
      description: `₹${newDiscount} OFF on orders over ₹${newMinOrder}`
    };

    onAddCoupon(created);
    setNewCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FAF3E6] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#22291F]/20 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#22291F]/15 bg-[#22291F] text-[#FAF3E6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#D6A419]" />
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">
                Panna Bookstore Admin Console
              </h2>
              <span className="text-[11px] font-mono text-stone-400">
                Inventory, Logistics &amp; Sell Verification Management
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAF3E6] border-b border-[#22291F]/10 font-mono">
          <div className="bg-[#FFFDF8] border border-[#22291F]/10 rounded-xl p-3">
            <span className="text-[10px] text-[#5B6355] block">CATALOG BOOKS</span>
            <span className="text-xl font-bold text-[#22291F]">{books.length}</span>
          </div>
          <div className="bg-[#FFFDF8] border border-[#22291F]/10 rounded-xl p-3">
            <span className="text-[10px] text-[#5B6355] block">PENDING SELL PICKUPS</span>
            <span className="text-xl font-bold text-[#2F6657]">{sellRequests.length}</span>
          </div>
          <div className="bg-[#FFFDF8] border border-[#22291F]/10 rounded-xl p-3">
            <span className="text-[10px] text-[#5B6355] block">TOTAL ORDERS</span>
            <span className="text-xl font-bold text-[#22291F]">{orders.length}</span>
          </div>
          <div className="bg-[#FFFDF8] border border-[#22291F]/10 rounded-xl p-3">
            <span className="text-[10px] text-[#5B6355] block">GROSS REVENUE</span>
            <span className="text-xl font-bold text-[#2F6657]">{formatINR(totalRevenue)}</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#22291F]/10 px-6 bg-[#FAF3E6] overflow-x-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'inventory' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Inventory Catalog ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'orders' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Order Logistics ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('sell_requests')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'sell_requests' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Sell Approvals ({sellRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 px-3 border-b-2 text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'coupons' ? 'border-[#2F6657] text-[#2F6657]' : 'border-transparent text-[#5B6355]'
            }`}
          >
            Promo Coupons ({coupons.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB: Inventory */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F]">
                  Manage Books &amp; Copies Stock
                </h3>
                <button
                  onClick={() => setShowAddBook(!showAddBook)}
                  className="bg-[#2F6657] hover:bg-[#1F4E42] text-white px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddBook ? 'Cancel Form' : 'Add New Book'}
                </button>
              </div>

              {/* Add Book Form */}
              {showAddBook && (
                <form onSubmit={handleCreateBook} className="bg-[#FFFDF8] border-2 border-[#2F6657]/40 rounded-xl p-4 space-y-3 font-mono text-xs">
                  <h4 className="font-bold text-[#22291F]">Catalog New Book</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Title (e.g. Sapiens)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-[#FAF3E6] border border-stone-300 rounded p-2 outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Author (e.g. Yuval Noah Harari)"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="bg-[#FAF3E6] border border-stone-300 rounded p-2 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full bg-[#FAF3E6] border border-stone-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Original MRP (₹)</label>
                      <input
                        type="number"
                        required
                        value={newMrp}
                        onChange={(e) => setNewMrp(Number(e.target.value))}
                        className="w-full bg-[#FAF3E6] border border-stone-300 rounded p-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Condition</label>
                      <select
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value as BookCondition)}
                        className="w-full bg-[#FAF3E6] border border-stone-300 rounded p-2 outline-none"
                      >
                        <option value="brand_new">Brand New</option>
                        <option value="like_new">Like New</option>
                        <option value="good">Good</option>
                        <option value="acceptable">Acceptable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Stock Count</label>
                      <input
                        type="number"
                        required
                        value={newStock}
                        onChange={(e) => setNewStock(Number(e.target.value))}
                        className="w-full bg-[#FAF3E6] border border-stone-300 rounded p-2 outline-none"
                      />
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Short description or synopsis..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-[#FAF3E6] border border-stone-300 rounded p-2 outline-none"
                  />

                  <button
                    type="submit"
                    className="bg-[#22291F] hover:bg-[#2F6657] text-[#FAF3E6] px-4 py-2 rounded font-bold cursor-pointer"
                  >
                    Save &amp; Publish to Shelf
                  </button>
                </form>
              )}

              {/* Table of Books */}
              <div className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#FAF3E6] border-b border-[#22291F]/10 text-[#5B6355]">
                    <tr>
                      <th className="p-3">Title &amp; Author</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price / MRP</th>
                      <th className="p-3">Condition</th>
                      <th className="p-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {books.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50">
                        <td className="p-3">
                          <span className="font-bold text-[#22291F] block">{b.title}</span>
                          <span className="text-[10px] text-[#5B6355]">{b.author}</span>
                        </td>
                        <td className="p-3 text-stone-600">{b.category}</td>
                        <td className="p-3">
                          <span className="font-bold text-[#22291F]">{formatINR(b.price)}</span>
                          <span className="line-through text-stone-400 text-[10px] ml-1.5">{formatINR(b.mrp)}</span>
                        </td>
                        <td className="p-3 uppercase text-[10px] font-semibold text-[#2F6657]">
                          {b.condition.replace('_', ' ')}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.stock > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.stock} copies
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Order Logistics */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F]">
                Active Customer Orders &amp; Fulfillment
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {orders.map((o) => (
                  <div key={o.id} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                      <div>
                        <span className="font-bold text-sm text-[#22291F]">{o.id}</span>
                        <span className="text-stone-400 ml-2">{o.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">Status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                          className="bg-[#FAF3E6] border border-stone-300 rounded px-2 py-1 text-xs font-bold text-[#2F6657] outline-none"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Quality Checked & Packed">Quality Checked & Packed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5B6355]">
                      <div>
                        <p><strong>Customer:</strong> {o.shippingAddress.fullName} ({o.shippingAddress.phone})</p>
                        <p><strong>Destination:</strong> {o.shippingAddress.city}, {o.shippingAddress.pincode}</p>
                      </div>
                      <div className="sm:text-right">
                        <p><strong>Payment:</strong> {o.paymentMethod.toUpperCase()}</p>
                        <p><strong>Total:</strong> <span className="font-bold text-[#2F6657] text-sm">{formatINR(o.total)}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Sell Approvals */}
          {activeTab === 'sell_requests' && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F]">
                Second-Hand Sell Requests &amp; Payout Release
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {sellRequests.map((req) => (
                  <div key={req.id} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                      <div>
                        <span className="font-bold text-sm text-[#22291F]">{req.id}</span>
                        <span className="text-stone-400 ml-2">{req.date}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'Approved & Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {req.books.map((b, i) => (
                        <div key={i} className="flex justify-between text-[#5B6355]">
                          <span>{b.title} by {b.author} ({b.condition})</span>
                          <span className="font-bold text-[#22291F]">Quote: {formatINR(b.estimatedQuote)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-100 pt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-[#5B6355]">
                        Payout: <strong>{formatINR(req.totalQuote)}</strong> via <strong>{req.payoutMode}</strong>
                      </div>
                      {req.status !== 'Approved & Paid' && (
                        <button
                          onClick={() => onApproveSellRequest(req.id)}
                          className="bg-[#2F6657] hover:bg-[#1F4E42] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
                        >
                          Approve Inspection &amp; Credit Payout
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Coupons */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[#22291F]">
                  Promotional Coupons
                </h3>
              </div>

              {/* Add coupon inline */}
              <form onSubmit={handleCreateCoupon} className="flex flex-wrap gap-2 items-center bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3 font-mono text-xs">
                <input
                  type="text"
                  placeholder="CODE (e.g. SUMMER75)"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="bg-[#FAF3E6] border border-stone-300 rounded px-2.5 py-1.5 outline-none uppercase"
                />
                <input
                  type="number"
                  placeholder="Discount ₹"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(Number(e.target.value))}
                  className="w-24 bg-[#FAF3E6] border border-stone-300 rounded px-2.5 py-1.5 outline-none"
                />
                <input
                  type="number"
                  placeholder="Min Order ₹"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(Number(e.target.value))}
                  className="w-28 bg-[#FAF3E6] border border-stone-300 rounded px-2.5 py-1.5 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#22291F] text-[#FAF3E6] px-4 py-1.5 rounded font-bold cursor-pointer"
                >
                  Create Coupon
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {coupons.map((c) => (
                  <div key={c.code} className="bg-[#FFFDF8] border border-[#22291F]/15 rounded-xl p-3.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#2F6657]">{c.code}</span>
                      <span className="bg-[#2F6657]/10 text-[#2F6657] px-2 py-0.5 rounded text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[#5B6355] text-[11px]">{c.description}</p>
                    <p className="text-stone-400 text-[10px]">Min. cart requirement: {formatINR(c.minOrder)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
