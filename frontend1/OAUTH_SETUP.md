# OAuth Setup Guide

## Environment Variables

Create a `.env` file in the frontend1 directory with the following variables:

```env
# OAuth Configuration
# Get these from your Google Cloud Console
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Get these from your Facebook Developer Console
VITE_FACEBOOK_APP_ID=your-facebook-app-id-here
VITE_FACEBOOK_REDIRECT_URI=http://localhost:5173/auth/facebook/callback

# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback` (for production)
7. Copy the Client ID to your `.env` file

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to Facebook Login → Settings
5. Add Valid OAuth Redirect URIs:
   - `http://localhost:5173/auth/facebook/callback`
   - `https://yourdomain.com/auth/facebook/callback` (for production)
6. Copy the App ID to your `.env` file

## Backend Environment Variables

Add these to your backend `.env` file:

```env
# OAuth Backend Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/facebook/callback

JWT_KEY=your-jwt-secret-key
```

## Backend Implementation

Your backend now has these OAuth endpoints (already added to userauthentication.js):

### Google OAuth Callback
```
POST /api/auth/google/callback
Body: { code: "authorization_code" }
Response: { user: {...}, token: "jwt_token" }
```

### Facebook OAuth Callback
```
POST /api/auth/facebook/callback
Body: { code: "authorization_code" }
Response: { user: {...}, token: "jwt_token" }
```

### Social Login
```
POST /api/user/social-login
Body: { provider: "google|facebook|github", userData: {...} }
Response: { user: {...}, token: "jwt_token" }
```

## Usage

The OAuth buttons are now integrated into both Login and Signup pages. Users can click on Google, Facebook, or GitHub buttons to authenticate using their social accounts.

The system will:
1. Redirect to the OAuth provider
2. User authorizes the application
3. Provider redirects back with authorization code
4. Backend exchanges code for user data
5. User is logged in automatically
