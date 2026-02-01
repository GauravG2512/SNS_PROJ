
import React, { useState, useEffect } from 'react';
import { ComplaintStatus } from '../../types';
import { Search, Clock, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const ComplaintTracking: React.FC<{ user: any }> = ({ user }) => {
  const [filter, setFilter] = useState('all');
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    const allComplaints = JSON.parse(localStorage.getItem('sns_complaints') || '[]');
    // Filter by the logged in citizen's ID
    const myComplaints = allComplaints.filter((c: any) => c.citizenId === user.id);
    setComplaints(myComplaints);
  }, [user.id]);

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      // Fixed: Replaced non-existent PENDING with SUBMITTED (Line 19)
      case ComplaintStatus.SUBMITTED: return 'bg-amber-100 text-amber-700 border-amber-200';
      case ComplaintStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case ComplaintStatus.RESOLVED: return 'bg-green-100 text-green-700 border-green-200';
      case ComplaintStatus.CLOSED: return 'bg-gray-100 text-gray-700 border-gray-200';
      case ComplaintStatus.ESCALATED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filtered = complaints.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'active') return c.status !== ComplaintStatus.CLOSED && c.status !== ComplaintStatus.RESOLVED;
    if (filter === 'resolved') return c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Track Grievances</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of your reported issues.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          {['all', 'active', 'resolved'].map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === t ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400">No complaints found for your profile.</p>
          </div>
        ) : filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{c.complaintNumber}</span>
                    <span className="text-gray-300">|</span>
                    {/* Fixed: Use submittedAt instead of non-existent date property */}
                    <span className="text-sm text-gray-500 flex items-center"><Clock size={14} className="mr-1" /> {new Date(c.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{c.title}</h3>
                  {/* Fixed: Use categoryName instead of non-existent category property */}
                  <p className="text-sm text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded-md">{c.categoryName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(c.status)}`}>{c.status}</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">{c.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button className="text-sm text-blue-600 font-semibold flex items-center hover:underline"><ExternalLink size={14} className="mr-1" /> View Details</button>
                {c.status === ComplaintStatus.RESOLVED && (
                  <button className="text-sm text-green-600 font-semibold flex items-center bg-green-50 px-3 py-1 rounded-md">
                    <CheckCircle size={14} className="mr-1" /> Confirm Resolution
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintTracking;
