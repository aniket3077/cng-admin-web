import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

// Convert DMS (Degrees Minutes Seconds) to Decimal Degrees
function dmsToDecimal(dmsString: string): { lat: number; lng: number } | null {
  // Pattern to match formats like: 19°51'00.2"N 75°19'51.5"E
  const pattern = /(\d+)[°](\d+)['](\d+\.?\d*)["]?\s*([NS])\s*(\d+)[°](\d+)['](\d+\.?\d*)["]?\s*([EW])/i;
  const match = dmsString.match(pattern);
  
  if (!match) {
    // Try simpler format: 19.850056, 75.330972 (already decimal)
    const decimalPattern = /(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/;
    const decimalMatch = dmsString.match(decimalPattern);
    if (decimalMatch) {
      return {
        lat: parseFloat(decimalMatch[1]),
        lng: parseFloat(decimalMatch[2]),
      };
    }
    return null;
  }
  
  const latDeg = parseInt(match[1]);
  const latMin = parseInt(match[2]);
  const latSec = parseFloat(match[3]);
  const latDir = match[4].toUpperCase();
  
  const lngDeg = parseInt(match[5]);
  const lngMin = parseInt(match[6]);
  const lngSec = parseFloat(match[7]);
  const lngDir = match[8].toUpperCase();
  
  let lat = latDeg + latMin / 60 + latSec / 3600;
  let lng = lngDeg + lngMin / 60 + lngSec / 3600;
  
  if (latDir === 'S') lat = -lat;
  if (lngDir === 'W') lng = -lng;
  
  return { lat, lng };
}

export default function AddStation() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    coordinates: '',
    lat: '',
    lng: '',
    fuelTypes: ['CNG'],
    openingHours: '24/7',
    amenities: [] as string[],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const amenityOptions = [
    'Restroom',
    'Air/Water',
    'Food Court',
    'ATM',
    'Parking',
    'EV Charging',
    'Car Wash',
    'Convenience Store',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-convert DMS coordinates
    if (name === 'coordinates' && value) {
      const converted = dmsToDecimal(value);
      if (converted) {
        setFormData(prev => ({
          ...prev,
          coordinates: value,
          lat: converted.lat.toFixed(6),
          lng: converted.lng.toFixed(6),
        }));
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.address || !formData.city || !formData.state) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/owner/stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          phone: formData.phone,
          lat: formData.lat ? parseFloat(formData.lat) : null,
          lng: formData.lng ? parseFloat(formData.lng) : null,
          fuelTypes: formData.fuelTypes,
          openingHours: formData.openingHours,
          amenities: formData.amenities,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add station');
      }

      setSuccess('Station added successfully! It will be reviewed by admin.');
      
      // Update owner data in localStorage with new station
      const ownerData = localStorage.getItem('ownerUser');
      if (ownerData) {
        const owner = JSON.parse(ownerData);
        owner.stations = [...(owner.stations || []), data.station];
        localStorage.setItem('ownerUser', JSON.stringify(owner));
      }

      setTimeout(() => navigate('/owner/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to add station. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link to="/owner/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">CNG Bharat</span>
              </Link>
            </div>
            <Link
              to="/owner/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Station</h1>
          <p className="text-gray-600 mb-6">Fill in the details to register your CNG station.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Station Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Station Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter station name"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter full address"
                required
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="State"
                  required
                />
              </div>
            </div>

            {/* Postal Code & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="PIN Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Station Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Station contact number"
                />
              </div>
            </div>

            {/* Coordinates - DMS or Decimal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPS Coordinates
              </label>
              <input
                type="text"
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder={`e.g., 19°51'00.2"N 75°19'51.5"E or 19.850056, 75.330972`}
              />
              <p className="mt-1 text-xs text-gray-500">
                Paste from Google Maps (DMS or decimal format)
              </p>
            </div>

            {/* Converted Coordinates Display */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (Decimal)
                </label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                  placeholder="Auto-filled"
                  readOnly={!!formData.coordinates}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (Decimal)
                </label>
                <input
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                  placeholder="Auto-filled"
                  readOnly={!!formData.coordinates}
                />
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Hours
              </label>
              <select
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="24/7">24/7 (Open all day)</option>
                <option value="6AM-10PM">6 AM - 10 PM</option>
                <option value="6AM-12AM">6 AM - 12 AM</option>
                <option value="8AM-8PM">8 AM - 8 PM</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenityOptions.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.amenities.includes(amenity)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Link
                to="/owner/dashboard"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Station...' : 'Add Station'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
