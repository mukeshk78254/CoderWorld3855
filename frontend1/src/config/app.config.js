/**
 * Application Configuration
 * Automatically detects environment and uses correct URLs
 * 
 * IMPORTANT: Update environment variables in:
 * - Vercel Dashboard for production
 * - .env file for local development
 */

const isDevelopment = import.meta.env.MODE === 'development';

const config = {
  development: {
    // Local development URLs
    apiBaseUrl: 'http://localhost:3000',
    frontendUrl: 'http://localhost:5173',
    razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxx',
  },
  production: {
    // Live production URLs
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://coderworld3855-5.onrender.com',
    frontendUrl: import.meta.env.VITE_APP_URL || 'https://coder-world3855.vercel.app',
    razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  }
};

// Export active configuration based on environment
export const APP_CONFIG = isDevelopment ? config.development : config.production;

// Razorpay specific configuration
export const RAZORPAY_CONFIG = {
  keyId: APP_CONFIG.razorpayKeyId,
  callbacks: {
    // Payment success redirect
    successUrl: `${APP_CONFIG.frontendUrl}/premium?success=true`,
    
    // Payment failure redirect  
    failureUrl: `${APP_CONFIG.frontendUrl}/premium?error=payment_failed`,
    
    // Callback URL for Razorpay (not used with modal checkout but good to have)
    callbackUrl: `${APP_CONFIG.apiBaseUrl}/payment/callback`,
  },
  theme: {
    color: '#6366f1',
    backdrop_color: 'rgba(0, 0, 0, 0.8)'
  },
  modal: {
    backdropclose: true,
    escape: true,
    confirm_close: true
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  payment: {
    createOrder: `${APP_CONFIG.apiBaseUrl}/payment/create-order`,
    verifyPayment: `${APP_CONFIG.apiBaseUrl}/payment/verify-payment`,
    subscriptionStatus: `${APP_CONFIG.apiBaseUrl}/payment/subscription-status`,
  },
  user: {
    check: `${APP_CONFIG.apiBaseUrl}/user/check`,
  }
};

// Log configuration in development
if (isDevelopment) {
  console.log('🔧 App Configuration:', {
    environment: 'development',
    apiBaseUrl: APP_CONFIG.apiBaseUrl,
    frontendUrl: APP_CONFIG.frontendUrl,
    razorpayKeyId: APP_CONFIG.razorpayKeyId ? `${APP_CONFIG.razorpayKeyId.substring(0, 10)}...` : 'NOT SET'
  });
}

export default APP_CONFIG;
