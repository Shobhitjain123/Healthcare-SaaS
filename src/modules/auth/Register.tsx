import { SignUpForm } from "@/components/SignUpForm";
import { useState } from "react";
import { signUpWithEmail } from "@/services/firebaseAuth";
import { validateSignUpForm, type AuthFieldErrors } from "@/utils/authValidation";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { ERROS } from "@/utils/errorConstants";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const { setIsSigningUp } = useAuthStore();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validateSignUpForm(formData);
    const hasValidationErrors = Object.values(validationErrors).some(Boolean);

    if (hasValidationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSigningUp(true);
    try {
      await signUpWithEmail(formData);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : ERROS.REGISTER_FAILED_GENERIC,
      );
    } finally {
      setIsSigningUp(false);
    }
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm
          formData={formData}
          setFormData={(value) => {
            setFormData(value);
            setErrors((prev) => ({ ...prev, email: undefined, password: undefined }));
          }}
          handleRegister={handleRegister}
          errors={errors}
        />
      </div>
    </div>
  );
}
