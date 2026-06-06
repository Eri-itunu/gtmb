import { create } from "zustand";
import type { ApplicationStatus } from "@/api/types";

export interface UIState {
  filterChip: ApplicationStatus | "all";
  searchQuery: string;
  activeModal: "withdraw_confirm" | "message_rm" | null;
  setFilterChip: (chip: ApplicationStatus | "all") => void;
  setSearchQuery: (q: string) => void;
  setActiveModal: (modal: UIState["activeModal"]) => void;
  resetUI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  filterChip: "all",
  searchQuery: "",
  activeModal: null,
  setFilterChip: (filterChip) => set({ filterChip }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveModal: (activeModal) => set({ activeModal }),
  resetUI: () => set({ activeModal: null, filterChip: "all", searchQuery: "" }),
}));
