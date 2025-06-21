import React, { useEffect, useState, createContext, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import API_ENDPOINTS from '../../utils/apiConfig';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Parse stored user data immediately
      const parsedUserData = JSON.parse(userData);
      
      // Set user data immediately from localStorage
      setUser(parsedUserData);
      setIsAuthenticated(true);

      // Verify token with backend (optional background check)
      try {
        const response = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok || !data.data?.valid) {
          // Invalid token, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (verifyError) {
        console.warn('Token verification failed:', verifyError);
        // Don't clear auth state on network error, just log it
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear storage on parsing error
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check admin access for admin-only routes
  if (adminOnly && !user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated and authorized
  return children;
}

// Route Guard Hook for conditional rendering
export const useRouteGuard = () => {
  const { user } = useAuth();
  
  const canAccess = (route) => {
    if (!user) return false;
    
    // Define route permissions
    const adminOnlyRoutes = [
      '/dashboard',
      '/casting-orders',
      '/orders',
      '/user',
      '/products',
      '/client-master',
      '/operation-type',
      '/report'
    ];
    
    const userRoutes = [
      '/dashboard',
      '/orders',
    ];
    
    // Admin can access everything
    if (user.isAdmin) return true;
    
    // Regular users can only access specific routes
    if (userRoutes.some(userRoute => route.startsWith(userRoute))) {
      return true;
    }
    
    // Check if it's an admin-only route
    if (adminOnlyRoutes.some(adminRoute => route.startsWith(adminRoute))) {
      return false;
    }
    
    return false;
  };
  
  return { canAccess, user };
};