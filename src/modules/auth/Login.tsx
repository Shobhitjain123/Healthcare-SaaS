import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { loginWithEmail } from "@/services/firebaseAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { validateLoginForm, type AuthFieldErrors } from "@/utils/authValidation";
import toast from "react-hot-toast";
import { ERROS } from "@/utils/errorConstants";
function Auth() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<AuthFieldErrors>({});

  const { setIsLogginIn } = useAuthStore();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData);
    const hasValidationErrors = Object.values(validationErrors).some(Boolean);

    if (hasValidationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLogginIn(true);
    try {
      await loginWithEmail(formData);
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : ERROS.LOGIN_FAILED_GENERIC,
      );
    } finally {
      setIsLogginIn(false);
    }
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          formData={formData}
          setFormData={(value) => {
            setFormData(value);
            setErrors((prev) => ({ ...prev, email: undefined, password: undefined }));
          }}
          handleLogin={handleLogin}
          errors={errors}
        />
      </div>
    </div>
  );
}

export default Auth;
