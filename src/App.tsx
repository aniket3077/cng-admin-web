import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddStation from './pages/AddStation';
import EditStation from './pages/EditStation';
import StationOwners from './pages/StationOwners';
import SupportTickets from './pages/SupportTickets';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
