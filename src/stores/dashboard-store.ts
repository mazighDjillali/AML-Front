import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Feature } from "geojson";
// import type { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES } from "react";

interface DashboardInterface {
  hoveredFeature: Feature | null;
  clickedFeature: Feature | null;

  setHoveredFeature: (feature: Feature | null) => void;
  setClickedFeature: (feature: Feature | null) => void;
}
const initialState: Omit<
  DashboardInterface,
  "setHoveredFeature" | "setClickedFeature"
> = {
  hoveredFeature: null,
  clickedFeature: null,
};
export const DashboardStore = create<DashboardInterface>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setClickedFeature: (feature) => set({ clickedFeature: feature }),
        setHoveredFeature: (feature) => set({ hoveredFeature: feature }),
      }),
      {
        name: "dashboard-store",
      },
    ),
  ),
);
