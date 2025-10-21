# OAuth Buttons Not Showing? Here's How to Fix It!

## 🔍 **Why You Don't See OAuth Buttons**

The OAuth buttons (Google, Facebook, GitHub) only appear when you configure them in your Clerk dashboard. Right now, you're only seeing the email/password form.

## 🚀 **Quick Fix: Enable OAuth Providers**

### **Step 1: Go to Clerk Dashboard**
1. Open: https://dashboard.clerk.com/
2. Sign in to your account
3. Select your application

### **Step 2: Enable Social Connections**
1. Click **"User & Authentication"** in the left sidebar
2. Click **"Social Connections"**
3. You'll see a list of providers (Google, Facebook, GitHub, etc.)

### **Step 3: Enable Google (Easiest to Test)**
1. **Toggle ON** the Google switch
2. Click **"Configure"**
3. You'll need to add:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

### **Step 4: Get Google OAuth Credentials**
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set **Authorized redirect URIs** to: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
6. Copy the **Client ID** and **Client Secret**

### **Step 5: Add to Clerk**
1. Paste your Google Client ID and Client Secret in Clerk dashboard
2. Click **"Save"**

## 🎯 **What You'll See After Configuration**

**Before (Current):**
- ✅ Email/Password form
- ❌ No OAuth buttons

**After (With OAuth enabled):**
- ✅ Email/Password form
- ✅ Google button
- ✅ Facebook button (if configured)
- ✅ GitHub button (if configured)

## 🔧 **Alternative: Test Without OAuth Setup**

If you want to test the authentication without setting up OAuth providers:

1. **Use Email/Password**: The Clerk form supports email/password authentication
2. **Create Test Account**: You can create accounts using email/password
3. **Test Authentication Flow**: Verify the login/logout works

## 📱 **Current Status**

Your Clerk authentication is working! You just need to:
- ✅ **Clerk is configured** - Your publishable key is working
- ✅ **Forms are showing** - SignIn/SignUp components are rendering
- ⏳ **OAuth buttons** - Will appear once you configure providers in Clerk dashboard

## 🚀 **Quick Test**

1. Go to: http://localhost:5174/login
2. You should see the Clerk sign-in form
3. Try creating an account with email/password
4. Test the authentication flow

The OAuth buttons will automatically appear once you configure them in the Clerk dashboard!


















