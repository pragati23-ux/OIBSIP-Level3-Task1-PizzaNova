import { X, Minus, Plus, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const placeOrder = async (user) => {
    try {
      await axios.post('/api/orders', {
        userId: user.id,
        items: cartItems,
        total: subtotal,
        address,
        customerEmail: user.email,
        paymentStatus: 'paid',
        status: 'Order Received',
        razorpayPaymentId: `demo_${Date.now()}`
      });
      toast.success('Order placed successfully!');
      clearCart();
      setAddress('');
      setShowSummary(false);
      setIsCartOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }
    setShowSummary(true);
  };

  const handleRazorpayDemo = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsCheckingOut(true);

    if (window.Razorpay) {
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag',
        amount: Math.round(subtotal * 100),
        currency: 'INR',
        name: 'Pizza Nova',
        description: `Pizza Order - ${cartItems.length} items`,
        image: 'https://via.placeholder.com/150',
        handler: async () => {
          await placeOrder(user);
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: '9999999999'
        },
        theme: {
          color: '#a78bfa'
        },
        modal: {
          ondismiss: () => {
            setIsCheckingOut(false);
            toast.error('Payment cancelled');
          }
        }
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (err) {
        console.warn('Razorpay unavailable, using demo confirmation', err);
        await placeOrder(user);
      }
    } else {
      await placeOrder(user);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#09070f]/95 p-5 shadow-2xl transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Your cart</p>
            <p className="text-sm text-slate-400">{cartItems.length} items selected</p>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">Your cart is empty. Add some crafted pizzas to begin.</div>
          ) : cartItems.map((item) => (
            <div key={item._id} className="rounded-[24px] border border-white/10 bg-white/5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-400">${item.price}</p>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="text-sm text-slate-400">Remove</button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1">
                  <button onClick={() => updateQuantity(item._id, -1)} className="rounded-full p-1.5 text-slate-200 hover:bg-white/10"><Minus size={14} /></button>
                  <span className="min-w-5 text-center text-sm text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)} className="rounded-full p-1.5 text-slate-200 hover:bg-white/10"><Plus size={14} /></button>
                </div>
                <p className="font-semibold text-white">${item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4">
          {!showSummary ? (
            <>
              <input placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} className="mb-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400" />
              <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <button disabled={isCheckingOut || cartItems.length === 0 || !address.trim()} onClick={handleCheckout} className="mt-3 w-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed">
                {isCheckingOut ? 'Processing...' : 'Proceed to checkout'}
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-[#0f0d15] p-3">
                <p className="text-sm font-semibold text-white">Order summary</p>
                <p className="mt-2 text-sm text-slate-400">{address}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-300">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Total</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <button onClick={handleRazorpayDemo} disabled={isCheckingOut} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-glow disabled:opacity-50">
                {isCheckingOut ? 'Processing...' : 'Pay now'} <ArrowRight size={16} />
              </button>
              <button onClick={() => setShowSummary(false)} className="w-full text-sm text-slate-400">Back to cart</button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
