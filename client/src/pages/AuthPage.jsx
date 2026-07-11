import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, KeyRound, Mail, UserRound } from 'lucide-react';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(endpoint, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth(data.user);
      setMessage(mode === 'login' ? 'Welcome back!' : 'Account created.');
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message;
      setMessage(backendMessage || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,138,31,0.16),transparent_32%),linear-gradient(135deg,_#06060b,_#11111d)] px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="mb-5 inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-100">Pizza Nova • Premium delivery</div>
            <h1 className="text-4xl font-black tracking-tight text-white">Your next favorite pizza, beautifully delivered.</h1>
            <p className="mt-4 text-lg text-slate-400">A modern pizza experience with curated menu picks, elegant checkout, and real-time order updates.</p>
            <div className="mt-8 rounded-[28px] border border-white/10 bg-[#0f0d15] p-5">
              <p className="text-sm text-slate-400">Why diners love it</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Signature combos and seasonal specials</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Smooth, guided checkout flow</li>
                <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Live tracking from oven to doorstep</li>
              </ul>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <div className="mb-6 flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              <button onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-300'}`}>Login</button>
              <button onClick={() => setMode('register')} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-300'}`}>Create account</button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <UserRound size={17} className="text-slate-400" />
                  <input placeholder="Your name" className="w-full bg-transparent text-sm text-white placeholder:text-slate-500" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
              )}
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Mail size={17} className="text-slate-400" />
                <input type="email" placeholder="Email address" className="w-full bg-transparent text-sm text-white placeholder:text-slate-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <KeyRound size={17} className="text-slate-400" />
                <input type="password" placeholder="Password" className="w-full bg-transparent text-sm text-white placeholder:text-slate-500" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-glow">
                Continue <ArrowRight size={16} />
              </button>
            </form>
            {message && <p className="mt-4 text-sm text-brand-100">{message}</p>}
            <p className="mt-4 text-sm text-slate-400">
              Need admin access? <Link to="/admin-login" className="font-semibold text-white underline">Sign in through the admin dashboard</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
