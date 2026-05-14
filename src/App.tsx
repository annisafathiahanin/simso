import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { RequestForm } from './pages/RequestForm';
import { Verification } from './pages/Verification';
import { Tasks } from './pages/Tasks';
import { Monitoring } from './pages/Monitoring';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen w-full flex items-center justify-center font-bold text-blue-600">Loading SIMSO...</div>;
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="input" element={<RequestForm />} />
        <Route path="verification" element={<Verification />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="monitoring" element={<Monitoring />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
