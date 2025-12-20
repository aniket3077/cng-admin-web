import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Navigation, Info, ArrowRight, Loader, Zap, CheckCircle } from 'lucide-react';

import { API_BASE_URL } from '../services/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    stationName: '',
    address: '',
    city: '',
    state: '',
    coordinates: '',
    lat: null as number | null,
    lng: null as number | null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Convert DMS (Degrees Minutes Seconds) to Decimal Degrees
  const parseDMS = (dmsString: string): { lat: number; lng: number } | null => {
    try {
      // Match patterns like: 19°51'00.2"N 75°19'51.5"E
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Auto-detect and convert DMS format for coordinates field
    if (name === 'coordinates' && value.includes('°')) {
      const parsed = parseDMS(value);
      if (parsed) {
        setFormData({
          ...formData,
          coordinates: value,
          lat: parsed.lat,
          lng: parsed.lng,
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/subscriber/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          stationName: formData.stationName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          lat: formData.lat,
          lng: formData.lng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details?.[0]?.message || 'Registration failed');
      }

      setSuccess('Registration successful! Your account has been created.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex py-10 px-4 relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-lime-200/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 animate-slide-up">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-6 transition-colors font-medium">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Login
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">Partner Registration</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Join the CNG Bharat network. Register your station and start managing your operations digitally.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-8 rounded-3xl">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-slate-700 ml-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Station Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Station Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="stationName" className="text-sm font-medium text-slate-700 ml-1">Station Name</label>
                      <input
                        id="stationName"
                        type="text"
                        name="stationName"
                        value={formData.stationName}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                        placeholder="Green Fuel Station - 01"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium text-slate-700 ml-1">Address</label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                        placeholder="Plot No. 123, Sector 4..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-sm font-medium text-slate-700 ml-1">City</label>
                        <input
                          id="city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="text-sm font-medium text-slate-700 ml-1">State</label>
                        <input
                          id="state"
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Coordinates Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-medium text-slate-700">Location Coordinates</label>
                        <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">Supports DMS</span>
                      </div>
                      <div className="relative">
                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="coordinates"
                          value={formData.coordinates}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 font-mono text-sm placeholder:text-slate-400"
                          placeholder="25.2345, 75.1234 OR 19°51'00.2&quot;N 75°19'51.5&quot;E"
                        />
                      </div>
                      {formData.lat && (
                        <p className="text-xs text-emerald-600 ml-1 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Parsed: {formData.lat.toFixed(6)}, {formData.lng?.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Security */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Security
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                      placeholder="Password"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-slate-400"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-300 flex items-center justify-center gap-2 group hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Side Panel (Desktop only) */}
          <div className="lg:col-span-2 space-y-6 hidden lg:block">
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Why Partner with Us?</h3>
              <ul className="space-y-4">
                {[
                  "Real-time inventory management",
                  "Automated daily reporting",
                  "Verified partner badge",
                  "Direct listing on CNG Bharat app",
                  "Priority support 24/7"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/60 shadow-xl bg-gradient-to-br from-primary-500 to-lime-500 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                <p className="text-primary-50 opacity-90 mb-4 text-sm">Our support team is available to assist you with the registration process.</p>
                <button className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg">Contact Support</button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
