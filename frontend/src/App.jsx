import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Devices from './pages/Devices';
import DeviceDashboard from './pages/DeviceDashboard';
import Alerts from './pages/Alerts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/:id" element={<DeviceDashboard />} />
            <Route path="/alerts" element={<Alerts />} />
          </Route>

          <Route path="*" element={<Navigate to="/devices" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
