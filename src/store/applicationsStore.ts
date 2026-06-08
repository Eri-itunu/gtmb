import { create } from "zustand";
import type { Application } from "@/api/types";
import { MOCK_APPLICATIONS } from "@/mocks/applications";

interface ApplicationsStore {
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  resetApplications: () => void;
}

export const useApplicationsStore = create<ApplicationsStore>()((set) => ({
  applications: MOCK_APPLICATIONS,
  addApplication: (app) => set((state) => ({ applications: [app, ...state.applications] })),
  updateApplication: (id, patch) =>
    set((state) => ({
      applications: state.applications.map((application) =>
        application.id === id ? { ...application, ...patch } : application
      ),
    })),
  resetApplications: () => set({ applications: MOCK_APPLICATIONS }),
}));
