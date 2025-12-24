// Validation helper functions for signup form

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a name (first or last name)
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Name is required',
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters',
    };
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return { isValid: true };
}

/**
 * Validates email or phone number
 */
export function validateEmail(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: 'Email or phone number is required',
    };
  }

  const trimmedValue = value.trim();

  // Check if it's an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmedValue)) {
    return { isValid: true };
  }

  // Check if it's a phone number (basic validation)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = trimmedValue.replace(/\D/g, '');
  
  if (phoneRegex.test(trimmedValue) && digitsOnly.length >= 10) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: 'Please enter a valid email or phone number',
  };
}

/**
 * Validates username
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim().length === 0) {
    return {
      isValid: false,
      error: 'Username is required',
    };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters',
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  return { isValid: true };
}

/**
 * Validates password
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters',
    };
  }

  return { isValid: true };
}

/**
 * Validates birthday and checks if user is 13+ years old
 */
export function validateBirthday(month: number, day: number, year: number): ValidationResult {
  if (!month || !day || !year) {
    return {
      isValid: false,
      error: 'Please select a valid date',
    };
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  
  // Check if date is valid
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return {
      isValid: false,
      error: 'Please select a valid date',
    };
  }

  // Check if date is in the future
  if (birthDate > today) {
    return {
      isValid: false,
      error: 'Birthday cannot be in the future',
    };
  }

  // Calculate age
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  const dayDiff = today.getDate() - day;

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < 13) {
    return {
      isValid: false,
      error: 'You must be at least 13 years old to sign up',
    };
  }

  return { isValid: true };
}

/**
 * Validates email or username (for login)
 * Returns object with valid boolean and message string
 */
export function validateEmailOrUsername(value: string): { valid: boolean; message: string } {
  if (!value || value.trim().length === 0) {
    return {
      valid: false,
      message: 'Email or username is required',
    };
  }

  const trimmedValue = value.trim();

  // Check if it's an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmedValue)) {
    return { valid: true, message: '' };
  }

  // Check if it's a valid username (at least 3 characters, alphanumeric + underscore)
  if (trimmedValue.length >= 3 && /^[a-zA-Z0-9_]+$/.test(trimmedValue)) {
    return { valid: true, message: '' };
  }

  return {
    valid: false,
    message: 'Please enter a valid email or username',
  };
}

/**
 * Validates email format
 * Returns object with valid boolean and message string
 */
// export function validateEmail(email: string): { valid: boolean; message: string } {
//   if (!email || email.trim().length === 0) {
//     return {
//       valid: false,
//       message: 'Email is required',
//     };
//   }

//   const trimmedEmail = email.trim();
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!emailRegex.test(trimmedEmail)) {
//     return {
//       valid: false,
//       message: 'Please enter a valid email address',
//     };
//   }

//   return { valid: true, message: '' };
// }

