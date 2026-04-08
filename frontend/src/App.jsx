import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoticeDetail from './pages/NoticeDetail';
import Bookmarks from './pages/Bookmarks';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CreateNotice from './pages/CreateNotice';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

function ProtectedRoute({ children, reqRole }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-full flex items-center justify-center text-primary">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (reqRole && !reqRole.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <Router>
      <Toaster theme="dark" position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/notice/:id" element={
            <ProtectedRoute>
              <NoticeDetail />
            </ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute reqRole={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute reqRole={['admin', 'cr']}>
              <CreateNotice />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
