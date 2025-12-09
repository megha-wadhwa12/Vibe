import Constants from "expo-constants";

const BREVO_API_KEY = Constants.expoConfig?.extra?.BREVO_API_KEY;

export interface SendOTPResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtmlTemplate(otp: string) {
  const APP_NAME = "Vibe";
  const EXPIRY = "10";
  const SUPPORT_EMAIL = "support@vibe-app.com";
  const YEAR = new Date().getFullYear().toString();

  const template = `<!-- Preheader -->
<span style="display:none!important;opacity:0;height:0;width:0;margin:0;padding:0;font-size:1px;line-height:1px;color:transparent;">
Your ${APP_NAME} verification code — expires in ${EXPIRY} minutes.
</span>

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fff;font-family: system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial; color:#333;">
  <tr>
    <td align="center" style="padding: 28px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(150,120,200,0.12);">

        <tr>
          <td style="background:linear-gradient(90deg,#ffd6e8 0%, #f7e6ff 100%);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:20px;color:#4b2fa6;font-weight:700;">Verify your email</h1>
            <p style="margin:8px 0 0;font-size:13px;color:#6b4fbf;opacity:0.9;">A quick step to secure your ${APP_NAME} account</p>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:28px 32px;">
            <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#444;">
              Hi there — use the code below to verify your email address. It will expire in <strong>${EXPIRY} minutes</strong>.
            </p>

            <div style="text-align:center;margin:18px 0 28px;">
              <div style="display:inline-block;padding:18px 28px;border-radius:12px;background:linear-gradient(180deg,#fff0f8,#fff6ff);box-shadow:0 6px 18px rgba(154,137,255,0.12);">
                <p style="margin:0;font-size:28px;letter-spacing:4px;font-weight:700;color:#7a57ff;">
                  ${otp}
                </p>
              </div>
            </div>

            <p style="margin:0 0 18px;font-size:14px;color:#666;line-height:1.5;">
              If you didn't request this, simply ignore this email. For help, contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#d33b9d;text-decoration:none;">${SUPPORT_EMAIL}</a>.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#faf6ff;padding:18px 32px;text-align:center;font-size:12px;color:#8a6edb;">
            <div style="margin-bottom:8px;">Made with ❤️ by ${APP_NAME}</div>
            <div style="opacity:0.85;">If you didn’t request an account, no action is required.</div>
            <div style="margin-top:10px;color:#b08be0;">© ${YEAR} ${APP_NAME}. All rights reserved.</div>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>`;

  return template;
}

export async function sendOTP(email: string): Promise<SendOTPResponse> {
  if (!email || !email.trim()) {
    return { success: false, message: "Email is required" };
  }

  const otp = generateOTP();
  const htmlContent = getOtpHtmlTemplate(otp);

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: "meghawadhwa20@gmail.com", name: "Vibe App" },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent,
        text: `Your Vibe verification code: ${otp} (expires in 10 minutes)`
      }),
    });

    if (!response.ok) {
      return { success: false, message: "Failed to send OTP" };
    }

    return { success: true, message: "OTP sent", otp };
  } catch (error) {
    console.log("Brevo error:", error);
    return { success: false, message: "Network error. Try again." };
  }
}

export async function verifyOTP(
  enteredCode: string,
  actualCode: string | undefined,
  expiryTs?: number | null
): Promise<VerifyOTPResponse> {
  if (!enteredCode || enteredCode.length !== 6) {
    return { success: false, message: "Enter a 6-digit code" };
  }

  if (!actualCode) {
    return { success: false, message: "No OTP found. Request a new code." };
  }

  const now = Date.now();
  if (expiryTs && now > expiryTs) {
    return { success: false, message: "Code expired. Please request a new one." };
  }

  if (enteredCode !== actualCode) {
    return { success: false, message: "Incorrect code. Try again." };
  }

  return { success: true, message: "OTP verified", token: "mock_jwt_token_" + Date.now() };
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

