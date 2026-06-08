import { create } from "zustand";
import { useApplicationsStore } from "./applicationsStore";
import { useNewApplicationStore } from "./newApplicationStore";
import { useOnboardingStore } from "./onboardingStore";
import { secureStorage } from "./secureStorage";
import { useUIStore } from "./uiStore";

const ACCESS_TOKEN_KEY = "globaltrust.accessToken";
const REFRESH_TOKEN_KEY = "globaltrust.refreshToken";

export interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => Promise<void>;
  setTokens: (access: string, refresh: string) => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
  logOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,

  setAccessToken: async (token) => {
    await secureStorage.set(ACCESS_TOKEN_KEY, token);
    set({ accessToken: token });
  },

  setTokens: async (access, refresh) => {
    await Promise.all([
      secureStorage.set(ACCESS_TOKEN_KEY, access),
      secureStorage.set(REFRESH_TOKEN_KEY, refresh),
    ]);
    set({ accessToken: access });
  },

  getRefreshToken: () => secureStorage.getString(REFRESH_TOKEN_KEY),

  logOut: async () => {
    await Promise.allSettled([
      secureStorage.remove(ACCESS_TOKEN_KEY),
      secureStorage.remove(REFRESH_TOKEN_KEY),
    ]);
    useApplicationsStore.getState().resetApplications();
    useNewApplicationStore.getState().resetForm();
    useOnboardingStore.getState().resetOnboarding();
    useUIStore.getState().resetUI();
    set({ accessToken: null });
  },
}));
