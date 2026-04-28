import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";

const firebaseConfig = {
  apiKey: "AIzaSyBb2oEzFA0R_LyA26sn_nORQB4s1d0OQb4",
  authDomain: "healthcare-auth-36fac.firebaseapp.com",
  projectId: "healthcare-auth-36fac",
  storageBucket: "healthcare-auth-36fac.firebasestorage.app",
  messagingSenderId: "470312587984",
  appId: "1:470312587984:web:77d457199bbba01ca884d5",
  measurementId: "G-TJJ0ZPS2DX",
};

interface Credentials {
  email: string;
  password: string;
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const useSignUp = ({ email, password }: Credentials) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(" Registered User from firebase", user);

      useAuthStore.getState().setAuthUser(true);
    })
    .catch((error) => {
      console.error("Firebase signup error", error);
      // ..
    });
};

export const useLogin = ({ email, password }: Credentials) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Logged In User from Firebase", user);
      useAuthStore.getState().setAuthUser(true);
      // ...
    })
    .catch((error) => {
      console.error("Firebase login error", error);
    });
};

export const useSignout = () => {
  signOut(auth);
  useAuthStore.getState().setAuthUser(false);
};
