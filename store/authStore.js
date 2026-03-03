import { create } from 'zustand';
import api from '@/lib/api';

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user: null,
    authLoading: true,

    // Check authentication status and fetch user data
    checkAuth: async () => {
        try {
            const response = await api.get('/users/me');
            console.log(response.data)
            set({
                isAuthenticated: true,
                user: response.data.data,
                authLoading: false
            });
        } catch (error) {
            set({
                isAuthenticated: false,
                user: null,
                authLoading: false
            });
        }
    },

    // Set user data after login
    setUserData: (userData) => {
        set({
            isAuthenticated: true,
            user: userData
        });
    },

    logout: () => {
        api.post('/auth/logout');
        set({
            isAuthenticated: false,
            user: null
        });
    },
}));

export default useAuthStore;
