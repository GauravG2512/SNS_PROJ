
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Analytics: React.FC = () => {
  const data = [
    { name: 'Mon', complaints: 40, resolved: 24 },
    { name: 'Tue', complaints: 30, resolved: 13 },
    { name: 'Wed', complaints: 20, resolved: 38 },
    { name: 'Thu', complaints: 27, resolved: 39 },
    { name: 'Fri', complaints: 18, resolved: 48 },
    { name: 'Sat', complaints: 23, resolved: 38 },
    { name: 'Sun', complaints: 34, resolved: 43 },
  ];

  const categoryData = [
    { name: 'Water', value: 400 },
    { name: 'Roads', value: 300 },
    { name: 'Sanitation', value: 300 },
    { name: 'Electricity', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Strategic overview of grievance management and SLA compliance.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">Export Report</button>
          <select className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 outline-none">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Complaints" value="1,248" change="+12%" icon={<TrendingUp size={24} />} color="blue" />
        <StatCard title="Open Issues" value="156" change="-5%" icon={<AlertCircle size={24} />} color="amber" />
        <StatCard title="Total Resolved" value="1,092" change="+18%" icon={<CheckCircle size={24} />} color="green" />
        <StatCard title="Avg Resolution Time" value="38.5 hrs" change="-2 hrs" icon={<Clock size={24} />} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Complaint vs Resolution Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Category Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Department Performance</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; color: string }> = ({ title, value, change, icon, color }) => {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    green: 'text-green-600 bg-green-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline space-x-2">
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
          <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
