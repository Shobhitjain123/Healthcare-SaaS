import { useEffect } from "react";
import { initializeAuthListener } from "@/services/firebaseAuth";

function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = initializeAuthListener();

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

export default AuthProvider;
