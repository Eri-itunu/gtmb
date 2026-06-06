import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { useApplicationsStore } from "./applicationsStore";
import { useNewApplicationStore } from "./newApplicationStore";
import { useOnboardingStore } from "./onboardingStore";
import { storage } from "./persistentStorage";
import { useUIStore } from "./uiStore";

const ACCESS_TOKEN_KEY = "globaltrust.accessToken";
const REFRESH_TOKEN_KEY = "globaltrust.refreshToken";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  setTokens: (access: string, refresh: string) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  refreshToken: null,

  setAccessToken: (token) => {
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token).catch(() => undefined);
    set({ accessToken: token });
  },

  setTokens: (access, refresh) => {
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access).catch(() => undefined);
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh).catch(() => undefined);
    set({ accessToken: access, refreshToken: refresh });
  },

  logOut: () => {
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).catch(() => undefined);
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => undefined);
    storage.clearAll().catch(() => undefined);
    useApplicationsStore.getState().resetApplications();
    useNewApplicationStore.getState().resetForm();
    useOnboardingStore.getState().resetOnboarding();
    useUIStore.getState().resetUI();
    set({ accessToken: null, refreshToken: null });
  },
}));
