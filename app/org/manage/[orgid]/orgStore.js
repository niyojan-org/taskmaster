import api from "@/lib/api";
import { create } from "zustand";

const Route = (id) => `/organizations/taskmaster/${id}`;

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const getChangedPayload = (initialValue, currentValue) => {
  if (initialValue === currentValue) {
    return undefined;
  }

  if (Array.isArray(initialValue) || Array.isArray(currentValue)) {
    return JSON.stringify(initialValue) === JSON.stringify(currentValue)
      ? undefined
      : deepClone(currentValue);
  }

  if (isPlainObject(initialValue) && isPlainObject(currentValue)) {
    const changed = {};
    const keys = new Set([
      ...Object.keys(initialValue || {}),
      ...Object.keys(currentValue || {}),
    ]);

    keys.forEach((key) => {
      if (key === "_id") {
        return;
      }

      const nextValue = getChangedPayload(
        initialValue?.[key],
        currentValue?.[key],
      );

      if (nextValue !== undefined) {
        changed[key] = nextValue;
      }
    });

    return Object.keys(changed).length > 0 ? changed : undefined;
  }

  return initialValue !== currentValue ? currentValue : undefined;
};

const setByPath = (obj, path, value) => {
  const keys = path.split(".");
  const nextObj = deepClone(obj || {});
  let current = nextObj;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (
      current[key] === undefined ||
      current[key] === null ||
      typeof current[key] !== "object"
    ) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return nextObj;
};

const useOrganizationStore = create((set) => ({
  organizationId: null,
  organizationData: null,
  initialOrganizationData: null,
  loading: false,
  saving: false,
  editingStates: {},
  activeEditCard: null,
  setOrganizationId: async (id) => {
    try {
      set({ loading: true });
      const response = await api.get(Route(id));
      if (response.data.success) {
        const normalized = deepClone(response.data.data);
        set({
          organizationId: response.data.data._id,
          organizationData: normalized,
          initialOrganizationData: normalized,
          editingStates: {},
          activeEditCard: null,
        });
      }
    } catch (error) {
      return error;
    } finally {
      set({ loading: false });
    }
  },
  setOrganizationData: (organizationData) => {
    const normalized = deepClone(organizationData);
    set({
      organizationData: normalized,
      initialOrganizationData: normalized,
      editingStates: {},
      activeEditCard: null,
    });
  },
  updateOrganizationField: (path, value) => {
    set((state) => {
      let nextData = setByPath(state.organizationData, path, value);

      // Keep verification flags consistent in local state.
      if (path === "verified" && value === true) {
        nextData = setByPath(nextData, "reqForVerification", false);
      }

      if (path === "reqForVerification" && value === true) {
        nextData = setByPath(nextData, "verified", false);
      }

      return {
        organizationData: nextData,
      };
    });
  },
  toggleEdit: (cardId) => {
    set((state) => {
      const currentlyEditing = !!state.editingStates[cardId];

      if (currentlyEditing) {
        return {
          editingStates: { ...state.editingStates, [cardId]: false },
          activeEditCard: null,
        };
      }

      return {
        editingStates: { [cardId]: true },
        activeEditCard: cardId,
      };
    });
  },
  cancelEdit: (cardId) => {
    set((state) => ({
      organizationData: deepClone(state.initialOrganizationData),
      editingStates: { ...state.editingStates, [cardId]: false },
      activeEditCard: null,
    }));
  },
  saveOrganizationData: async (cardId) => {
    try {
      set({ saving: true });
      const state = useOrganizationStore.getState();
      const payload =
        getChangedPayload(
          state.initialOrganizationData,
          state.organizationData,
        ) || {};

      if (Object.keys(payload).length === 0) {
        set((prev) => ({
          editingStates: { ...prev.editingStates, [cardId]: false },
          activeEditCard: null,
        }));

        return {
          data: {
            success: true,
            data: deepClone(state.organizationData),
            skipped: true,
          },
        };
      }

      const response = await api.patch(Route(state.organizationId), payload);

      if (response.data?.success) {
        await useOrganizationStore
          .getState()
          .setOrganizationId(state.organizationId);
      }

      return response;
    } finally {
      set({ saving: false });
    }
  },
  verifyOrganization: async ({ allowsEventCreation, note }) => {
    const state = useOrganizationStore.getState();
    if (!state.organizationId) {
      throw new Error("Organization ID not found.");
    }

    try {
      set({ saving: true });
      const response = await api.post(`${Route(state.organizationId)}/verify`, {
        allowsEventCreation,
        note,
      });

      if (response.data?.success) {
        const normalized = deepClone(
          response.data?.data || state.organizationData,
        );
        set({
          organizationData: normalized,
          initialOrganizationData: normalized,
        });
      }

      return response;
    } finally {
      set({ saving: false });
    }
  },
  rejectVerificationRequest: async ({ reason }) => {
    const state = useOrganizationStore.getState();
    if (!state.organizationId) {
      throw new Error("Organization ID not found.");
    }

    try {
      set({ saving: true });
      const response = await api.post(`${Route(state.organizationId)}/reject`, {
        reason,
      });

      if (response.data?.success) {
        const normalized = deepClone(
          response.data?.data || state.organizationData,
        );
        set({
          organizationData: normalized,
          initialOrganizationData: normalized,
        });
      }

      return response;
    } finally {
      set({ saving: false });
    }
  },
  unverifyOrganization: async ({ reason }) => {
    const state = useOrganizationStore.getState();
    if (!state.organizationId) {
      throw new Error("Organization ID not found.");
    }

    try {
      set({ saving: true });
      const response = await api.post(
        `${Route(state.organizationId)}/unverify`,
        {
          reason,
        },
      );

      if (response.data?.success) {
        const normalized = deepClone(
          response.data?.data || state.organizationData,
        );
        set({
          organizationData: normalized,
          initialOrganizationData: normalized,
        });
      }

      return response;
    } finally {
      set({ saving: false });
    }
  },
}));

export default useOrganizationStore;
