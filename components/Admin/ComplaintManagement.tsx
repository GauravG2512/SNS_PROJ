
import React, { useState, useEffect } from 'react';
import { User, ComplaintStatus, ComplaintPriority } from '../../types';
import { Filter, Search, MoreHorizontal, LayoutList, Map as MapIcon, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

const initLeafletIcon = () => {
  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;
};

const ComplaintManagement: React.FC<{ user: User }> = ({ user }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    initLeafletIcon();
    const stored = JSON.parse(localStorage.getItem('sns_complaints') || '[]');
    setComplaints(stored);
  }, []);

  const getStatusBadge = (status: ComplaintStatus) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ";
    switch (status) {
      case ComplaintStatus.SUBMITTED: return base + "bg-amber-100 text-amber-700 border-amber-200";
      case ComplaintStatus.ASSIGNED: return base + "bg-blue-100 text-blue-700 border-blue-200";
      case ComplaintStatus.IN_PROGRESS: return base + "bg-indigo-100 text-indigo-700 border-indigo-200";
      case ComplaintStatus.RESOLVED: return base + "bg-green-100 text-green-700 border-green-200";
      case ComplaintStatus.CLOSED: return base + "bg-gray-100 text-gray-700 border-gray-200";
      case ComplaintStatus.ESCALATED: return base + "bg-red-100 text-red-700 border-red-200";
      case ComplaintStatus.REJECTED: return base + "bg-black text-white border-black";
      default: return base + "bg-gray-50 text-gray-400";
    }
  };

  const getPriorityColor = (p: ComplaintPriority) => {
    switch (p) {
      case ComplaintPriority.URGENT: return "text-red-600";
      case ComplaintPriority.HIGH: return "text-orange-600";
      case ComplaintPriority.MEDIUM: return "text-blue-600";
      default: return "text-gray-400";
    }
  };

  const filtered = complaints.filter(c => filterStatus === 'all' || c.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Grievances</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Grievance Lifecycle Management</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-black ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
            <LayoutList size={14} /> LIST
          </button>
          <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-black ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
            <MapIcon size={14} /> GEO MAP
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4">
        {['all', ...Object.values(ComplaintStatus)].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-lg text-[10px] font-black border transition-all ${filterStatus === s ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Incident</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono font-black text-blue-600 block">{c.complaintNumber}</span>
                    <h4 className="font-bold text-gray-900 text-sm">{c.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{c.categoryName} • {c.citizenName}</p>
                  </td>
                  <td className="px-6 py-4 text-center"><span className={getStatusBadge(c.status)}>{c.status}</span></td>
                  <td className={`px-6 py-4 text-xs font-black ${getPriorityColor(c.priority)}`}>{c.priority}</td>
                  <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-blue-600 shadow-sm transition-all"><ChevronRight size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest">No matching records found in schema.</div>}
        </div>
      ) : (
        <div className="h-[600px] bg-white rounded-3xl shadow-xl border border-gray-200 p-2 relative">
          <MapContainer center={[19.0330, 73.0297]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filtered.map(c => (
              <Marker key={c.id} position={[c.latitude, c.longitude]}>
                <Popup>
                  <div className="p-1">
                    <p className="text-[10px] font-mono text-blue-600 font-bold">{c.complaintNumber}</p>
                    <h4 className="font-bold text-sm mb-1">{c.title}</h4>
                    <p className="text-[10px] text-gray-500 mb-2">{c.address}</p>
                    <div className="flex items-center justify-between">
                       <span className={getStatusBadge(c.status)}>{c.status}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
