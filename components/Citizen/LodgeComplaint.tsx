
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ComplaintStatus, ComplaintPriority } from '../../types';
import { Camera, MapPin, Send, CheckCircle2, Search, Loader2, X, Crosshair, FilePlus, Trash2, Map as MapIcon, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icon in React
const initLeafletIcon = () => {
  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;
};

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

const LocationPicker = ({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const LodgeComplaint: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState<[number, number]>([19.0330, 73.0297]); // Default: Navi Mumbai
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeMethod, setActiveMethod] = useState<'map' | 'search' | 'gps'>('map');
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: ComplaintPriority.MEDIUM,
    image: null as File | null
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    initLeafletIcon();
  }, []);

  useEffect(() => {
    if (!formData.image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(formData.image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.image]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name || '');
    } catch (e) {
      console.error("Reverse geocoding error", e);
    } finally {
      setGeocoding(false);
    }
  }, []);

  // Handle address search recommendations
  useEffect(() => {
    if (searchQuery.length < 3 || activeMethod !== 'search') {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (e) {
        console.error("Search error", e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, activeMethod]);

  const handleGetCurrentLocation = () => {
    setActiveMethod('gps');
    if (navigator.geolocation) {
      setGeocoding(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(p);
          reverseGeocode(p[0], p[1]);
        },
        () => {
          setGeocoding(false);
          alert("Could not access your location. Please check browser permissions.");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const selectSuggestion = (s: Suggestion) => {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    setPosition([lat, lon]);
    setAddress(s.display_name);
    setSearchQuery(s.display_name);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Please select a location on the map.");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('sns_complaints') || '[]');
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const count = (existing.length + 1).toString().padStart(4, '0');
      const complaintNumber = `SNS-${dateStr}-${count}`;

      const newComplaint = {
        id: Date.now(),
        complaintNumber,
        title: formData.title,
        description: formData.description,
        latitude: position[0],
        longitude: position[1],
        status: ComplaintStatus.SUBMITTED,
        priority: formData.priority,
        submittedAt: new Date().toISOString(),
        citizenId: user.id,
        citizenName: user.fullName,
        categoryName: formData.category,
        address: address
      };

      localStorage.setItem('sns_complaints', JSON.stringify([newComplaint, ...existing]));
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/citizen/track'), 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center p-12 bg-white rounded-3xl shadow-2xl border border-green-50 animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Grievance Lodged Successfully</h2>
        <p className="text-gray-500 mb-6 text-lg">Our municipal routing engine has assigned your case to the local department.</p>
        <div className="bg-blue-50 p-4 rounded-2xl inline-block">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Your Tracking ID</p>
          <p className="text-blue-600 font-mono text-xl font-bold">SNS-{new Date().toISOString().split('T')[0].replace(/-/g, '')}-...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Lodge Grievance</h1>
        <p className="text-gray-500 font-medium text-lg mt-1">Provide specific location and incident details for faster resolution.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Location Module */}
        <div className="lg:w-3/5 w-full space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            {/* 3 Distinct Options Toggle */}
            <div className="p-4 bg-gray-50/80 border-b border-gray-100">
              <div className="grid grid-cols-3 gap-2 bg-gray-200/50 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveMethod('map')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeMethod === 'map' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <MapPin size={16} /> PIN ON MAP
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethod('search')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeMethod === 'search' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Search size={16} /> SEARCH ADDRESS
                </button>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeMethod === 'gps' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Navigation size={16} /> USE GPS
                </button>
              </div>
            </div>

            {/* Conditional Search Bar with Recommendations */}
            {activeMethod === 'search' && (
              <div className="p-4 bg-white border-b border-gray-100 relative z-[2000]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search colony, street, or landmark..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50 z-[3000]">
                    {suggestions.map((s) => (
                      <button
                        key={s.place_id}
                        type="button"
                        onClick={() => selectSuggestion(s)}
                        className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-start gap-3"
                      >
                        <MapPin size={16} className="text-blue-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{s.display_name.split(',')[0]}</p>
                          <p className="text-[10px] text-gray-500 font-medium line-clamp-1">{s.display_name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Map Area */}
            <div className="h-[520px] relative">
              <MapContainer 
                center={position} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker position={position} setPosition={(pos) => { 
                  setPosition(pos); 
                  reverseGeocode(pos[0], pos[1]);
                  setActiveMethod('map'); // Switch context back to map pin on manual click
                }} />
                <MapController center={position} />
              </MapContainer>
              
              {/* Overlay for Geocoding State */}
              {geocoding && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-[1001] flex items-center justify-center">
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border border-blue-100 flex items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" />
                    <span className="text-sm font-black text-blue-900 tracking-tight">Geo-Locating Incident...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Location Confirmation Footer */}
            <div className="p-6 bg-blue-50/80 border-t border-blue-100 flex items-center justify-between gap-4">
              <div className="flex-grow">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 block">Verified Incident Address</label>
                <p className="text-sm font-bold text-blue-900 line-clamp-2">
                  {geocoding ? "Identifying location..." : address || "Please select a point on the map"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-black text-gray-400 font-mono tracking-tighter">
                  LAT: {position[0].toFixed(5)}<br />
                  LNG: {position[1].toFixed(5)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Form Module */}
        <div className="lg:w-2/5 w-full">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10 space-y-8 h-full flex flex-col">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                <FilePlus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Issue Details</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Departmental Form</p>
              </div>
            </div>

            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Grievance Category</label>
                <select 
                  required 
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="Road Maintenance">Road Maintenance (Potholes, Damage)</option>
                  <option value="Garbage Collection">Garbage Collection / Sanitation</option>
                  <option value="Water Supply">Water Supply / Pipeline Leak</option>
                  <option value="Electricity Issues">Electricity / Street Lighting</option>
                  <option value="Traffic Violations">Traffic / Illegal Parking</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Priority</label>
                <div className="grid grid-cols-2 gap-2">
                  {[ComplaintPriority.LOW, ComplaintPriority.MEDIUM, ComplaintPriority.HIGH, ComplaintPriority.URGENT].map(p => (
                    <button 
                      key={p} 
                      type="button" 
                      onClick={() => setFormData({...formData, priority: p})} 
                      className={`py-3 text-[10px] font-black rounded-xl border-2 transition-all ${formData.priority === p ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complaint Title</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Pipeline burst at Sector 4" 
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                <textarea 
                  required 
                  rows={4} 
                  placeholder="Describe the magnitude and impact of the issue..." 
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold resize-none focus:ring-4 focus:ring-blue-100 outline-none" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Media Evidence (Required)</label>
                <div className="relative border-4 border-dashed border-gray-50 rounded-3xl p-6 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group flex flex-col items-center justify-center min-h-[160px] cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})} 
                  />
                  {previewUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <img src={previewUrl} className="max-h-32 w-full object-cover rounded-2xl shadow-lg" alt="Evidence Preview" />
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFormData({...formData, image: null}); }} 
                        className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera size={40} className="text-gray-300 mb-3 group-hover:text-blue-400 transition-colors" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Capture or Upload Photo</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || geocoding} 
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-2xl shadow-blue-100 transition-all disabled:bg-gray-200 flex items-center justify-center gap-3 mt-6 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={20} /> <span>SUBMIT TO AUTHORITIES</span></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LodgeComplaint;
