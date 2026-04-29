import { create } from "zustand";

type AuthStore = {
  authUser: boolean | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isSendingEmail: boolean;
  sentEmailData: unknown | null;
  setIsLogginIn: (value: boolean) => void;
  setIsSigningUp: (value: boolean) => void;
  setAuthUser: (value: boolean | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isSendingEmail: false,
  sentEmailData: null,
  setIsLogginIn: (value) => set({ isLoggingIn: value }),
  setIsSigningUp: (value) => set({ isSigningUp: value }),
  setAuthUser: (value) => set({ authUser: value }),
}));
