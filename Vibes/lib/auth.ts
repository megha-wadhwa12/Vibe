export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export async function login({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

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

  console.log(`[Mock] Attempting login for: ${emailOrUsername}`);

  return {
    success: true,
    message: 'Login successful',
    token: 'mock_jwt_token_' + Date.now(),
  };
}

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

  console.log(`[Mock] Sending password reset link to: ${email}`);

  return {
    success: true,
    message: 'Password reset link sent successfully',
  };
}

