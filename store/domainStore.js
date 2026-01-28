import { create } from 'zustand';
import api from '@/lib/api';

// Helper function to extract error message
const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) {
        if (typeof error.error === 'string') return error.error;
        if (error.error?.message) return error.error.message;
    }
    if (error?.details) {
        if (typeof error.details === 'string') return error.details;
        if (Array.isArray(error.details)) {
            return error.details.map(d => d.message || d).join(', ');
        }
    }
    return 'An unknown error occurred';
};

const useDomainStore = create((set, get) => ({
    domains: [],
    loading: false,
    error: null,
    filters: {
        environment: 'all',
        purpose: 'all',
        isActive: 'all',
    },

    // Fetch all domains
    fetchDomains: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/domains');
            set({ domains: response.data.data, loading: false });
        } catch (error) {
            const errorMsg = getErrorMessage(error.response?.data) || error.message || 'Failed to fetch domains';
            set({
                error: errorMsg,
                loading: false
            });
        }
    },

    // Fetch domains by environment
    fetchDomainsByEnvironment: async (env) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/domains/env/${env}`);
            set({ domains: response.data, loading: false });
        } catch (error) {
            const errorMsg = getErrorMessage(error.response?.data) || error.message || 'Failed to fetch domains';
            set({
                error: errorMsg,
                loading: false
            });
        }
    },

    // Fetch domains by purpose and environment
    fetchDomainsByPurposeAndEnv: async (purpose, env) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/domains/purpose/${purpose}/env/${env}`);
            set({ domains: response.data, loading: false });
        } catch (error) {
            const errorMsg = getErrorMessage(error.response?.data) || error.message || 'Failed to fetch domains';
            set({
                error: errorMsg,
                loading: false
            });
        }
    },

    // Create new domain
    createDomain: async (domainData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/domains', domainData);
            set((state) => ({
                domains: [...state.domains, response.data],
                loading: false
            }));
            return { success: true, data: response.data };
        } catch (error) {
            getErrorMessage(error.response?.data) || error.message
            const errorMsg = error.response?.data?.error || 'Failed to create domain';
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    // Update domain
    updateDomain: async (id, domainData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/domains/${id}`, domainData);
            set((state) => ({
                domains: state.domains.map((domain) =>
                    domain._id === id ? response.data : domain
                ),
                loading: false,
            }));
            return { success: true, data: response.data };
        } catch (error) {
            const errorMsg = getErrorMessage(error.response?.data) || error.message || 'Failed to update domain';
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    // Delete domain
    deleteDomain: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/domains/${id}`);
            set((state) => ({
                domains: state.domains.filter((domain) => domain._id !== id),
                loading: false,
            }));
            return { success: true };
        } catch (error) {
            const errorMsg = getErrorMessage(error.response?.data) || error.message || 'Failed to delete domain';
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    // Validate domain purpose
    validateDomainPurpose: async (domain, purpose) => {
        try {
            const response = await api.get('/domains/validate', {
                params: { domain, purpose },
            });
            return response.data;
        } catch (error) {
            const errorMsg = getErrorMessage(error.response?.data) || error.message || 'Validation failed';
            return { valid: false, error: errorMsg };
        }
    },

    // Set filters
    setFilters: (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters },
        }));
    },

    // Get filtered domains
    getFilteredDomains: () => {
        const { domains, filters } = get();
        let filtered = [...domains];

        if (filters.environment !== 'all') {
            filtered = filtered.filter((d) => d.environment === filters.environment);
        }

        if (filters.purpose !== 'all') {
            filtered = filtered.filter((d) => d.purposes[filters.purpose] === true);
        }

        if (filters.isActive !== 'all') {
            const activeStatus = filters.isActive === 'active';
            filtered = filtered.filter((d) => d.isActive === activeStatus);
        }

        return filtered;
    },

    // Get statistics
    getStats: () => {
        const { domains } = get();
        return {
            total: domains.length,
            active: domains.filter((d) => d.isActive).length,
            inactive: domains.filter((d) => !d.isActive).length,
            byEnvironment: {
                development: domains.filter((d) => d.environment === 'development').length,
                staging: domains.filter((d) => d.environment === 'staging').length,
                production: domains.filter((d) => d.environment === 'production').length,
            },
            byPurpose: {
                cors: domains.filter((d) => d.purposes?.cors).length,
                passkey: domains.filter((d) => d.purposes?.passkey).length,
                oauth: domains.filter((d) => d.purposes?.oauth).length,
                api: domains.filter((d) => d.purposes?.api).length,
                admin: domains.filter((d) => d.purposes?.admin).length,
            },
        };
    },

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useDomainStore;
