import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Application } from "@/api/types";
import { MOCK_APPLICATIONS } from "@/mocks/applications";
import { storage } from "./persistentStorage";

interface ApplicationsStore {
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  resetApplications: () => void;
}

const zustandStorage = {
  getItem: (name: string) => storage.getString(name),
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

export const useApplicationsStore = create<ApplicationsStore>()(
  persist(
    (set) => ({
      applications: MOCK_APPLICATIONS,
      addApplication: (app) => set((state) => ({ applications: [app, ...state.applications] })),
      updateApplication: (id, patch) =>
        set((state) => ({
          applications: state.applications.map((application) => (application.id === id ? { ...application, ...patch } : application)),
        })),
      resetApplications: () => set({ applications: MOCK_APPLICATIONS }),
    }),
    {
      name: "globaltrust-applications",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
