// backend/middleware/validateAuth.js

// ─────────────────────────────────────────────
// EMAIL VALIDATION
// ─────────────────────────────────────────────
// Requires: local@domain.tld with at least 2-char TLD
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

// ─────────────────────────────────────────────
// PASSWORD VALIDATION
// ─────────────────────────────────────────────
// Rules:
//   - 8+ characters
//   - at least 1 lowercase letter
//   - at least 1 uppercase letter
//   - at least 1 digit
//   - at least 1 special character
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required.'] };
  }

  const errors = [];

  if (password.length < 8) {
    errors.push('At least 8 characters.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('At least one number.');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) {
    errors.push('At least one special character (!@#$%^&* etc.).');
  }

  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────
// EXPRESS MIDDLEWARE (optional use)
// ─────────────────────────────────────────────
export function validateRegisterInput(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const { valid, errors } = validatePassword(password);
  if (!valid) {
    return res.status(400).json({
      success: false,
      message: 'Password does not meet requirements: ' + errors.join(' ')
    });
  }

  next();
}