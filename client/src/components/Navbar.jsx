import { Search, MoonStar, SunMedium, ShoppingBag, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar({ darkMode, setDarkMode, user, onLogout }) {
  const { cartItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06060b]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-lg font-black text-white shadow-glow">
            P
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Pizza Nova</p>
            <p className="text-sm text-slate-400">Crafted & delivered fast</p>
          </div>
        </Link>

        <div className="hidden flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 md:flex">
          <Search size={18} className="text-slate-400" />
          <input 
            placeholder="Find your next slice" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none" 
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode((prev) => !prev)} className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:bg-white/10">
            {darkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative rounded-full border border-white/10 bg-gradient-to-r from-brand-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
            <ShoppingBag size={16} className="mr-2 inline" />
            Cart
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </button>
          {user && (
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:bg-white/10">
                <User size={18} />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#16141f] shadow-lg">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
