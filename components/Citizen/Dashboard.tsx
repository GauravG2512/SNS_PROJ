
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { FilePlus, MapPin, ListTodo, HelpCircle, Bell, ChevronRight } from 'lucide-react';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Namaste, {user.fullName}!</h1>
          <p className="text-gray-500 mt-2 text-lg">Your actions today contribute to a smarter, cleaner city.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/citizen/lodge" className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              <FilePlus size={20} />
              <span>Report New Issue</span>
            </Link>
            <Link to="/citizen/track" className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-50 rounded-2xl font-bold hover:bg-blue-50 hover:-translate-y-0.5 transition-all">
              <ListTodo size={20} />
              <span>Track Complaints</span>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent hidden lg:block"></div>
        <MapPin className="absolute right-12 top-12 text-blue-100" size={120} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <Link to="/citizen/track" className="text-sm font-bold text-blue-600 hover:underline">See history</Link>
          </div>

          <div className="space-y-4">
            <ActivityItem 
              title="Issue Resolved: SNS-2025-039" 
              desc="The garbage pileup has been cleared. Please provide your feedback." 
              time="2h ago" 
              type="success"
            />
            <ActivityItem 
              title="Complaint Assigned: SNS-2025-042" 
              desc="Assigned to Field Officer Sandeep for onsite inspection." 
              time="5h ago" 
              type="info"
            />
            <ActivityItem 
              title="Complaint Lodged: SNS-2025-042" 
              desc="Broken Streetlight issue recorded and routed to Lighting Dept." 
              time="1d ago" 
              type="pending"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Bell size={20} className="mr-2 text-blue-600" />
              Service Status
            </h3>
            <div className="space-y-4">
              <ServiceStatusItem name="Water Supply" status="Normal" />
              <ServiceStatusItem name="Electricity" status="Normal" />
              <ServiceStatusItem name="Sanitation" status="Delayed" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
            <HelpCircle className="text-blue-200 mb-4" size={32} />
            <h4 className="font-bold text-lg mb-2">Need Assistance?</h4>
            <p className="text-blue-100 text-sm mb-4 leading-relaxed">Contact our 24/7 helpdesk for emergency civic failures.</p>
            <button className="w-full py-2.5 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-md">Call 1913</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ title: string; desc: string; time: string; type: 'success' | 'info' | 'pending' }> = ({ title, desc, time, type }) => {
  const colors: any = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    pending: 'bg-amber-500'
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-all cursor-pointer">
      <div className={`w-2.5 h-2.5 mt-2 rounded-full ${colors[type]}`}></div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
          <span className="text-[10px] text-gray-400 font-bold uppercase">{time}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 mt-2" />
    </div>
  );
};

const ServiceStatusItem: React.FC<{ name: string; status: string }> = ({ name, status }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm font-medium text-gray-700">{name}</span>
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
      {status}
    </span>
  </div>
);

export default Dashboard;
