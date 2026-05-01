import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader, Zap } from 'lucide-react';

import { API_BASE_URL } from '../services/api';

async function parseJsonSafe(response: Response): Promise<any | null> {
  const raw = await response.text();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'owner'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const path = role === 'admin' ? '/auth/admin/login' : '/auth/subscriber/login';
      const endpoints = Array.from(new Set([
        `${API_BASE_URL}${path}`,
        `/api${path}`,
      ]));

      let response: Response | null = null;
      let data: any = null;
      let lastNetworkError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          const currentResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const currentData = await parseJsonSafe(currentResponse);

          if (!currentResponse.ok) {
            // Try fallback endpoint only when upstream endpoint is unavailable.
            if (currentResponse.status >= 500 && endpoint !== endpoints[endpoints.length - 1]) {
              continue;
            }

            throw new Error(currentData?.error || currentData?.message || `Login failed (${currentResponse.status})`);
          }

          response = currentResponse;
          data = currentData;
          break;
        } catch (err) {
          if (err instanceof TypeError) {
            lastNetworkError = err;
            continue;
          }
          throw err;
        }
      }

      if (!response) {
        throw lastNetworkError || new Error('Failed to fetch');
      }

      if (!data) {
        throw new Error('Invalid login response from server');
      }

      if (role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        localStorage.removeItem('ownerToken');
        navigate('/dashboard');
      } else {
        localStorage.setItem('ownerToken', data.token);
        localStorage.setItem('ownerUser', JSON.stringify(data.owner));
        localStorage.removeItem('adminToken');
        navigate('/owner/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
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
          <div className="mb-6">
            <p className="text-sm text-slate-500 text-center mb-3">
              Select login type
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-gradient-to-r from-primary-500 to-lime-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  role === 'owner'
                    ? 'bg-gradient-to-r from-primary-500 to-lime-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Station Owner
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="loginEmail"
                  name="email"
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
                  id="loginPassword"
                  name="password"
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
                <input id="rememberMe" name="rememberMe" type="checkbox" className="w-4 h-4 rounded border-slate-300 bg-slate-50 text-primary-500 focus:ring-primary-500 focus:ring-offset-0" />
                <span className="text-slate-500">Remember me</span>
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Forgot password clicked');
                  navigate('/forgot-password');
                }}
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot password?
              </button>
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
