import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Send, MapPin, AlertCircle, FileText, Upload } from 'lucide-react';
import axios from 'axios';

export const RequestForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    priority: 'medium',
    description: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/.netlify/functions/requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim permintaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl premium-shadow border border-slate-100 space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Form Permintaan Obat</h2>
          <p className="text-slate-400 font-medium mt-1">Lengkapi detail permintaan untuk segera diproses oleh tim logistik.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 px-1">
                <FileText className="w-4 h-4 text-blue-500" /> Nama Obat / Judul
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="Contoh: Paracetamol 500mg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 px-1">
                <MapPin className="w-4 h-4 text-rose-500" /> Lokasi Unit
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="Contoh: Unit Gawat Darurat"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 px-1">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Tingkat Prioritas
            </label>
            <div className="grid grid-cols-4 gap-4">
              {['low', 'medium', 'high', 'urgent'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                    formData.priority === p 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 px-1">
              <Upload className="w-4 h-4 text-purple-500" /> Foto Pendukung (URL)
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-medium"
              placeholder="https://..."
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Mengirim...' : 'Kirim Permintaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
