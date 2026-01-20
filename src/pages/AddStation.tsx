import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, PlusCircle, CheckCircle, Navigation, Info, Loader, Fuel, Coffee, Car, BatteryCharging, DollarSign } from 'lucide-react';

const API_URL = '/api';

// Convert DMS (Degrees Minutes Seconds) to Decimal Degrees
function dmsToDecimal(dmsString: string): { lat: number; lng: number } | null {
  const pattern = /(\d+)[°](\d+)['](\d+\.?\d*)["]?\s*([NS])\s*(\d+)[°](\d+)['](\d+\.?\d*)["]?\s*([EW])/i;
  const match = dmsString.match(pattern);

  if (!match) {
    // Try simpler format: 19.850056, 75.330972
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
    { id: 'Restroom', icon: Coffee },
    { id: 'Air/Water', icon: Fuel },
    { id: 'Food Court', icon: Coffee },
    { id: 'ATM', icon: DollarSign },
    { id: 'Parking', icon: Car },
    { id: 'EV Charging', icon: BatteryCharging },
    { id: 'Car Wash', icon: Car },
    { id: 'Convenience Store', icon: Coffee }
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Add New Station</h1>
        <p className="text-slate-500 mt-1">Register a new CNG station under your management.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-white/60 shadow-xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3">
            <Info className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Fuel className="w-4 h-4" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">Station Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. Green Fuel Station"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Station contact number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <MapPin className="w-4 h-4" /> Location Details
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">Address <span className="text-red-500">*</span></label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Street address, landmark..."
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">State <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  placeholder="State"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  placeholder="PIN Code"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 ml-1">GPS Coordinates</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 font-mono text-sm"
                    placeholder={`e.g., 19°51'00.2"N 75°19'51.5"E`}
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-400 block">Latitude</span>
                    <span className="text-sm text-slate-700 font-mono">{formData.lat || '-'}</span>
                  </div>
                  <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-400 block">Longitude</span>
                    <span className="text-sm text-slate-700 font-mono">{formData.lng || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operations */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Clock className="w-4 h-4" /> Operations & Amenities
            </h3>

            <div className="space-y-2">
              <label htmlFor="openingHours" className="text-sm font-medium text-slate-600 ml-1">Opening Hours</label>
              <select
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all cursor-pointer"
              >
                <option value="24/7">24/7 (Open all day)</option>
                <option value="6AM-10PM">6 AM - 10 PM</option>
                <option value="6AM-12AM">6 AM - 12 AM</option>
                <option value="8AM-8PM">8 AM - 8 PM</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-600 ml-1">Available Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {amenityOptions.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleAmenityToggle(id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${formData.amenities.includes(id)
                      ? 'bg-primary-50 text-primary-600 border-primary-200 shadow-lg shadow-primary-500/10'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/owner/dashboard')}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Adding Station...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Register Station</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
