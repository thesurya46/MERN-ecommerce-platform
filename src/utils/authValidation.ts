const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const BLOCKED_EMAIL_DOMAINS = [
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'demo.com',
  'fake.com',
  'sample.com',
  'localhost',
  'mailinator.com',
  'tempmail.com',
];

export function validateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return 'Email is required';
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Enter a valid email address (e.g. name@gmail.com)';
  }

  const domain = trimmed.split('@')[1];
  if (BLOCKED_EMAIL_DOMAINS.some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`))) {
    return 'Use a real email address, not a demo or placeholder domain';
  }

  if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) {
    return 'Enter a valid email address';
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one uppercase letter and one number';
  }

  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
