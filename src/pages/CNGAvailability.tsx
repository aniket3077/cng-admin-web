import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function CNGAvailability() {
  const navigate = useNavigate();
  const [subscriberData, setSubscriberData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('subscriberData');
    navigate('/login');
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'subscriber') {
      navigate('/dashboard');
      return;
    }

    const data = localStorage.getItem('subscriberData');
    if (data) {
      setSubscriberData(JSON.parse(data));
    }
    setLoading(false);
  }, [navigate]);

  async function updateCNG(stationId: string, cngAvailable: number) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscriber/cng`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stationId, cngAvailable }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update CNG availability');
      }

      await response.json();
      
      // Update local storage
      const updatedData = { ...subscriberData };
      const stationIndex = updatedData.stations.findIndex((s: any) => s.id === stationId);
      if (stationIndex !== -1) {
        updatedData.stations[stationIndex].cngAvailable = cngAvailable;
        updatedData.stations[stationIndex].cngUpdatedAt = new Date().toISOString();
        setSubscriberData(updatedData);
        localStorage.setItem('subscriberData', JSON.stringify(updatedData));
      }

      alert('CNG availability updated successfully!');
    } catch (error: any) {
      console.error('Update CNG error:', error);
      alert(error.message || 'Failed to update CNG availability');
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">CNG Availability Management</h1>
              <p className="text-gray-600">Update daily CNG stock levels for your stations</p>
            </div>

            {/* Account Banner */}
            {subscriberData && (
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-6 mb-6 text-white">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sky-100 text-sm mb-1">Company</p>
                    <p className="text-2xl font-bold">{subscriberData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sky-100 text-sm mb-1">Contact Person</p>
                    <p className="text-2xl font-bold">{subscriberData.name}</p>
                  </div>
                  <div>
                    <p className="text-sky-100 text-sm mb-1">Total Stations</p>
                    <p className="text-2xl font-bold">{subscriberData.stations?.length || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stations List */}
            <div className="bg-white rounded-xl p-8 border border-sky-100 shadow-sm">
              {subscriberData?.stations && subscriberData.stations.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stations</h2>
                  {subscriberData.stations.map((station: any) => (
                    <div key={station.id} className="bg-gradient-to-r from-gray-50 to-sky-50 rounded-lg p-6 border-2 border-sky-200 hover:border-sky-400 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{station.name}</h3>
                              <p className="text-sm text-gray-600">{station.city}, {station.state}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Current Stock</div>
                          <div className="text-4xl font-black text-green-600">
                            {station.cngAvailable || 0}
                          </div>
                          <div className="text-sm text-gray-600">kg</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-center">
                        <label className="text-sm font-medium text-gray-700">Update Stock:</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const input = document.getElementById(`cng-${station.id}`) as HTMLInputElement;
                              input.value = '1000';
                            }}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Full (1000kg)
                          </button>
                          <button
                            onClick={() => {
                              const input = document.getElementById(`cng-${station.id}`) as HTMLInputElement;
                              input.value = '500';
                            }}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Half (500kg)
                          </button>
                          <button
                            onClick={() => {
                              const input = document.getElementById(`cng-${station.id}`) as HTMLInputElement;
                              input.value = '100';
                            }}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Low (100kg)
                          </button>
                          <button
                            onClick={() => {
                              const input = document.getElementById(`cng-${station.id}`) as HTMLInputElement;
                              input.value = '0';
                            }}
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            Empty (0kg)
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center mt-3">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Or enter custom amount (kg)"
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-lg font-semibold"
                          id={`cng-${station.id}`}
                          defaultValue={station.cngAvailable || ''}
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`cng-${station.id}`) as HTMLInputElement;
                            const value = input.value;
                            if (!value || parseFloat(value) < 0) {
                              alert('Please enter a valid CNG amount');
                              return;
                            }
                            updateCNG(station.id, parseFloat(value));
                          }}
                          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors shadow-lg hover:shadow-xl"
                        >
                          Update Stock
                        </button>
                      </div>
                      
                      {station.cngUpdatedAt && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Last updated: {new Date(station.cngUpdatedAt).toLocaleString('en-IN', { 
                              dateStyle: 'medium', 
                              timeStyle: 'short' 
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stations Yet</h3>
                  <p className="text-gray-600 mb-1">Your account is active and verified!</p>
                  <p className="text-sm text-gray-500">Contact admin to add your CNG stations to the platform.</p>
                </div>
              )}
            </div>

            {/* Instructions Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Daily Update Instructions
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Update your CNG availability daily to help users find stations with stock</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Enter the current available CNG in kilograms (kg)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Click "Update Stock" to save the changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Your customers will see the updated availability in real-time</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
