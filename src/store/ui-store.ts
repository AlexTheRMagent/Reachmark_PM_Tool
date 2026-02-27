"use client";

import { create } from "zustand";

type ViewType = "list" | "board" | "calendar" | "table";

type UIState = {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  taskModalId: string | null;
  openTask: (id: string) => void;
  closeTask: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  currentView: "list",
  setView: (currentView) => set({ currentView }),
  taskModalId: null,
  openTask: (taskModalId) => set({ taskModalId }),
  closeTask: () => set({ taskModalId: null })
}));
