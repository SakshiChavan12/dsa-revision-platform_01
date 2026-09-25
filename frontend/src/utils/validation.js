// frontend/src/utils/validation.js

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required.'] };
  }

  const errors = [];

  if (password.length < 8) errors.push('At least 8 characters.');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter.');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter.');
  if (!/[0-9]/.test(password)) errors.push('One number.');
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) errors.push('One special character.');

  return { valid: errors.length === 0, errors };
}

// Returns 0–4
export function passwordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) score++;
  return Math.min(score, 4);
}