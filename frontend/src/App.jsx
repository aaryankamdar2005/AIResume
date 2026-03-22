import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Layouts & Common
import Sidebar from './components/common/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AiResumeEditor from './pages/AiResumeEditor';
import ManualResumeEditor from './pages/ManualResumeEditor';
import Landing from './pages/Landing';
import Analyzer from './pages/Analyzer';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Initializing...</div>;
  }

  const isAuthRoute = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="min-h-screen flex bg-background-primary font-sans text-text-primary w-full overflow-hidden">
      {isAuthenticated && isAuthRoute && <Sidebar />}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analyzer" 
              element={
                <ProtectedRoute>
                  <Analyzer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editor/:id/manual" 
              element={
                <ProtectedRoute>
                  <ManualResumeEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editor/:id/ai" 
              element={
                <ProtectedRoute>
                  <AiResumeEditor />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Landing />} />
          </Routes>
        </main>
    </div>
  );
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
