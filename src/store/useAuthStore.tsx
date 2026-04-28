import { create } from "zustand";

type AuthStore = {
  authUser: boolean | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isSendingEmail: boolean;
  sentEmailData: unknown | null;
  setAuthUser: (value: boolean | null) => void;
  // login: (options: RequestInit) => Promise<void>;
  // signup: (options: RequestInit) => Promise<void>;
  // forgotPassword: (options: RequestInit) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isSendingEmail: false,
  sentEmailData: null,
  setAuthUser: (value) => set({ authUser: value }),

  // login: async (options) => {
  //   console.log("login Loading state Value", get().isLoggingIn);
  //   try {
  //     set({ isLoggingIn: true });
  //     const res = await fetch(
  //       "http://localhost:8080/api/v1/users/login",
  //       options,
  //     );
  //     const data: AuthResponse = await res.json();

  //     if (data.statusCode !== 200) {
  //       toast.error(data.message);
  //       throw new Error(data.message);
  //     }

  //     console.log("Loggen In user data is", data);
  //     toast.success(data.message);
  //     set({ authUser: data });
  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : "Something went wrong";
  //     console.log("Something went wrong", message);
  //   } finally {
  //     set({ isLoggingIn: false });
  //   }
  // },

  // signup: async (options) => {
  //   console.log("sign up value loading state", get().isSigningUp);

  //   try {
  //     set({ isSigningUp: true });
  //     const res = await fetch(
  //       "http://localhost:8080/api/v1/users/register",
  //       options,
  //     );
  //     const data: AuthResponse = await res.json();

  //     if (data.statusCode !== 200) {
  //       toast.error(data.message);
  //       throw new Error(data.message);
  //     }

  //     //   const requestBody =
  //     //     typeof options.body === "string"
  //     //       ? (JSON.parse(options.body) as { email?: string })
  //     //       : {};
  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : "Something went wrong";
  //     console.log("Something went wrong", message);
  //   } finally {
  //     set({ isSigningUp: false });
  //   }
  // },

  // forgotPassword: async (options) => {
  //   set({ isSendingEmail: true });
  //   try {
  //     const res = await fetch(
  //       "http://localhost:8080/api/v1/users/forgot-password",
  //       options,
  //     );
  //     const data: AuthResponse = await res.json();

  //     if (data.statusCode !== 200) {
  //       toast.error(data.message);
  //       throw new Error(data.message);
  //     }

  //     console.log("Flow is here", data);

  //     toast.success(data.message);
  //     set({ sentEmailData: data });
  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : "Something went wrong";
  //     toast.error(message);
  //   } finally {
  //     set({ isSendingEmail: false });
  //   }
  // },
}));
