import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import StationOwners from './pages/StationOwners';
import Stations from './pages/Stations';
import AdminSubscriptions from './pages/AdminSubscriptions';
import OwnerDashboard from './pages/OwnerDashboard';
import AddStation from './pages/AddStation';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function OwnerRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('ownerToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/owners"
          element={
            <PrivateRoute>
              <StationOwners />
            </PrivateRoute>
          }
        />
        <Route
          path="/stations"
          element={
            <PrivateRoute>
              <Stations />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <PrivateRoute>
              <AdminSubscriptions />
            </PrivateRoute>
          }
        />
        {/* Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <OwnerRoute>
              <Profile />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/add-station"
          element={
            <OwnerRoute>
              <AddStation />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/subscription"
          element={
            <OwnerRoute>
              <Subscription />
            </OwnerRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
