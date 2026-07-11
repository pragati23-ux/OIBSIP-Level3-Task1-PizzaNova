import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Flame, Sparkles, Clock3, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PizzaCard from '../components/PizzaCard';
import SkeletonCard from '../components/SkeletonCard';

const categories = ['All', 'Veg', 'Cheese Burst', 'Combo', 'Signature'];

export default function HomePage() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const { data } = await axios.get('/api/pizzas');
        setPizzas(data);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const filtered = useMemo(() => {
    let result = pizzas;
    if (activeCategory !== 'All') {
      result = result.filter((pizza) => pizza.category === activeCategory || pizza.name.includes(activeCategory));
    }
    if (searchTerm) {
      result = result.filter((pizza) => pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) || pizza.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return result;
  }, [activeCategory, pizzas, searchTerm]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#13111d] via-[#181525] to-[#0f0c17] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.24)] lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-100">
              <Flame size={16} />
              Midnight offer • 25% off your first order
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              Fire-kissed pizza, delivered with cinematic calm.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-400">
              Discover hand-tossed favorites, decadent cheese pulls, and a curated delivery experience made for slow evenings and fast cravings.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setActiveCategory('All')} className="rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-5 py-3 font-semibold text-white shadow-glow hover:shadow-lg transition">Order now</button>
              <button onClick={() => { setActiveCategory('All'); setSearchTerm(''); document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 hover:bg-white/10 transition">Explore menu</button>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-white">Today’s picks</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Live kitchen</span>
            </div>
            <div className="space-y-3">
              {['Neon Pepperoni', 'Garden Glow', 'Velvet Truffle'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0e0c14] p-3">
                  <div>
                    <p className="font-medium text-white">{item}</p>
                    <p className="text-sm text-slate-400">12-18 mins • Freshly baked</p>
                  </div>
                  <div className="rounded-full bg-brand-500/10 p-2 text-brand-100">
                    <Sparkles size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="menu-section" className="rounded-[32px] border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Categories</p>
            <h2 className="text-2xl font-semibold text-white">Browse by mood</h2>
          </div>
          <input placeholder="Search pizzas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${activeCategory === category ? 'bg-brand-500 text-white shadow-glow' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Trending now</p>
            <h2 className="text-2xl font-semibold text-white">Signature pizzas</h2>
          </div>
          <button onClick={() => { setActiveCategory('All'); setSearchTerm(''); }} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-brand-100 transition">View full menu <ArrowRight size={16} /></button>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pizza) => <PizzaCard key={pizza._id} pizza={pizza} />)}
          </div>
        )}
      </section>

      <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-5 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-[#101018] p-4">
          <Clock3 size={18} className="mb-3 text-brand-100" />
          <h3 className="font-semibold text-white">Fast delivery lanes</h3>
          <p className="mt-2 text-sm text-slate-400">Your pizza reaches your door in under 30 minutes on most orders.</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#101018] p-4">
          <ShieldCheck size={18} className="mb-3 text-brand-100" />
          <h3 className="font-semibold text-white">Secure checkout</h3>
          <p className="mt-2 text-sm text-slate-400">Protected, test-mode payments with simple, guided confirmations.</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#101018] p-4">
          <Sparkles size={18} className="mb-3 text-brand-100" />
          <h3 className="font-semibold text-white">Fresh from the oven</h3>
          <p className="mt-2 text-sm text-slate-400">Curated ingredients and premium toppings crafted daily.</p>
        </div>
      </section>

      <footer className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#13111d] via-[#181525] to-[#0f0c17] p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Pizza Nova</h3>
            <p className="mt-2 text-sm text-slate-400">Crafted & delivered fast. Experience premium pizza on demand.</p>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400"><Phone size={14} /> +1 (555) 123-4567</div>
              <div className="flex items-center gap-2 text-sm text-slate-400"><Mail size={14} /> support@pizzanova.com</div>
              <div className="flex items-center gap-2 text-sm text-slate-400"><MapPin size={14} /> 123 Slice Street, NYC 10001</div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Quick Links</p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-slate-400 hover:text-brand-100 cursor-pointer">About Us</p>
              <p className="text-slate-400 hover:text-brand-100 cursor-pointer">Privacy Policy</p>
              <p className="text-slate-400 hover:text-brand-100 cursor-pointer">Terms of Service</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          <p>© 2026 Pizza Nova. All rights reserved. Crafted with passion for pizza lovers everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
