import { Exhibitor } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Response types
interface AuthResponse {
  exhibitor: Exhibitor;
  token: string;
  message: string;
}

interface OTPResponse {
  message: string;
  email: string;
}

interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

interface RegisterRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  otp: string;
}

interface OTPRequest {
  email: string;
}

interface WhatsAppOTPRequest {
  phone: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

class AuthService {
  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Send OTP for registration (Email)
  async sendEmailOTP(data: OTPRequest): Promise<OTPResponse> {
    return this.fetchAPI('/exhibitors/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Send OTP via WhatsApp
  async sendWhatsAppOTP(data: WhatsAppOTPRequest): Promise<OTPResponse> {
    return this.fetchAPI('/exhibitors/send-whatsapp-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Verify OTP for registration
  async verifyOTP(email: string, otp: string): Promise<{ message: string; verified: boolean }> {
    return this.fetchAPI('/exhibitors/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // Register new exhibitor
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.fetchAPI('/exhibitors/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Login exhibitor
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.fetchAPI('/exhibitors/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Send forgot password OTP
  async sendForgotPasswordOTP(data: ForgotPasswordRequest): Promise<OTPResponse> {
    return this.fetchAPI('/exhibitors/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reset password with OTP
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.fetchAPI('/exhibitors/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get current exhibitor profile (requires auth)
  async getProfile(token: string): Promise<Exhibitor> {
    return this.fetchAPI('/exhibitors/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Update exhibitor profile (requires auth)
  async updateProfile(token: string, data: Partial<Exhibitor>): Promise<Exhibitor> {
    return this.fetchAPI('/exhibitors/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Refresh auth token
  async refreshToken(token: string): Promise<AuthResponse> {
    return this.fetchAPI('/exhibitors/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Validate token
  async validateToken(token: string): Promise<{ valid: boolean; exhibitor?: Exhibitor }> {
    try {
      const exhibitor = await this.getProfile(token);
      return { valid: true, exhibitor };
    } catch (error) {
      return { valid: false };
    }
  }
}

export const authService = new AuthService();
export default authService;
