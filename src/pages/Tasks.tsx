import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Truck, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const Tasks = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/.netlify/functions/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Show requests that are being processed or shipped
      setRequests(res.data.filter((r: any) => r.status === 'diproses' || r.status === 'dikirim'));
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
      alert('Gagal mengupdate status');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Halaman Tugas</h2>
        <p className="text-slate-400 font-medium">Update progres pengerjaan permintaan obat secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-bold">Memuat data...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Semua tugas telah selesai dikerjakan.</p>
          </div>
        ) : requests.map((req: any) => (
          <div key={req.id} className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all premium-shadow">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  req.status === 'diproses' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {req.status}
                </span>
                <span className="text-slate-300 text-xs font-bold">#{req.id.slice(0, 8)}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800">{req.title}</h3>
              <p className="text-slate-400 text-sm font-medium">Tujuan: <span className="text-slate-600 font-bold">{req.location}</span></p>
            </div>

            <div className="flex items-center gap-3">
              {req.status === 'diproses' && (
                <button 
                  onClick={() => handleUpdate(req.id, 'dikirim')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                >
                  <Truck className="w-5 h-5" /> Mulai Pengiriman
                </button>
              )}
              {req.status === 'dikirim' && (
                <button 
                  onClick={() => handleUpdate(req.id, 'selesai')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                >
                  <CheckCircle className="w-5 h-5" /> Selesaikan Tugas
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
