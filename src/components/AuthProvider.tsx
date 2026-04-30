import { useEffect } from "react";
import { initializeAuthListener } from "@/services/firebaseAuth";

function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("Initializing auth listener...");
    const unsubscribe = initializeAuthListener();

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

export default AuthProvider;
