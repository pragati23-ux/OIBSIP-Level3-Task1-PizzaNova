import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import { CartProvider } from './context/CartContext';

axios.defaults.baseURL = 'http://localhost:5001';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        toast.error('Session expired');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-300">Loading experience...</div>;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#06060b] text-slate-100' : 'bg-[#f7f4f1] text-slate-900'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} user={user} onLogout={() => { setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); }} />
      <Routes>
        <Route path="/" element={user ? <DashboardPage /> : <AuthPage onAuth={setUser} />} />
        <Route path="/menu" element={user ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/admin-login" element={<AdminLoginPage onAuth={setUser} />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <CartDrawer />
      <Toaster position="top-right" toastOptions={{ className: 'bg-[#16141f] text-white', style: { border: '1px solid rgba(255,255,255,0.1)' } }} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}
