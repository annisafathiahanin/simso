import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X, UserPlus, Clock } from 'lucide-react';
import axios from 'axios';

export const Verification = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/.netlify/functions/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data.filter((r: any) => r.status === 'pending'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleUpdate = async (id: string, status: string) => {
    try {
      await axios.patch('/.netlify/functions/requests', { id, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests();
    } catch (err) {
      alert('Gagal memproses permintaan');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Halaman Verifikasi</h2>
        <p className="text-slate-400 font-medium">Setujui dan teruskan permintaan obat ke tim pengerjaan.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold">Memuat data...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Tidak ada permintaan menunggu verifikasi.</p>
          </div>
        ) : requests.map((req: any) => (
          <div key={req.id} className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all premium-shadow">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  req.priority === 'urgent' ? 'bg-rose-100 text-rose-600' : 
                  req.priority === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {req.priority}
                </span>
                <span className="text-slate-300 text-xs font-bold">#{req.id.slice(0, 8)}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800">{req.title}</h3>
              <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {new Date(req.createdAt).toLocaleTimeString()}
                </div>
                <div>Lokasi: <span className="text-slate-600 font-bold">{req.location}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleUpdate(req.id, 'diproses')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
              >
                <UserPlus className="w-5 h-5" /> Setujui & Assign
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-4 rounded-2xl transition-all active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
