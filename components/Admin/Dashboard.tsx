
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ComplaintStatus } from '../../types';
import { ListTodo, PieChart, Users, Map, Plus, ChevronRight } from 'lucide-react';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ new: 0, progress: 0, escalated: 0, overdue: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const complaints = JSON.parse(localStorage.getItem('sns_complaints') || '[]');
    setStats({
      // Fixed: Replaced non-existent PENDING with SUBMITTED (Line 15)
      new: complaints.filter((c: any) => c.status === ComplaintStatus.SUBMITTED).length,
      progress: complaints.filter((c: any) => c.status === ComplaintStatus.IN_PROGRESS || c.status === ComplaintStatus.ASSIGNED).length,
      escalated: complaints.filter((c: any) => c.status === ComplaintStatus.ESCALATED).length,
      overdue: complaints.filter((c: any) => c.sla === 'Overdue').length
    });
    setRecent(complaints.slice(0, 5));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.fullName}</h1>
          <p className="text-gray-600 mt-1">Department: <span className="font-semibold text-blue-600">Sanitation & Health</span></p>
        </div>
        <button onClick={() => navigate('/admin/complaints')} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md">View All Issues</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusSummary title="New Grievances" count={stats.new} icon={<Plus size={20} />} color="blue" />
        <StatusSummary title="In Progress" count={stats.progress} icon={<ListTodo size={20} />} color="indigo" />
        <StatusSummary title="Escalated" count={stats.escalated} icon={<Map size={20} />} color="red" />
        <StatusSummary title="Overdue (SLA)" count={stats.overdue} icon={<Users size={20} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Recently Lodged</h3>
              <button onClick={() => navigate('/admin/complaints')} className="text-sm text-blue-600 font-semibold">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {recent.length === 0 ? <p className="p-10 text-center text-gray-400">No complaints logged yet.</p> : recent.map((c) => (
                <div key={c.id} onClick={() => navigate('/admin/complaints')} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">#S</div>
                    <div>
                      {/* Fixed: Use complaintNumber instead of id for display */}
                      <h4 className="font-semibold text-gray-900 text-sm">{c.complaintNumber}</h4>
                      {/* Fixed: Use categoryName and submittedAt for consistency */}
                      <p className="text-xs text-gray-500">{c.categoryName} - {new Date(c.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">{c.status.toUpperCase()}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center"><PieChart size={18} className="mr-2 text-blue-600" />Zone Performance</h3>
            <div className="space-y-4">
              <ZoneProgress name="Ward A - Vashi" percent={85} />
              <ZoneProgress name="Sector 9A" percent={62} />
              <ZoneProgress name="CBD Belapur" percent={48} />
              <ZoneProgress name="Nerul East" percent={91} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusSummary: React.FC<{ title: string; count: number; icon: React.ReactNode; color: string }> = ({ title, count, icon, color }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };
  return (
    <div className={`p-5 rounded-xl border shadow-sm flex items-center justify-between ${colorMap[color]}`}>
      <div><p className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</p><h4 className="text-2xl font-bold mt-1">{count}</h4></div>
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
    </div>
  );
};

const ZoneProgress: React.FC<{ name: string; percent: number }> = ({ name, percent }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs"><span className="font-medium text-gray-700">{name}</span><span className="font-bold text-gray-900">{percent}%</span></div>
    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
      <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
