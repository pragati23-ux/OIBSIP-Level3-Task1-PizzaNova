import { Plus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PizzaCard({ pizza, loading = false }) {
  const { addToCart } = useCart();

  if (loading) {
    return <div className="h-72 animate-pulse rounded-[30px] border border-white/10 bg-white/5" />;
  }

  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative overflow-hidden rounded-[24px]">
        <img src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'} alt={pizza.name} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 rounded-full bg-[#09070f]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
          <Sparkles size={12} className="mr-1 inline" />
          Trending
        </div>
      </div>
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{pizza.name}</h3>
          <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-semibold text-brand-100">★ 4.8</span>
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-slate-400">{pizza.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Starting at</p>
            <p className="text-lg font-semibold text-white">${pizza.price}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">Customize</button>
            <button onClick={() => addToCart(pizza)} className="rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 p-2.5 text-white shadow-glow transition hover:scale-105">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
