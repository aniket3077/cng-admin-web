import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

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
  const [cngQuantity, setCngQuantity] = useState<{[key: string]: number}>({});
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>('');
  const [updatingCng, setUpdatingCng] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

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
      const quantityMap: {[key: string]: number} = {};
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
    const userType = localStorage.getItem('userType');
    if (userType !== 'subscriber' && userType !== 'owner') {
      navigate('/dashboard');
      return;
    }

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerUser');
    localStorage.removeItem('userType');
    navigate('/login');
  };

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
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your account and station information</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Card - Takes 2 columns */}
              <div className="lg:col-span-2 bg-white rounded-xl p-8 border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-sky-600">
                        {subscriberData?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{subscriberData?.name}</h2>
                      <p className="text-gray-600">{subscriberData?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    disabled={saving}
                    className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors disabled:bg-sky-300"
                  >
                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        disabled={!editing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Station Address Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Location</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="Enter station address"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter city"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter state"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude
                          </label>
                          <input
                            type="text"
                            name="lat"
                            value={formData.lat}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder={`28.6139 or 28°36'50.0"N`}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          />
                          <p className="text-xs text-gray-500 mt-1">Decimal or DMS format</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude
                          </label>
                          <input
                            type="text"
                            name="lng"
                            value={formData.lng}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder={`77.2090 or 77°12'32.4"E`}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                          />
                          <p className="text-xs text-gray-500 mt-1">Decimal or DMS format</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>💡 How to add coordinates:</strong>
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                          <li><strong>Option 1:</strong> Paste DMS format like <code className="bg-blue-100 px-1 rounded">19°51'12.3"N 75°18'51.2"E</code> directly in the <strong>Latitude field</strong> - it will auto-convert!</li>
                          <li><strong>Option 2:</strong> Click "Get Coordinates from Address" button to auto-fetch from Google Maps</li>
                          <li><strong>Option 3:</strong> Enter decimal format separately (e.g., 19.8534 and 75.3142)</li>
                        </ul>
                      </div>

                      {editing && (
                        <button
                          type="button"
                          onClick={handleGetCoordinates}
                          disabled={geocoding}
                          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                          {geocoding ? 'Getting Coordinates...' : '📍 Get Coordinates from Address'}
                        </button>
                      )}
                    </div>
                  </div>

                  {editing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-green-400"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: subscriberData?.name || '',
                            email: subscriberData?.email || '',
                            phone: subscriberData?.phone || '',
                            companyName: subscriberData?.companyName || '',
                            address: subscriberData?.address || '',
                            city: subscriberData?.city || '',
                            state: subscriberData?.state || '',
                            lat: subscriberData?.stations?.[0]?.lat?.toString() || '',
                            lng: subscriberData?.stations?.[0]?.lng?.toString() || '',
                          });
                        }}
                        className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Account Status */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Account Status</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{subscriberData?.status || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">KYC Status</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{subscriberData?.kycStatus || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Stations</p>
                      <p className="text-lg font-semibold text-gray-900">{subscriberData?.stations?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CNG Availability Card - Right column */}
              <div className="lg:col-span-1 space-y-6">
                {/* Daily CNG Update Card */}
                <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <span className="text-xl">⛽</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">CNG Availability (kg)</h3>
                      <p className="text-xs text-gray-500">Update daily stock</p>
                    </div>
                  </div>

                  {subscriberData?.stations?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-2">No stations found</p>
                      <button
                        onClick={() => navigate('/owner/add-station')}
                        className="text-sky-600 hover:text-sky-700 font-medium text-sm"
                      >
                        + Add your first station
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriberData?.stations?.map((station: any) => (
                        <div
                          key={station.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            cngQuantity[station.id] > 0
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium text-gray-900 truncate">{station.name}</p>
                              <p className="text-xs text-gray-500">{station.city}, {station.state}</p>
                            </div>
                          </div>
                          
                          {/* Quantity Display/Edit */}
                          <div className="mb-3">
                            {editingQuantity === station.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={tempQuantity}
                                  onChange={(e) => setTempQuantity(e.target.value)}
                                  className="w-20 px-2 py-1.5 rounded-lg border border-gray-300 text-center font-bold text-sm"
                                  placeholder="0"
                                  autoFocus
                                />
                                <span className="text-gray-600 text-sm">kg</span>
                                <button
                                  onClick={() => handleQuantityUpdate(station.id, parseFloat(tempQuantity) || 0)}
                                  disabled={updatingCng === station.id}
                                  className="px-2 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                  {updatingCng === station.id ? '...' : '✓'}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingQuantity(null);
                                    setTempQuantity('');
                                  }}
                                  className="px-2 py-1.5 bg-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-400 transition-colors"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingQuantity(station.id);
                                  setTempQuantity((cngQuantity[station.id] || 0).toString());
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors w-full"
                              >
                                <span className="text-2xl font-bold text-gray-900">{cngQuantity[station.id] || 0}</span>
                                <span className="text-sm text-gray-500">kg</span>
                                <span className="ml-auto text-gray-400 text-xs">Click to edit</span>
                              </button>
                            )}
                          </div>

                          {/* Quick quantity buttons */}
                          {editingQuantity !== station.id && (
                            <div className="flex gap-1.5 mb-3">
                              {[0, 50, 100, 200, 500].map((qty) => (
                                <button
                                  key={qty}
                                  onClick={() => handleQuantityUpdate(station.id, qty)}
                                  disabled={updatingCng === station.id}
                                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                                    cngQuantity[station.id] === qty
                                      ? 'bg-green-500 text-white'
                                      : qty === 0
                                      ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {qty === 0 ? 'Empty' : `${qty}`}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${
                              cngQuantity[station.id] > 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {cngQuantity[station.id] > 0 ? `✓ ${cngQuantity[station.id]} kg Available` : '✗ Out of Stock'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatLastUpdated(station.cngUpdatedAt)}
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-800">
                          <strong>💡 Tip:</strong> Update CNG stock (in kg) daily to help drivers find your station!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl p-6 border border-sky-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Total Stations</span>
                      <span className="font-semibold text-gray-900">{subscriberData?.stations?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700">Total CNG Stock</span>
                      <span className="font-semibold text-green-700">
                        {Object.values(cngQuantity).reduce((a: number, b: number) => a + b, 0)} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-700">Stations with Stock</span>
                      <span className="font-semibold text-orange-700">
                        {Object.values(cngQuantity).filter((q: number) => q > 0).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-red-700">Out of Stock</span>
                      <span className="font-semibold text-red-700">
                        {Object.values(cngQuantity).filter((q: number) => q === 0).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
