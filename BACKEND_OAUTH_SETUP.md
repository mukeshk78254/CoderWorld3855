# Backend OAuth Setup Guide

## Required Environment Variables

Add these environment variables to your backend `.env` file (in `LEETCODE/` directory):

```env
# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/facebook/callback

GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/github/callback

# JWT Secret (should already exist)
JWT_KEY=your-jwt-secret-key
```

## How to Get OAuth Credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set Application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env` file

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Go to Facebook Login → Settings
5. Add Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/facebook/callback`
6. Copy the App ID and App Secret to your `.env` file

### GitHub OAuth Setup
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

## Backend Routes Added

The following routes have been added to your backend:

### OAuth Initiation Routes
- `GET /api/auth/google` - Redirects to Google OAuth
- `GET /api/auth/facebook` - Redirects to Facebook OAuth
- `GET /api/auth/github` - Redirects to GitHub OAuth

### OAuth Callback Routes
- `GET /api/auth/google/callback` - Handles Google OAuth callback
- `GET /api/auth/facebook/callback` - Handles Facebook OAuth callback
- `GET /api/auth/github/callback` - Handles GitHub OAuth callback

## How It Works

1. **User clicks OAuth button** → Frontend redirects to backend OAuth route
2. **Backend redirects to provider** → User sees Google/Facebook/GitHub login page
3. **User authorizes** → Provider redirects back to backend callback
4. **Backend processes callback** → Creates/updates user in database
5. **Backend sets cookie and redirects** → User is logged in and redirected to frontend

## Testing

1. Start your backend: `npm run dev` (in `LEETCODE/` directory)
2. Start your frontend: `npm run dev` (in `LEETCODE/frontend1/` directory)
3. Go to `http://localhost:5173/login` or `http://localhost:5173/signup`
4. Click on the OAuth buttons to test the flow

## Troubleshooting

- **"Invalid redirect URI"**: Make sure the redirect URI in your OAuth app settings matches exactly
- **"Client ID not found"**: Check that your environment variables are set correctly
- **"Authentication failed"**: Check backend logs for detailed error messages
- **Cookie not set**: Make sure CORS is configured to allow credentials

















