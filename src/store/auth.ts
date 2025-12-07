// Minimal fallback auth store so pages can import `useAuthStore`.
// This provides no-op implementations suitable for local development
// when a full auth implementation is not present.

export type User = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export const useAuthStore = () => {
  // Values are intentionally simple: unauthenticated by default.
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null as User | null,
    token: null as string | null,
    login: async (_data: any) => {
      // no-op: in a real app this would authenticate and set state.
      return Promise.resolve();
    },
    register: async (_data: any) => {
      // no-op
      return Promise.resolve();
    },
    logout: () => {
      // no-op
    }
  };
};

export default useAuthStore;
