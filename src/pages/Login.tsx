import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'subscriber'>('admin');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'admin') {
        const response = await adminApi.login(email, password);
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('userType', 'admin');
        navigate('/dashboard');
      } else {
        // Subscriber login
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const baseUrl = apiUrl.replace(/\/api$/, ''); // Remove /api suffix if present
        const loginUrl = `${baseUrl}/api/auth/subscriber/login`;
        console.log('Subscriber login URL:', loginUrl);
        
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        const text = await response.text();
        console.log('Subscriber login response status:', response.status);
        console.log('Subscriber login response:', text);
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response:', e);
          throw new Error('Invalid response from server. Please check if backend is running.');
        }
        
        if (!response.ok) {
          throw new Error(data.error || `Login failed: ${response.status}`);
        }
        
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('userType', 'subscriber');
        localStorage.setItem('subscriberData', JSON.stringify(data.owner));
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/WhatsApp%20Image%202025-12-10%20at%2016.41.29_8d5288d7.jpg" 
            alt="CNG Bharat Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h1>
            <p className="text-sky-600">Enter your credentials to access your dashboard</p>
          </div>

          {/* Login Type Selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                loginType === 'admin'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType('subscriber')}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                loginType === 'subscriber'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Subscriber Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="#" className="text-xs text-sky-600 hover:text-sky-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white py-2.5 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors text-sm mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sky-600 hover:text-sky-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 mb-3">Test Credentials:</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-sky-50 rounded-lg p-2.5">
                  <p className="font-semibold text-gray-700 mb-1">Admin:</p>
                  <p className="text-sky-600 text-xs">admin@cngbharat.com</p>
                  <p className="text-sky-600 text-xs">Admin@123</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-2.5">
                  <p className="font-semibold text-gray-700 mb-1">Subscriber:</p>
                  <p className="text-emerald-600 text-xs">greengas@cngbharat.in</p>
                  <p className="text-emerald-600 text-xs">Owner@123</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
