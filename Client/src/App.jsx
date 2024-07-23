import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleSignIn } from './globalState/AuthSlice';
import { Toaster } from 'react-hot-toast';
import Header from './screens/Navigation/Header';
import toast from 'react-hot-toast';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const location = useLocation();
  async function googleSignIn(token){
    const result = await dispatch(GoogleSignIn(token));
    if (result.payload) {
      toast.success("Login Successful");
      return true
      return
    } else {
      toast.error(result.error.message);
      return false
    }
  }

  useEffect(() => {
    // Handle authentication token from URL
    if (location.pathname === '/') {
      const token = new URLSearchParams(location.search).get('token');
      if (token) {
        googleSignIn(token)
      }
      return;
    }

    // Redirect unauthenticated users from protected routes
    if (!isAuthenticated && location.pathname !== '/sign-up' && location.pathname !== '/login') {
      navigate('/sign-up', { replace: true });
      return;
    }
  }, [isAuthenticated, status, location, navigate, dispatch]);

  return (
    <div className="h-auto overflow-auto">
      <Header />
      <div className="h-auto overflow-auto flex items-center justify-center">
        {/* Render protected routes if authenticated */}
        {location.pathname === '/sign-up' || location.pathname === '/login' ? (
          <Outlet />
        ) : isAuthenticated ? (
          <Outlet />
        ) : (
          <Navigate to="/sign-up" replace />
        )}
      </div>
      <Toaster
        toastOptions={{
          className: 'text-xs',
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;
