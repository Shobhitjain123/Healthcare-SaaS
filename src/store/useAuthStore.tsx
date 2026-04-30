import { create } from "zustand";

type AuthStore = {
  authUser: boolean | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isSendingEmail: boolean;
  sentEmailData: unknown | null;
  isAuthChecking: boolean;
  setIsLogginIn: (value: boolean) => void;
  setIsSigningUp: (value: boolean) => void;
  setAuthUser: (value: boolean | null) => void;
  setIsAuthChecking: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isSendingEmail: false,
  sentEmailData: null,
  isAuthChecking: true,
  setIsLogginIn: (value) => set({ isLoggingIn: value }),
  setIsSigningUp: (value) => set({ isSigningUp: value }),
  setAuthUser: (value) => set({ authUser: value }),
  setIsAuthChecking: (value) => set({ isAuthChecking: value }),
}));
