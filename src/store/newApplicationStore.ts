import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "./persistentStorage";

export interface NewApplicationFormState {
  mortgageType: string;
  loanAmount: string;
  tenure: string;
  propertyType: string;
  propertyAddress: string;
  lastSavedAt: string | null;
}

interface NewApplicationStore extends NewApplicationFormState {
  setField: <K extends keyof NewApplicationFormState>(key: K, value: NewApplicationFormState[K]) => void;
  resetForm: () => void;
}

const INITIAL: NewApplicationFormState = {
  mortgageType: "",
  loanAmount: "",
  tenure: "",
  propertyType: "",
  propertyAddress: "",
  lastSavedAt: null,
};

const zustandStorage = {
  getItem: (name: string) => storage.getString(name),
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

export const useNewApplicationStore = create<NewApplicationStore>()(
  persist(
    (set) => ({
      ...INITIAL,
      setField: (key, value) => set((state) => ({ ...state, [key]: value })),
      resetForm: () => set(INITIAL),
    }),
    {
      name: "globaltrust-new-application-draft",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
