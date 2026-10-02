import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import Complaints from './pages/Complaints';
import Visitors from './pages/Visitors';
import Bills from './pages/Bills';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/bills" element={<Bills />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}