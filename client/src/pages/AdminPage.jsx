import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, AlertTriangle, TrendingUp, PackageSearch } from 'lucide-react';

export default function AdminPage() {
  const [pizzas, setPizzas] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Signature' });
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    const [pizzaRes, inventoryRes, ordersRes] = await Promise.all([
      axios.get('/api/pizzas'),
      axios.get('/api/inventory'),
      axios.get('/api/orders')
    ]);
    setPizzas(pizzaRes.data);
    setInventory(inventoryRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPizza = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim() || !form.description.trim() || !form.price) {
      setFormError('Please complete all pizza fields before saving.');
      return;
    }

    try {
      await axios.post('/api/pizzas', { ...form, price: Number(form.price) });
      setOpenModal(false);
      setForm({ name: '', description: '', price: '', category: 'Signature' });
      fetchData();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Unable to save pizza.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Admin console</p>
          <h1 className="text-3xl font-semibold text-white">Kitchen operations</h1>
        </div>
        <button onClick={() => setOpenModal(true)} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-2.5 font-semibold text-white shadow-glow">
          <Plus size={16} /> Add pizza
        </button>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-brand-100"><PackageSearch size={18} /> Menu items</div>
          <p className="text-3xl font-semibold text-white">{pizzas.length}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-brand-100"><TrendingUp size={18} /> Live orders</div>
          <p className="text-3xl font-semibold text-white">{orders.length}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-brand-100"><AlertTriangle size={18} /> Low stock alerts</div>
          <p className="text-3xl font-semibold text-white">{inventory.filter((item) => item.stock < item.threshold).length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[30px] border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Inventory status</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-400">Realtime</span>
          </div>
          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-[20px] border border-white/10 bg-[#0f0d15] p-4">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">Threshold {item.threshold}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-sm font-semibold ${item.stock < item.threshold ? 'bg-rose-500/15 text-rose-200' : 'bg-emerald-500/15 text-emerald-200'}`}>
                  {item.stock} units
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent orders</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-400">Updated</span>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="rounded-[20px] border border-white/10 bg-[#0f0d15] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{order.customerEmail}</p>
                  <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-sm text-brand-100">{order.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{order.items?.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[#0f0d15] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Add a new pizza</h3>
              <button onClick={() => setOpenModal(false)} className="text-sm text-slate-400">Close</button>
            </div>
            <form onSubmit={addPizza} className="space-y-3">
              <input placeholder="Pizza name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Description" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input type="number" placeholder="Price" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input placeholder="Category" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <button type="submit" className="w-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-glow">Save pizza</button>
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
