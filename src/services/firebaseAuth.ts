import { initializeApp } from "firebase/app";
import {
  type AuthError,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { ERROS } from "@/utils/errorConstants";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

interface Credentials {
  email: string;
  password: string;
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();



// Set auth persistence to LOCAL (persists across browser restarts)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

const mapFirebaseAuthError = (error: AuthError): string => {
  const errorMap: Record<string, string> = {
    "auth/user-not-found": ERROS.AUTH_USER_NOT_FOUND,
    "auth/wrong-password": ERROS.AUTH_INCORRECT_PASSWORD,
    "auth/invalid-credential": ERROS.AUTH_INVALID_CREDENTIALS,
    "auth/invalid-email": ERROS.EMAIL_INVALID_FORMAT,
    "auth/email-already-in-use": ERROS.AUTH_EMAIL_ALREADY_REGISTERED,
    "auth/too-many-requests": ERROS.AUTH_TOO_MANY_REQUESTS,
  };

  return errorMap[error.code] ?? ERROS.AUTH_FAILED_GENERIC;
};

// Firebase Signup handler
export const signUpWithEmail = async ({ email, password }: Credentials) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    console.log(" Registered User from firebase", user);
    useAuthStore.getState().setAuthUser(true);
    toast.success("Registration Successsfull");
  } catch (error) {
    console.error("Firebase signup error", error);
    const message = mapFirebaseAuthError(error as AuthError);
    throw new Error(message, { cause: error });
  }
};

// Firebase Login handler
export const loginWithEmail = async ({ email, password }: Credentials) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    console.log("Logged In User from Firebase", user);
    useAuthStore.getState().setAuthUser(true);
    toast.success("Login Successfull");
  } catch (error) {
    console.error("Firebase login error", error);
    const message = mapFirebaseAuthError(error as AuthError);
    throw new Error(message, { cause: error });
  }
};

// Custom hook for Firebase Logout
export const useSignout = () => {
  return async () => {
    try {
      await signOut(auth);
      useAuthStore.getState().setAuthUser(false);
      toast.success("Logout Successfull");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Logged In User from Google", user);
    useAuthStore.getState().setAuthUser(true);
    toast.success("Login Successfull");
  } catch (error) {
    console.error("Google login error", error);
    const message = mapFirebaseAuthError(error as AuthError);
    throw new Error(message, { cause: error });
  }
};

// Initialize auth state listener
export const initializeAuthListener = () => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.email);
      useAuthStore.getState().setAuthUser(true);
    } else {
      console.log("User is signed out");
      useAuthStore.getState().setAuthUser(false);
    }
    // Auth check is complete
    useAuthStore.getState().setIsAuthChecking(false);
  });
};

