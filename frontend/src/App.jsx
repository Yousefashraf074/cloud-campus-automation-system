import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import { getToken, getUserRole } from './utils/auth';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const role = getUserRole();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to={role ? '/dashboard' : '/login'} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div className="rounded-3xl bg-white p-12 text-center text-xl text-slate-700 shadow-sm">Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
