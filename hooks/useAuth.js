import { useState, useEffect } from "react";
import api from "@/lib/api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check authentication status and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Fetch user profile data from your API
          const response = await api.get('/user/me');
          
          if (response.data.status === 'success') {
            setIsAuthenticated(true);
            setUser(response.data.data.user);
          } else {
            // Handle API error response
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          // Token might be expired or invalid
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setAuthLoading(false);
    };

    checkAuth();
  }, []);

  const setUserData = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    authLoading,
    setUserData,
    logout
  };
};
