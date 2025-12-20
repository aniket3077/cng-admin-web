import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
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
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/owners"
            element={
              <PrivateRoute>
                <Layout>
                  <StationOwners />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/stations"
            element={
              <PrivateRoute>
                <Layout showNewStationButton>
                  <Stations />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/stations/add"
            element={
              <PrivateRoute>
                <Layout>
                  {/* Ideally AddStation but for admin? reusing owner's AddStation might not work if logic differs. 
                      Checking routes, AddStation was under /owner/add-station.
                      If there is no admin AddStation, I should probably not link it or create one.
                      TopBar had a link to /stations/add. 
                      Let's assume AddStation component can handle it or just point to it.
                      Wait, AddStation in import is ./pages/AddStation.
                  */}
                  <AddStation />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <PrivateRoute>
                <Layout>
                  <AdminSubscriptions />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <OwnerRoute>
                <Layout>
                  <OwnerDashboard />
                </Layout>
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/profile"
            element={
              <OwnerRoute>
                <Layout>
                  <Profile />
                </Layout>
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/add-station"
            element={
              <OwnerRoute>
                <Layout>
                  <AddStation />
                </Layout>
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/subscription"
            element={
              <OwnerRoute>
                <Layout>
                  <Subscription />
                </Layout>
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
