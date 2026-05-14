import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Search, Filter, ArrowUpRight, Download } from 'lucide-react';
import axios from 'axios';

export const Monitoring = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('/.netlify/functions/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Monitoring Real-time</h2>
          <p className="text-slate-400 font-medium">Pantau seluruh status permintaan dari berbagai unit secara terpadu.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-5 h-5" /> Export Data
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl premium-shadow border border-slate-50 overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan ID, nama obat, atau lokasi..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <button className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors border border-slate-100">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest px-4">Info Tiket</th>
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest px-4">Prioritas</th>
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest px-4">Status</th>
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest px-4">Update Terakhir</th>
                <th className="pb-4 text-slate-400 font-bold text-xs uppercase tracking-widest px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold">Memuat monitoring data...</td></tr>
              ) : requests.map((req: any) => (
                <tr key={req.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-6 px-4">
                    <div className="space-y-1">
                      <p className="font-black text-slate-800 text-lg tracking-tight">{req.title}</p>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Unit: {req.location}</p>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      req.priority === 'urgent' ? 'bg-rose-100 text-rose-600' : 
                      req.priority === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        req.status === 'selesai' ? 'bg-green-500' : 
                        req.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <span className="font-black text-xs uppercase tracking-widest text-slate-600">{req.status}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-slate-500 font-medium">{new Date(req.updatedAt).toLocaleDateString()}</p>
                    <p className="text-slate-300 text-[10px] font-bold">{new Date(req.updatedAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button className="text-blue-500 p-3 hover:bg-blue-50 rounded-xl transition-all">
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
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
