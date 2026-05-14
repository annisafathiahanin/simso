
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, AlertCircle } from 'lucide-react';
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
  const fakeUser = {
    email: email,
    role: email.includes('logistik')
      ? 'logistik'
      : email.includes('manajemen')
      ? 'manajemen'
      : 'farmasi'
  };

  login('fake-token', fakeUser);
  navigate('/');
} catch (err: any) {
  setError('Login gagal');
} finally {
  setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-8 premium-shadow">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-200">
              <Activity className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter">SIMSO</h1>
          <p className="text-slate-400 font-medium">Sistem Informasi Manajemen Stok Obat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="Username / Email"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
          <div className="text-center">
            <button type="button" className="text-slate-400 text-sm font-semibold hover:text-blue-600 transition-colors">
              Lupa Password?
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
           <button onClick={() => setEmail('farmasi@test.com')} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">Farmasi</button>
           <button onClick={() => setEmail('logistik@test.com')} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">Logistik</button>
           <button onClick={() => setEmail('manajemen@test.com')} className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-lg">Manajemen</button>
        </div>
      </div>
    </div>
  );
};
