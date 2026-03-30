import { create } from "zustand";

const useResourceStore = create((set) => ({
  resources: [],
  totalResources: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 20,
  isLoading: false,
  error: null,
  
  // Filters
  filters: {
    type: "",
    status: "",
    organizationId: "",
    eventId: "",
    tags: "",
    search: "",
    sort: "-createdAt",
    minPriority: "",
    maxPriority: "",
    isPublic: "",
    createdFrom: "",
    createdTo: "",
  },
  
  // Selected resources for batch operations
  selectedResources: [],
  
  // Set resources
  setResources: (resources, total, page, totalPages) =>
    set({
      resources,
      totalResources: total,
      currentPage: page,
      totalPages,
    }),
  
  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),
  
  // Set error
  setError: (error) => set({ error, isLoading: false }),
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Update filters
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // Reset to first page when filters change
    })),
  
  // Reset filters
  resetFilters: () =>
    set({
      filters: {
        type: "",
        status: "",
        organizationId: "",
        eventId: "",
        tags: "",
        search: "",
        sort: "-createdAt",
        minPriority: "",
        maxPriority: "",
        isPublic: "",
        createdFrom: "",
        createdTo: "",
      },
      currentPage: 1,
    }),
  
  // Set page
  setPage: (page) => set({ currentPage: page }),
  
  // Set limit
  setLimit: (limit) => set({ limit, currentPage: 1 }),
  
  // Add resource
  addResource: (resource) =>
    set((state) => ({
      resources: [resource, ...state.resources],
      totalResources: state.totalResources + 1,
    })),
  
  // Update resource
  updateResource: (id, updates) =>
    set((state) => ({
      resources: state.resources.map((resource) =>
        resource._id === id ? { ...resource, ...updates } : resource
      ),
    })),
  
  // Delete resource (soft delete)
  deleteResource: (id) =>
    set((state) => ({
      resources: state.resources.map((resource) =>
        resource._id === id ? { ...resource, status: "archived" } : resource
      ),
    })),
  
  // Remove resource (hard delete)
  removeResource: (id) =>
    set((state) => ({
      resources: state.resources.filter((resource) => resource._id !== id),
      totalResources: state.totalResources - 1,
    })),
  
  // Toggle resource selection
  toggleResourceSelection: (id) =>
    set((state) => ({
      selectedResources: state.selectedResources.includes(id)
        ? state.selectedResources.filter((resourceId) => resourceId !== id)
        : [...state.selectedResources, id],
    })),
  
  // Select all resources
  selectAllResources: () =>
    set((state) => ({
      selectedResources: state.resources.map((resource) => resource._id),
    })),
  
  // Clear selection
  clearSelection: () => set({ selectedResources: [] }),
  
  // Batch delete
  batchDeleteResources: (ids) =>
    set((state) => ({
      resources: state.resources.filter(
        (resource) => !ids.includes(resource._id)
      ),
      totalResources: state.totalResources - ids.length,
      selectedResources: [],
    })),
}));

export default useResourceStore;
