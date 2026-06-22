import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import { API_BASE_URL } from './services/api';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import StationOwners from './pages/StationOwners';
import Stations from './pages/Stations';
import AdminSubscriptions from './pages/AdminSubscriptions';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerStations from './pages/OwnerStations';
import AddStation from './pages/AddStation';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Support from './pages/Support';
import PayoutManagement from './pages/PayoutManagement';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

type AuthRole = 'admin' | 'owner' | null;

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-lg">
        Checking session…
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const [authRole, setAuthRole] = useState<AuthRole>(null);
  const [authStatus, setAuthStatus] = useState<'loading' | 'ready'>('loading');

  const protectedRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/owners') ||
    location.pathname.startsWith('/stations') ||
    location.pathname.startsWith('/subscriptions') ||
    location.pathname.startsWith('/users') ||
    location.pathname.startsWith('/support') ||
    location.pathname.startsWith('/payouts') ||
    location.pathname.startsWith('/owner/');

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (!protectedRoute) {
        setAuthRole(null);
        setAuthStatus('ready');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        if (!cancelled) {
          setAuthRole(null);
          setAuthStatus('ready');
        }
        return;
      }

      setAuthStatus('loading');

      try {
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers,
          credentials: 'include',
        });
        const data = await response.json().catch(() => null);

        if (!cancelled && response.ok && data?.valid) {
          setAuthRole(data.role ?? null);
        } else if (!cancelled) {
          setAuthRole(null);
        }
      } catch {
        if (!cancelled) {
          setAuthRole(null);
        }
      } finally {
        if (!cancelled) {
          setAuthStatus('ready');
        }
      }
    };

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, protectedRoute]);

  function PrivateRoute({ children }: { children: React.ReactNode }) {
    if (authStatus === 'loading') {
      return <LoadingScreen />;
    }

    // Timing Race Fix: If authToken is present but status hasn't transitioned to loading yet, show loading rather than redirecting
    if (authRole === null && localStorage.getItem('authToken')) {
      return <LoadingScreen />;
    }

    return authRole === 'admin' ? <>{children}</> : <Navigate to="/admin/login" replace />;
  }

  function OwnerRoute({ children }: { children: React.ReactNode }) {
    if (authStatus === 'loading') {
      return <LoadingScreen />;
    }

    // Timing Race Fix: If authToken is present but status hasn't transitioned to loading yet, show loading rather than redirecting
    if (authRole === null && localStorage.getItem('authToken')) {
      return <LoadingScreen />;
    }

    return authRole === 'owner' ? <>{children}</> : <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login mode="owner" />} />
      <Route path="/admin/login" element={<Login mode="admin" />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />

      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/owners" element={<PrivateRoute><Layout><StationOwners /></Layout></PrivateRoute>} />
      <Route path="/stations" element={<PrivateRoute><Layout showNewStationButton><Stations /></Layout></PrivateRoute>} />
      <Route path="/stations/add" element={<PrivateRoute><Layout><AddStation /></Layout></PrivateRoute>} />
      <Route path="/subscriptions" element={<PrivateRoute><Layout><AdminSubscriptions /></Layout></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><Layout><Support /></Layout></PrivateRoute>} />
      <Route path="/payouts" element={<PrivateRoute><Layout><PayoutManagement /></Layout></PrivateRoute>} />

      <Route path="/owner/dashboard" element={<OwnerRoute><Layout><OwnerDashboard /></Layout></OwnerRoute>} />
      <Route path="/owner/stations" element={<OwnerRoute><Layout><OwnerStations /></Layout></OwnerRoute>} />
      <Route path="/owner/profile" element={<OwnerRoute><Layout><Profile /></Layout></OwnerRoute>} />
      <Route path="/owner/add-station" element={<OwnerRoute><Layout><AddStation /></Layout></OwnerRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;