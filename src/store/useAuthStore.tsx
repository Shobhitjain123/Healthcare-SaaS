import { create } from "zustand";

interface EmailData {
  email: string;
  timestamp: number;
}

type AuthStore = {
  authUser: boolean | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isSendingEmail: boolean;
  sentEmailData: EmailData | null;
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
