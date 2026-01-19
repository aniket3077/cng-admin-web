import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, MapPin, Navigation, Edit2, Save, X, CheckCircle, BatteryCharging, TrendingUp, AlertCircle, Info, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.cngbharat.com/api';

export default function Profile() {
  const navigate = useNavigate();
  const [subscriberData, setSubscriberData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
  });
  const [geocoding, setGeocoding] = useState(false);
  const [cngQuantity, setCngQuantity] = useState<{ [key: string]: number }>({});
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');
  const [updatingCng, setUpdatingCng] = useState<string | null>(null);

  // Convert DMS (Degrees Minutes Seconds) to Decimal Degrees
  const parseDMS = (dmsString: string): { lat: number; lng: number } | null => {
    try {
      // Match patterns like: 19°51'10.6"N 75°18'57.7"E
      const regex = /(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/;
      const match = dmsString.match(regex);

      if (!match) return null;

      const [, latDeg, latMin, latSec, latDir, lngDeg, lngMin, lngSec, lngDir] = match;

      // Convert to decimal
      let lat = parseFloat(latDeg) + parseFloat(latMin) / 60 + parseFloat(latSec) / 3600;
      let lng = parseFloat(lngDeg) + parseFloat(lngMin) / 60 + parseFloat(lngSec) / 3600;

      // Apply direction
      if (latDir === 'S') lat = -lat;
      if (lngDir === 'W') lng = -lng;

      return { lat, lng };
    } catch (error) {
      console.error('DMS parsing error:', error);
      return null;
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/owner/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('ownerToken');
          localStorage.removeItem('ownerUser');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      const owner = data.owner;

      setSubscriberData(owner);
      localStorage.setItem('ownerUser', JSON.stringify(owner));

      setFormData({
        name: owner.name || '',
        email: owner.email || '',
        phone: owner.phone || '',
        companyName: owner.companyName || '',
        address: owner.address || '',
        city: owner.city || '',
        state: owner.state || '',
        lat: owner.stations?.[0]?.lat?.toString() || '',
        lng: owner.stations?.[0]?.lng?.toString() || '',
      });

      // Set CNG quantity for all stations
      const quantityMap: { [key: string]: number } = {};
      owner.stations?.forEach((station: any) => {
        quantityMap[station.id] = station.cngQuantityKg ?? 0;
      });
      setCngQuantity(quantityMap);

    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check token presence logic handled in PrivateRoute/OwnerRoute, but fetching profile validates it.
    fetchProfile();
  }, [navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Auto-detect and convert DMS format for lat/lng fields
    if ((name === 'lat' || name === 'lng') && value.includes('°')) {
      const parsed = parseDMS(value);
      if (parsed) {
        setFormData({
          ...formData,
          lat: parsed.lat.toFixed(6),
          lng: parsed.lng.toFixed(6),
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGetCoordinates = async () => {
    // First check if DMS coordinates are already in the fields
    if (formData.lat && formData.lat.includes('°')) {
      const parsed = parseDMS(`${formData.lat} ${formData.lng}`);
      if (parsed) {
        setFormData(prev => ({
          ...prev,
          lat: parsed.lat.toFixed(6),
          lng: parsed.lng.toFixed(6),
        }));
        alert('DMS coordinates converted to decimal format!');
        return;
      }
    }

    if (!formData.address || !formData.city || !formData.state) {
      alert('Please enter address, city, and state first');
      return;
    }

    setGeocoding(true);
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, India`;
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results[0]) {
        const location = data.results[0].geometry.location;
        setFormData(prev => ({
          ...prev,
          lat: location.lat.toFixed(6),
          lng: location.lng.toFixed(6),
        }));
        alert('Coordinates fetched successfully!');
      } else {
        alert('Could not find coordinates for this address. Try pasting DMS coordinates directly in the Latitude field below.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to get coordinates. You can paste DMS coordinates directly in the Latitude field.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('ownerToken');

      // Prepare data with coordinates as numbers
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        companyName: formData.companyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        lat: formData.lat ? parseFloat(formData.lat) : undefined,
        lng: formData.lng ? parseFloat(formData.lng) : undefined,
      };

      const response = await fetch(`${API_URL}/owner/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      // Refresh profile data
      await fetchProfile();

      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Update profile error:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleQuantityUpdate = async (stationId: string, quantity: number) => {
    setUpdatingCng(stationId);
    try {
      const token = localStorage.getItem('ownerToken');

      const response = await fetch(`${API_URL}/owner/cng-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stationId,
          cngQuantityKg: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update CNG quantity');
      }

      // Update local state
      const newAvailable = quantity > 0;
      setCngQuantity(prev => ({
        ...prev,
        [stationId]: quantity,
      }));

      // Update subscriberData
      setSubscriberData((prev: any) => ({
        ...prev,
        stations: prev.stations.map((s: any) =>
          s.id === stationId
            ? { ...s, cngAvailable: newAvailable, cngQuantityKg: quantity, cngUpdatedAt: new Date().toISOString() }
            : s
        ),
      }));

      setEditingQuantity(null);
      setTempQuantity('');

    } catch (error) {
      console.error('CNG quantity update error:', error);
      alert('Failed to update CNG quantity');
    } finally {
      setUpdatingCng(null);
    }
  };

  const formatLastUpdated = (dateString: string | null) => {
    if (!dateString) return 'Never updated';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and station information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card - Takes 2 columns */}
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl border border-white/60 shadow-xl space-y-8">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary-500/30">
                {subscriberData?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{subscriberData?.name}</h2>
                <div className="flex items-center gap-2 text-slate-500 justify-center sm:justify-start">
                  <Mail className="w-4 h-4" />
                  <span>{subscriberData?.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${editing
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                }`}
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : editing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-slate-600">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm text-slate-600">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm text-slate-600">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200 my-6"></div>

            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Station Location
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm text-slate-600">Address</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm text-slate-600">City</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm text-slate-600">State</label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="lat" className="text-sm text-slate-600">Latitude</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="lat"
                      type="text"
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="19.8534"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="lng" className="text-sm text-slate-600">Longitude</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="lng"
                      type="text"
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="75.3142"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-300 font-medium mb-1">Coordinates Helper</p>
                      <p className="text-xs text-blue-200/70">
                        You can paste coordinates from Google Maps directly. We support both decimal and DMS formats.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetCoordinates}
                    disabled={geocoding}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-sm transition-colors border border-blue-500/30 disabled:opacity-50"
                  >
                    {geocoding ? 'Fetching...' : '📍 Auto-fill from Address'}
                  </button>
                </div>
              )}
            </div>

            {editing && (
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-green-500/25 transition-all text-sm"
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    // Reset form logic... (simplified here by re-fetching or just toggling off, in real app better to reset state)
                    fetchProfile();
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Account Status</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${subscriberData?.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <span className="text-lg font-semibold text-slate-800 capitalize">{subscriberData?.status || 'N/A'}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">KYC Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${subscriberData?.kycStatus === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span className="text-lg font-semibold text-slate-800 capitalize">{subscriberData?.kycStatus || 'N/A'}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Total Stations</p>
                <span className="text-lg font-semibold text-slate-800">{subscriberData?.stations?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">

          {/* CNG Availability */}
          <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <BatteryCharging className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">CNG Stock</h3>
                <p className="text-xs text-slate-500">Update daily availability</p>
              </div>
            </div>

            {subscriberData?.stations?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-3">No stations found</p>
                <button
                  onClick={() => navigate('/owner/add-station')}
                  className="bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2 rounded-lg text-sm transition-all border border-primary-100"
                >
                  + Add Station
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriberData?.stations?.map((station: any) => (
                  <div key={station.id} className={`p-4 rounded-xl border transition-all ${cngQuantity[station.id] > 0
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="overflow-hidden">
                        <p className="font-medium text-slate-800 truncate">{station.name}</p>
                        <p className="text-xs text-slate-500">{station.city}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${cngQuantity[station.id] > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    </div>

                    {editingQuantity === station.id ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={tempQuantity}
                            onChange={(e) => setTempQuantity(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg py-1.5 px-3 text-sm font-bold text-center outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            autoFocus
                            aria-label="New CNG Quantity"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">kg</span>
                        </div>
                        <button
                          onClick={() => handleQuantityUpdate(station.id, parseFloat(tempQuantity) || 0)}
                          disabled={updatingCng === station.id}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
                          aria-label="Confirm Quantity Update"
                        >
                          {updatingCng === station.id ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingQuantity(null)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-600 p-2 rounded-lg transition-colors"
                          aria-label="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingQuantity(station.id);
                          setTempQuantity((cngQuantity[station.id] || 0).toString());
                        }}
                        className="w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg p-2.5 flex items-center justify-between transition-all group"
                      >
                        <span className="text-xl font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
                          {cngQuantity[station.id] || 0}
                          <span className="text-xs font-normal text-slate-500 ml-1">kg</span>
                        </span>
                        <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                      </button>
                    )}

                    {editingQuantity !== station.id && (
                      <div className="flex gap-1 mt-3">
                        {[0, 100, 500].map(qty => (
                          <button
                            key={qty}
                            onClick={() => handleQuantityUpdate(station.id, qty)}
                            disabled={updatingCng === station.id}
                            className={`flex-1 py-1 rounded text-[10px] font-medium transition-colors border ${qty === 0
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                              }`}
                          >
                            {qty === 0 ? 'Empty' : `${qty}kg`}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Updated {formatLastUpdated(station.cngUpdatedAt)}</span>
                      {cngQuantity[station.id] === 0 && (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Quick Stats</h3>
                <p className="text-xs text-slate-500">Overview of your network</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm text-slate-500">Total Stations</span>
                <span className="font-bold text-slate-800">{subscriberData?.stations?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-sm text-emerald-600">Active Stock</span>
                <span className="font-bold text-emerald-600">
                  {Object.values(cngQuantity).reduce((a: number, b: number) => a + b, 0)} kg
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="text-sm text-red-600">Out of Stock</span>
                <span className="font-bold text-red-600">
                  {Object.values(cngQuantity).filter((q: number) => q === 0).length}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
