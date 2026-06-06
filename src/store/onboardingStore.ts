import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./persistentStorage";

export interface OnboardingState {
  userName: string;
  hasOnboarded: boolean;
  setUserName: (name: string) => void;
  resetOnboarding: () => void;
}

const zustandStorage = {
  getItem: (name: string) => storage.getString(name),
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
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
