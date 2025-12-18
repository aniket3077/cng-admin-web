import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Subscribers from './pages/Subscribers';
import SubscriptionManagement from './pages/SubscriptionManagement';
import RevenueReport from './pages/RevenueReport';
import CNGAvailability from './pages/CNGAvailability';
import Profile from './pages/Profile';
import StationOwners from './pages/StationOwners';
import SupportTickets from './pages/SupportTickets';
import AddStation from './pages/AddStation';
import EditStation from './pages/EditStation';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddStation />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditStation />
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
          path="/support"
          element={
            <PrivateRoute>
              <SupportTickets />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscribers"
          element={
            <PrivateRoute>
              <Subscribers />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <PrivateRoute>
              <SubscriptionManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/revenue"
          element={
            <PrivateRoute>
              <RevenueReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/cng-availability"
          element={
            <PrivateRoute>
              <CNGAvailability />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
