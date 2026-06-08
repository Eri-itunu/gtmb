import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "./secureStorage";

export interface OnboardingState {
  userName: string;
  hasOnboarded: boolean;
  setUserName: (name: string) => void;
  resetOnboarding: () => void;
}

const zustandStorage = {
  getItem: (name: string) => secureStorage.getString(name),
  setItem: (name: string, value: string) => secureStorage.set(name, value),
  removeItem: (name: string) => secureStorage.remove(name),
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      userName: "",
      hasOnboarded: false,
      setUserName: (name) => set({ userName: name.trim(), hasOnboarded: true }),
      resetOnboarding: () => set({ userName: "", hasOnboarded: false }),
    }),
    {
      name: "onboarding",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
