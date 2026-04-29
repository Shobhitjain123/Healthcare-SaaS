type FormFieldErrorProps = {
  message?: string;
};

export const FormFieldError = ({ message }: FormFieldErrorProps) => {
  if (!message) return null;

  return <p className="text-sm text-red-500">{message}</p>;
};
