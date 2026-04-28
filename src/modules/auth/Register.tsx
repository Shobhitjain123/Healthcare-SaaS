import { SignUpForm } from "@/components/SignUpForm";
import { useState } from "react";
// import { useAuthStore } from "@/store/useAuthStore";
import { useSignUp } from "@/services/firebaseAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // const { signup } = useAuthStore();

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    console.log(formData);
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    };
    useSignUp(formData);
    // signup(options);
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm
          formData={formData}
          setFormData={setFormData}
          handleRegister={handleRegister}
        />
      </div>
    </div>
  );
}
