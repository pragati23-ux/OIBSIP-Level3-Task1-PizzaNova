import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, PackageCheck, ChefHat, Truck, PlusCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const statusSteps = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

export default function DashboardPage() {
  const { addToCart } = useCart();
  const [pizzas, setPizzas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [builder, setBuilder] = useState({
    base: 'Classic Crust',
    sauce: 'Tomato',
    cheese: 'Mozzarella',
    toppings: ['Olives']
  });

  const user = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);

  const fetchData = async () => {
    try {
      const [pizzaRes, orderRes] = await Promise.all([
        axios.get('/api/pizzas'),
        axios.get(`/api/orders/user/${user.id}`)
      ]);
      setPizzas(pizzaRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const addCustomPizza = () => {
    const customPizza = {
      _id: `custom-${Date.now()}`,
      name: `${builder.base} Custom Pizza`,
      description: `${builder.sauce} sauce with ${builder.cheese} cheese and ${builder.toppings.join(', ')}`,
      price: 16 + builder.toppings.length,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      category: 'Custom',
      ingredients: [builder.sauce, builder.cheese, ...builder.toppings]
    };

    addToCart(customPizza);
    toast.success('Custom pizza added to cart');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#12111a] via-[#181523] to-[#0f0c16] p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Customer dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Fresh pizzas and live order progress</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Choose from our available varieties, build your own pizza, and track every order from prep to delivery.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 text-brand-100"><PackageCheck size={16} /> {pizzas.length} available varieties</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[30px] border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Available pizza varieties</p>
              <h2 className="text-xl font-semibold text-white">Pick your favorite</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {loading ? (
              <div className="col-span-full rounded-[24px] border border-dashed border-white/10 bg-[#0f0d15] p-6 text-sm text-slate-400">Loading menu…</div>
            ) : (
              pizzas.map((pizza) => (
                <div key={pizza._id} className="rounded-[24px] border border-white/10 bg-[#0f0d15] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{pizza.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{pizza.description}</p>
                    </div>
                    <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-sm text-brand-100">${pizza.price}</span>
                  </div>
                  <button onClick={() => addToCart(pizza)} className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
                    <PlusCircle size={15} /> Add to cart
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-white/5 p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Custom pizza builder</p>
            <h2 className="text-xl font-semibold text-white">Create your signature pie</h2>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">
              Base
              <select value={builder.base} onChange={(e) => setBuilder({ ...builder, base: e.target.value })} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0d15] px-3 py-2 text-white">
                <option>Classic Crust</option>
                <option>Thin Crust</option>
                <option>Stuffed Crust</option>
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Sauce
              <select value={builder.sauce} onChange={(e) => setBuilder({ ...builder, sauce: e.target.value })} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0d15] px-3 py-2 text-white">
                <option>Tomato</option>
                <option>BBQ</option>
                <option>Pesto</option>
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Cheese
              <select value={builder.cheese} onChange={(e) => setBuilder({ ...builder, cheese: e.target.value })} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0d15] px-3 py-2 text-white">
                <option>Mozzarella</option>
                <option>Cheddar</option>
                <option>Four Cheese</option>
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Toppings
              <input value={builder.toppings.join(', ')} onChange={(e) => setBuilder({ ...builder, toppings: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0f0d15] px-3 py-2 text-white" />
            </label>
            <button onClick={addCustomPizza} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-2.5 font-semibold text-white shadow-glow">
              <Sparkles size={16} /> Add custom pizza
            </button>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[30px] border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Live order status</p>
            <h2 className="text-xl font-semibold text-white">Your recent deliveries</h2>
          </div>
        </div>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-[#0f0d15] p-6 text-sm text-slate-400">No orders yet. Your newest order will appear here with real-time updates.</div>
          ) : orders.map((order) => {
            const currentIndex = statusSteps.indexOf(order.status || 'Order Received');
            const progress = ((currentIndex + 1) / statusSteps.length) * 100;
            return (
              <div key={order._id} className="rounded-[24px] border border-white/10 bg-[#0f0d15] p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-white">Order #{order._id.slice(0, 6)}</p>
                    <p className="mt-1 text-sm text-slate-400">{order.items?.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
                  </div>
                  <div className="rounded-full bg-brand-500/10 px-3 py-1 text-sm text-brand-100">{order.status || 'Order Received'}</div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {statusSteps.map((step, index) => {
                    const active = index <= currentIndex;
                    return (
                      <div key={step} className={`rounded-2xl border px-3 py-2 text-sm ${active ? 'border-brand-500/40 bg-brand-500/10 text-brand-100' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                        {index === 0 && <ChefHat size={14} className="mr-2 inline" />}
                        {index === 1 && <Sparkles size={14} className="mr-2 inline" />}
                        {index === 2 && <Truck size={14} className="mr-2 inline" />}
                        {step}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
