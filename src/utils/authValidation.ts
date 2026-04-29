import { ERROS } from "@/utils/errorConstants";

export type AuthFieldErrors = {
  email?: string;
  password?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const validateEmail = (email: string): string => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return ERROS.EMAIL_REQUIRED;
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return ERROS.EMAIL_INVALID_FORMAT;
  }

  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return ERROS.PASSWORD_REQUIRED;
  }

  if (!PASSWORD_REGEX.test(password)) {
    return ERROS.PASSWORD_WEAK_FORMAT;
  }

  return "";
};

export const validateLoginForm = ({
  email,
  password,
}: LoginPayload): AuthFieldErrors => {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  return {
    email: emailError || undefined,
    password: passwordError || undefined,
  };
};

export const validateSignUpForm = ({
  email,
  password,
}: LoginPayload): AuthFieldErrors => {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  return {
    email: emailError || undefined,
    password: passwordError || undefined,
  };
};
