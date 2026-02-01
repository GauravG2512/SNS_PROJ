
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Phone, MapPin, Lock, ChevronRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    
    try {
      // Calling the actual Spring Boot Backend
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        passwordHash: formData.password, // Backend will encode this
        address: formData.address
      });

      if (response.status === 200) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data || "Registration failed. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-green-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-500 mb-8">Verification complete. A welcome email has been dispatched to <strong>{formData.email}</strong> by our SMTP gateway.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            PROCEED TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="lg:col-span-2 bg-blue-600 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Shield className="text-blue-600" size={24} />
            </div>
            <h2 className="text-3xl font-black mb-6 tracking-tight">Join SNS Portal</h2>
            <p className="text-blue-100 mb-8 font-medium leading-relaxed">
              Create an account to report civic issues in your neighborhood and receive real-time updates via our automated email system.
            </p>
            <ul className="space-y-4">
              <FeatureItem text="Lodge complaints with geo-tagging" />
              <FeatureItem text="Real-time SMTP notifications" />
              <FeatureItem text="Automated department routing" />
            </ul>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="lg:col-span-3 p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900">Citizen Registration</h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">SMTP Verification Enabled</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField 
                icon={<User size={18} />} label="Full Name" placeholder="John Doe" 
                value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})}
              />
              <InputField 
                icon={<Mail size={18} />} label="Email Identity" placeholder="john@gmail.com" type="email" 
                value={formData.email} onChange={v => setFormData({...formData, email: v})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField 
                icon={<Phone size={18} />} label="Phone Number" placeholder="+91..." 
                value={formData.phone} onChange={v => setFormData({...formData, phone: v})}
              />
              <InputField 
                icon={<MapPin size={18} />} label="Residential Address" placeholder="Street, Colony, Zone" 
                value={formData.address} onChange={v => setFormData({...formData, address: v})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField 
                icon={<Lock size={18} />} label="Access Pin" type="password" placeholder="••••••••" 
                value={formData.password} onChange={v => setFormData({...formData, password: v})}
              />
              <InputField 
                icon={<Lock size={18} />} label="Confirm Pin" type="password" placeholder="••••••••" 
                value={formData.confirmPassword} onChange={v => setFormData({...formData, confirmPassword: v})}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>DISPATCHING...</span>
                  </div>
                ) : (
                  <>
                    <span>REGISTER & VERIFY EMAIL</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 font-medium">
              Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-center space-x-3 text-sm text-blue-50 font-bold">
    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full"></div>
    </div>
    <span>{text}</span>
  </li>
);

const InputField: React.FC<{ icon: React.ReactNode; label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string }> = ({ icon, label, placeholder, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input
        required
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default Register;