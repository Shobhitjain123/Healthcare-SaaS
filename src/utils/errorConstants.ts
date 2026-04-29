export const ERROS = {
  EMAIL_REQUIRED: "Email is required.",
  EMAIL_INVALID_FORMAT: "Incorrect email format.",
  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_WEAK_FORMAT:
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
  AUTH_USER_NOT_FOUND: "User does not exist.",
  AUTH_INCORRECT_PASSWORD: "Incorrect password.",
  AUTH_INVALID_CREDENTIALS: "Invalid email or password.",
  AUTH_EMAIL_ALREADY_REGISTERED: "Email is already registered.",
  AUTH_TOO_MANY_REQUESTS:
    "Too many attempts. Please try again in a few minutes.",
  AUTH_FAILED_GENERIC: "Authentication failed. Please try again.",
  LOGIN_FAILED_GENERIC: "Unable to login right now.",
  REGISTER_FAILED_GENERIC: "Unable to register right now.",
} as const;
