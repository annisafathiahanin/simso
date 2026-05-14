import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Package, Clock, ShieldAlert, ChevronRight, Plus } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, diproses: 0, dikirim: 0, selesai: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reqRes] = await Promise.all([
          axios.get('/.netlify/functions/stats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/.netlify/functions/requests', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(statsRes.data);
        setRequests(reqRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">SIMSO Dashboard</h2>
          <p className="text-slate-500 font-medium">Selamat datang kembali, {user?.name}</p>
        </div>
        {user?.role === 'farmasi' && (
          <Link to="/input" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            <span>Buat Permintaan</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] space-y-4 premium-shadow">
          <div className="bg-amber-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
            <Package className="text-white w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Stok Menipis</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">12</span>
              <span className="text-slate-500 font-bold">Item</span>
            </div>
            <p className="text-amber-600 text-xs font-bold mt-2">Warning</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] space-y-4 premium-shadow">
          <div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Clock className="text-white w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Permintaan Pending</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">{stats.pending}</span>
              <span className="text-slate-500 font-bold">Tiket</span>
            </div>
            <p className="text-blue-600 text-xs font-bold mt-2">Action Required</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] space-y-4 premium-shadow">
          <div className="bg-rose-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
            <ShieldAlert className="text-white w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Obat Kadaluwarsa</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">3</span>
              <span className="text-slate-500 font-bold">Alert</span>
            </div>
            <p className="text-rose-600 text-xs font-bold mt-2">Critical</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl premium-shadow border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Tabel Permintaan Terbaru</h3>
          <Link to="/monitoring" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">ID</th>
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Nama Obat</th>
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Status</th>
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest text-right">Tgl Permintaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Memuat data...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Belum ada permintaan.</td></tr>
              ) : requests.map((req: any, index) => (
                <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 font-bold text-slate-800">{index + 1}</td>
                  <td className="py-5 font-bold text-slate-800">{req.title}</td>
                  <td className="py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm ${
                      req.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                      req.status === 'diproses' ? 'bg-blue-100 text-blue-600' :
                      req.status === 'selesai' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-5 text-right font-medium text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
