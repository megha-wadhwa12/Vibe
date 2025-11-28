// Mock API functions for authentication

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

/**
 * Mock function to send OTP to email or phone
 */
export async function sendOTP(emailOrPhone: string): Promise<SendOTPResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (!emailOrPhone || emailOrPhone.trim().length === 0) {
    return {
      success: false,
      message: 'Email or phone number is required',
    };
  }

  // In a real app, this would make an API call
  console.log(`[Mock] Sending OTP to: ${emailOrPhone}`);
  
  return {
    success: true,
    message: 'OTP sent successfully',
  };
}

/**
 * Mock function to verify OTP code
 */
export async function verifyOTP(code: string): Promise<VerifyOTPResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock validation
  if (!code || code.length !== 6) {
    return {
      success: false,
      message: 'Invalid OTP code',
    };
  }

  // In a real app, this would verify the code with the backend
  // For demo purposes, accept any 6-digit code
  console.log(`[Mock] Verifying OTP: ${code}`);
  
  // Mock: Accept code "123456" as valid, reject others
  if (code === '123456') {
    return {
      success: true,
      message: 'OTP verified successfully',
      token: 'mock_jwt_token_' + Date.now(),
    };
  }

  return {
    success: false,
    message: 'Invalid OTP code. Try 123456 for demo.',
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

/**
 * Mock function to login with email/username and password
 */
export async function login({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}): Promise<LoginResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock validation
  if (!emailOrUsername || emailOrUsername.trim().length === 0) {
    return {
      success: false,
      message: 'Email or username is required',
    };
  }

  if (!password || password.length === 0) {
    return {
      success: false,
      message: 'Password is required',
    };
  }

  // In a real app, this would make an API call
  console.log(`[Mock] Attempting login for: ${emailOrUsername}`);

  // Mock: Accept any credentials for demo purposes
  // In production, this would verify against a database
  return {
    success: true,
    message: 'Login successful',
    token: 'mock_jwt_token_' + Date.now(),
  };
}

/**
 * Mock function to send password reset email
 */
export async function sendPasswordReset(email: string): Promise<PasswordResetResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (!email || email.trim().length === 0) {
    return {
      success: false,
      message: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      success: false,
      message: 'Please enter a valid email address',
    };
  }

  // In a real app, this would make an API call
  console.log(`[Mock] Sending password reset link to: ${email}`);

  return {
    success: true,
    message: 'Password reset link sent successfully',
  };
}

