import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type UserData = {
  uuid: string;
  name: string;
  email: string;
  profilePic: string;
  phonenumber: string;
  initials: string;
  jobTitle: string;
  sepciality: string;
  username: string;
  organisation: {
    uuid: string;
    name: string;
  };
};
interface UIStoreInterface {
  user: UserData;
  setUser: (user: UserData) => void;
  logout: () => void;
  resetStore: () => void;
}

const initialState: Omit<
  UIStoreInterface,
  "setUser" | "logout" | "resetStore"
> = {
  user: {
    uuid: "8438irlduoai9d3",
    name: "Toumi Hichem",
    email: "hichemtoumi@poste.dz",
    profilePic: "/images/8438irlduoai9d3.png",
    phonenumber: "+2130787693850",
    initials: "TH",
    jobTitle: "Engineer",
    sepciality: "Embedded Systems",
    username: "hichem_toumi",
    organisation: {
      uuid: "nhi98'd48id94",
      name: "DCI",
    },
  },
};
export const UIStateStore = create<UIStoreInterface>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setUser: (user) => {
          set({ user });
        },
        logout: () => {
          //console.log("logging out.");
        },
        resetStore: () => {
          set({ ...initialState });
        },
      }),
      {
        name: "ui-state-store",
      },
    ),
  ),
);
