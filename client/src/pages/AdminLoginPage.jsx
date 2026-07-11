import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, KeyRound, Mail, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', form);
      if (data.user.role !== 'admin') {
        setMessage('Admin credentials are required to access the dashboard.');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth(data.user);
      navigate('/admin');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,138,31,0.16),transparent_32%),linear-gradient(135deg,_#06060b,_#11111d)] px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Admin access</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Kitchen dashboard login</h1>
            <p className="mt-3 text-slate-400">Use your admin credentials to manage inventory, orders, and stock alerts.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Mail size={17} className="text-slate-400" />
              <input
                type="email"
                placeholder="Admin email"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <KeyRound size={17} className="text-slate-400" />
              <input
                type="password"
                placeholder="Admin password"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-glow">
              Sign in <ArrowRight size={16} />
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-brand-100">{message}</p>}

          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#0f0d15] p-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 text-brand-100">
              <ShieldCheck size={16} />
              Admin panel is separate from customer login.
            </div>
            <p className="mt-3 text-slate-400">
              Coming from the customer area? <Link to="/" className="font-semibold text-white underline">Go back to user login</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
