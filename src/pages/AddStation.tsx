import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function AddStation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geocoding, setGeocoding] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    latitude: '',
    longitude: '',
    fuelTypes: [] as string[],
    openingHours: '',
    amenities: '',
    subscriptionPlan: 'free',
  });

  const fuelOptions = ['Petrol', 'Diesel', 'CNG', 'LPG', 'EV'];

  const handleFuelToggle = (fuel: string) => {
    setFormData({
      ...formData,
      fuelTypes: formData.fuelTypes.includes(fuel)
        ? formData.fuelTypes.filter((f) => f !== fuel)
        : [...formData.fuelTypes, fuel],
    });
  };

  const handleGeocode = async () => {
    if (!formData.address) {
      alert('Please enter an address first');
      return;
    }

    setGeocoding(true);
    try {
      const data = await adminApi.geocode(formData.address);
      if (data.results && data.results[0]) {
        const result = data.results[0];
        const location = result.geometry.location;

        // Extract address components
        const components = result.address_components;
        let city = '';
        let state = '';
        let postalCode = '';

        components.forEach((comp: any) => {
          if (comp.types.includes('locality')) city = comp.long_name;
          if (comp.types.includes('administrative_area_level_1'))
            state = comp.short_name;
          if (comp.types.includes('postal_code')) postalCode = comp.long_name;
        });

        setFormData({
          ...formData,
          latitude: location.lat.toString(),
          longitude: location.lng.toString(),
          address: result.formatted_address,
          city: city || formData.city,
          state: state || formData.state,
          postalCode: postalCode || formData.postalCode,
        });
      } else {
        alert('Location not found');
      }
    } catch (error) {
      alert('Geocoding failed');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.fuelTypes.length === 0) {
      setError('Please select at least one fuel type');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError('Please set location coordinates');
      return;
    }

    setLoading(true);
    try {
      await adminApi.createStation({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        phone: formData.phone || undefined,
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude),
        fuelTypes: formData.fuelTypes.join(','),
        openingHours: formData.openingHours || undefined,
        amenities: formData.amenities || undefined,
        subscriptionType: formData.subscriptionPlan,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create station');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-3xl font-bold text-gray-900">Add New Station</h2>
            </div>
            <p className="text-gray-600">Add a new fuel station to the network.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Station Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={handleGeocode}
                  disabled={geocoding}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all font-medium"
                >
                  {geocoding ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {formData.latitude && formData.longitude && (
            <div className="text-sm text-gray-400">
              <a
                href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                View on Google Maps →
              </a>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fuel Types *
            </label>
            <div className="flex flex-wrap gap-2">
              {fuelOptions.map((fuel) => (
                <button
                  key={fuel}
                  type="button"
                  onClick={() => handleFuelToggle(fuel)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all font-medium ${
                    formData.fuelTypes.includes(fuel)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-900/50 text-gray-300 border-gray-700 hover:border-blue-400'
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Opening Hours
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              placeholder="e.g., Mon-Fri: 6AM-10PM, Sat-Sun: 24/7"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amenities
            </label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="e.g., Restrooms, ATM, Car Wash, Cafe"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Subscription Plan *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, subscriptionPlan: 'free' })}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  formData.subscriptionPlan === 'free'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                }`}
              >
                <div className="font-bold text-lg text-white">Free</div>
                <div className="text-sm text-gray-400 mt-1">Basic listing</div>
                <div className="font-bold mt-2 text-white">₹0</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, subscriptionPlan: 'basic' })}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  formData.subscriptionPlan === 'basic'
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                }`}
              >
                <div className="font-bold text-lg text-white">Basic</div>
                <div className="text-sm text-gray-400 mt-1">Enhanced visibility</div>
                <div className="font-bold mt-2 text-white">₹999/month</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, subscriptionPlan: 'premium' })}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  formData.subscriptionPlan === 'premium'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                }`}
              >
                <div className="font-bold text-lg text-white">Premium</div>
                <div className="text-sm text-gray-400 mt-1">Priority + Analytics</div>
                <div className="font-bold mt-2 text-white">₹9,999/year</div>
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all font-medium shadow-lg shadow-blue-500/25"
            >
              {loading ? 'Creating...' : 'Create Station'}
            </button>
          </div>
        </form>
      </main>
      </div>
    </div>
  );
}
