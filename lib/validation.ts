export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterErrors = Partial<Record<keyof RegisterInput, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
  );
}

export function validateRegister(input: RegisterInput): RegisterErrors {
  const errors: RegisterErrors = {};
  if (input.name.trim().length < 2) {
    errors.name = "Please enter your full name (at least 2 characters).";
  }
  if (!isValidEmail(input.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!isValidPassword(input.password)) {
    errors.password =
      "Use at least 8 characters, including a letter and a number.";
  }
  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export function validateLogin(email: string, password: string): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!isValidEmail(email))
    errors.email = "Please enter a valid email address.";
  if (password.length === 0) errors.password = "Please enter your password.";
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
