import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader, Zap } from 'lucide-react';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://cng-backend.vercel.app/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isAdmin ? '/admin/login' : '/auth/subscriber/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Store token based on user type
      if (isAdmin) {
        localStorage.setItem('adminToken', data.token);
        navigate('/dashboard');
      } else {
        localStorage.setItem('ownerToken', data.token);
        navigate('/owner-dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-200/40 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to manage your CNG stations</p>
        </div>

        <div className="glass-card p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Toggle User Type */}
          <div className="bg-slate-900/50 p-1 rounded-xl flex mb-8">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isAdmin
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Station Owner
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isAdmin
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-600">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 bg-slate-50 text-primary-500 focus:ring-primary-500 focus:ring-offset-0" />
                <span className="text-slate-500">Remember me</span>
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-lime-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-white font-medium hover:text-primary-400 transition-colors"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
