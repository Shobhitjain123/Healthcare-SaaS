import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogin } from "@/services/firebaseAuth";

function Auth() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // const { login } = useAuthStore();

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    setFormData({
      email: "",
      password: "",
    });

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    };
    useLogin(formData);
    // login(options);
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          formData={formData}
          setFormData={setFormData}
          handleLogin={handleLogin}
        />
      </div>
    </div>
  );
}

export default Auth;
