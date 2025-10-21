# Clerk Authentication Setup Guide

## Why Clerk?
Clerk provides secure, production-ready authentication without exposing sensitive secrets in your frontend code. It handles OAuth, JWT tokens, and user management securely.

## Setup Steps

### 1. Create Clerk Account
1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Sign up for a free account
3. Create a new application

### 2. Get Your Publishable Key
1. In your Clerk dashboard, go to "API Keys"
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### 3. Configure Environment Variables
Create a `.env` file in your project root:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key-here

# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

### 4. Configure OAuth Providers (Optional)
In your Clerk dashboard:
1. Go to "User & Authentication" → "Social Connections"
2. Enable Google, Facebook, GitHub, etc.
3. Add your OAuth app credentials

### 5. Configure Redirect URLs
In Clerk dashboard → "Paths":
- **Sign-in URL**: `/login`
- **Sign-up URL**: `/signup`
- **After sign-in URL**: `/`
- **After sign-up URL**: `/`

## Security Benefits

✅ **No secrets in frontend**: Only publishable keys are exposed
✅ **Secure token handling**: JWT tokens managed by Clerk
✅ **OAuth security**: All OAuth flows handled server-side
✅ **Production ready**: Built-in security best practices
✅ **Easy integration**: Drop-in components

## Usage

The app now uses Clerk components:
- `<ClerkSignIn />` - Secure sign-in with OAuth options
- `<ClerkSignUp />` - Secure sign-up with OAuth options
- `<UserProfile />` - User profile management
- `<ProtectedRoute />` - Route protection

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Use the Clerk authentication forms
4. Test OAuth providers (if configured)

## Production Deployment

1. Get your live publishable key from Clerk dashboard
2. Update your `.env` file with the live key
3. Configure production redirect URLs in Clerk dashboard
4. Deploy your application

## Troubleshooting

- **"Missing Publishable Key"**: Add `VITE_CLERK_PUBLISHABLE_KEY` to your `.env` file
- **OAuth not working**: Check OAuth provider configuration in Clerk dashboard
- **Redirect issues**: Verify redirect URLs in Clerk dashboard match your app URLs


















