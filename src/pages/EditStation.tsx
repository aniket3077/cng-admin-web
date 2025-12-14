import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi, Station } from '../services/api';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function EditStation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [station, setStation] = useState<Station | null>(null);

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
  });

  const fuelOptions = ['Petrol', 'Diesel', 'CNG', 'LPG', 'EV'];

  useEffect(() => {
    loadStation();
  }, [id]);

  const loadStation = async () => {
    try {
      const data = await adminApi.getStations(1, '', undefined);
      const found = data.stations.find((s: Station) => s.id === id);
      if (found) {
        setStation(found);
        setFormData({
          name: found.name,
          address: found.address,
          city: found.city,
          state: found.state,
          postalCode: found.postalCode || '',
          phone: found.phone || '',
          latitude: found.lat.toString(),
          longitude: found.lng.toString(),
          fuelTypes: found.fuelTypes.split(','),
          openingHours: found.openingHours || '',
          amenities: found.amenities || '',
        });
      }
    } catch (error) {
      console.error('Failed to load station:', error);
    }
  };

  const handleFuelToggle = (fuel: string) => {
    setFormData({
      ...formData,
      fuelTypes: formData.fuelTypes.includes(fuel)
        ? formData.fuelTypes.filter((f) => f !== fuel)
        : [...formData.fuelTypes, fuel],
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.fuelTypes.length === 0) {
      setError('Please select at least one fuel type');
      return;
    }

    setLoading(true);
    try {
      await adminApi.updateStation(id!, {
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
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update station');
    } finally {
      setLoading(false);
    }
  };

  if (!station) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading station...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Station</h1>
                <p className="text-gray-600 mt-1">Update station details for {formData.name}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
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
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
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
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
      </div>
    </div>
  );
}
