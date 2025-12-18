import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function Profile() {
  const navigate = useNavigate();
  const [subscriberData, setSubscriberData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'subscriber') {
      navigate('/dashboard');
      return;
    }

    const data = localStorage.getItem('subscriberData');
    if (data) {
      const parsed = JSON.parse(data);
      setSubscriberData(parsed);
      setFormData({
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        companyName: parsed.companyName || '',
        address: parsed.address || '',
        city: parsed.city || '',
        state: parsed.state || '',
        lat: parsed.stations?.[0]?.lat?.toString() || '',
        lng: parsed.stations?.[0]?.lng?.toString() || '',
      });
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('subscriberData');
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
          lat: parsed.lat.toString(),
          lng: parsed.lng.toString(),
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
          lat: parsed.lat.toString(),
          lng: parsed.lng.toString(),
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
          lat: location.lat.toString(),
          lng: location.lng.toString(),
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
    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare data with coordinates as numbers
      const updateData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : undefined,
        lng: formData.lng ? parseFloat(formData.lng) : undefined,
      };
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const baseUrl = apiUrl.replace(/\/api$/, ''); // Remove /api suffix if present
      const response = await fetch(`${baseUrl}/api/subscriber/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      await response.json();
      
      // Fetch updated profile data from backend
      const profileResponse = await fetch(`${baseUrl}/api/subscriber/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const updatedData = profileData.owner;
        localStorage.setItem('subscriberData', JSON.stringify(updatedData));
        setSubscriberData(updatedData);
        
        // Update form with latest station coordinates if available
        setFormData(prev => ({
          ...prev,
          lat: updatedData.stations?.[0]?.lat?.toString() || prev.lat,
          lng: updatedData.stations?.[0]?.lng?.toString() || prev.lng,
        }));
      }
      
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Failed to update profile');
    }
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
              <p className="text-gray-600">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl p-8 border border-sky-100 shadow-sm max-w-3xl">
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
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors"
                >
                  {editing ? 'Save Changes' : 'Edit Profile'}
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
                      onChange={handleChange}
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
                          placeholder="28.6139 or 28°36'50.0&quot;N"
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
                          placeholder="77.2090 or 77°12'32.4&quot;E"
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
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Save Changes
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
                    <p className="text-sm text-gray-600 mb-1">Stations</p>
                    <p className="text-lg font-semibold text-gray-900">{subscriberData?.stations?.length || 0}</p>
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
