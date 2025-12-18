import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { adminApi } from '../services/api';

export default function AddStation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    lat: '',
    lng: '',
    fuelTypes: [] as string[],
    phone: '',
    openingHours: '24/7',
    amenities: [] as string[],
    isPartner: false,
    subscriptionType: 'free' as 'free' | 'basic' | 'premium',
  });

  const fuelTypeOptions = ['Petrol', 'Diesel', 'CNG', 'EV Charging'];
  const amenityOptions = ['Restroom', 'ATM', 'Air', 'Food Court', 'Car Wash', 'Convenience Store'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFuelTypeToggle = (fuelType: string) => {
    setFormData(prev => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter(f => f !== fuelType)
        : [...prev.fuelTypes, fuelType]
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleGeocode = async () => {
    if (!formData.address || !formData.city || !formData.state) {
      alert('Please enter address, city, and state first');
      return;
    }
    
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, India`;
      const result = await adminApi.geocode(fullAddress);
      
      if (result.results && result.results.length > 0) {
        const location = result.results[0].geometry.location;
        setFormData(prev => ({
          ...prev,
          lat: location.lat.toString(),
          lng: location.lng.toString()
        }));
      } else {
        alert('Could not find coordinates for this address');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to get coordinates. Please enter manually.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city || !formData.state) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.fuelTypes.length === 0) {
      alert('Please select at least one fuel type');
      return;
    }

    if (!formData.lat || !formData.lng) {
      alert('Please enter or geocode the coordinates');
      return;
    }

    try {
      setLoading(true);
      
      await adminApi.createStation({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode || undefined,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        fuelTypes: formData.fuelTypes.join(','),
        phone: formData.phone || undefined,
        openingHours: formData.openingHours || undefined,
        amenities: formData.amenities.length > 0 ? formData.amenities.join(',') : undefined,
        isPartner: formData.isPartner,
        subscriptionType: formData.subscriptionType,
      });

      alert('Station added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding station:', error);
      alert('Failed to add station. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col ml-64">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Go back to dashboard"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Add New Station</h1>
            </div>
            <p className="text-gray-600 ml-12">Add a new CNG/Fuel station to the network</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {/* Basic Info */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Station Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., HP Petrol Pump"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Contact number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Coordinates</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lat"
                      value={formData.lat}
                      onChange={handleInputChange}
                      placeholder="e.g., 28.6139"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lng"
                      value={formData.lng}
                      onChange={handleInputChange}
                      placeholder="e.g., 77.2090"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleGeocode}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Get from Address
                    </button>
                  </div>
                </div>
              </div>

              {/* Fuel Types */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Fuel Types <span className="text-red-500">*</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {fuelTypeOptions.map(fuel => (
                    <button
                      key={fuel}
                      type="button"
                      onClick={() => handleFuelTypeToggle(fuel)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        formData.fuelTypes.includes(fuel)
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-sky-500'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {amenityOptions.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
                    <select
                      id="openingHours"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="24/7">24/7</option>
                      <option value="6AM-10PM">6 AM - 10 PM</option>
                      <option value="6AM-12AM">6 AM - 12 AM</option>
                      <option value="8AM-8PM">8 AM - 8 PM</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
                    <select
                      id="subscriptionType"
                      name="subscriptionType"
                      value={formData.subscriptionType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPartner"
                      checked={formData.isPartner}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Partner Station (gets priority listing)
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Station
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
