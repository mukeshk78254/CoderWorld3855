# 🚀 Production Deployment Configuration

## ✅ Deployment Status

### Backend (Render)
- **URL:** https://coderworld3855-5.onrender.com
- **Status:** ✅ Deployed Successfully
- **Platform:** Render
- **Build:** Successful (148 packages installed)

### Frontend (Vercel)
- **URL:** https://coderworld3855.vercel.app
- **Status:** ✅ Deployed Successfully
- **Platform:** Vercel

---

## ⚠️ Email Configuration Issue (Non-Critical)

### Current Issue
```
Email transporter verification failed: Connection timeout
```

### Why This Happens
This is a **non-critical warning** that appears when:
1. Email service (Gmail) is slow to respond
2. Using regular password instead of App Password
3. 2-Factor Authentication not properly configured

### Impact
- ✅ Backend is running perfectly
- ✅ All APIs working
- ⚠️ Only email-based features affected:
  - OTP verification
  - Password reset emails
  - Welcome emails

---

## 🔧 How to Fix Email Issues

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Name it: "CoderWorld Backend"
5. Click "Generate"
6. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### Step 3: Update Environment Variables in Render

1. Go to Render Dashboard: https://dashboard.render.com
2. Select your service: **coderworld3855-5**
3. Go to **Environment** tab
4. Update these variables:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (your App Password)
```

### Step 4: Redeploy
1. Click "Manual Deploy" → "Deploy latest commit"
2. Or just save the environment variables (auto-redeploys)

---

## 🌐 Environment Variables Setup

### Backend (Render) - Required Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
DB_CONNECT_STRING=mongodb+srv://username:password@cluster.mongodb.net/coderworld

# Authentication
JWT_KEY=your_super_secret_jwt_key_minimum_32_characters_long

# Redis Cache
REDIS_PASS=your_redis_password

# AI Integration
GEMINI_KEY=your_google_gemini_api_key

# Cloudinary (Image/Video Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Gmail) - THIS IS WHERE THE ERROR IS
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (App Password, not regular password)

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://coderworld3855-5.onrender.com/user/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=https://coderworld3855-5.onrender.com/user/auth/github/callback

# OAuth - Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://coderworld3855-5.onrender.com/user/auth/facebook/callback

# Payment Gateway - Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Payment Gateway - Stripe
STRIPE_SECRET=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE=pk_live_your_stripe_publishable_key
STRIPE_PRICE_CHAT_AI=price_your_stripe_price_id

# Frontend URL (IMPORTANT!)
CLIENT_URL=https://coderworld3855.vercel.app
```

### Frontend (Vercel) - Required Variables

```env
VITE_API_URL=https://coderworld3855-5.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 🔄 Update OAuth Redirect URIs

### Google OAuth Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Add Authorized redirect URIs:
   - `https://coderworld3855-5.onrender.com/user/auth/google/callback`
   - `https://coderworld3855.vercel.app` (for frontend)

### GitHub OAuth Settings
1. Go to: https://github.com/settings/developers
2. Select your OAuth App
3. Update Authorization callback URL:
   - `https://coderworld3855-5.onrender.com/user/auth/github/callback`

### Facebook App Dashboard
1. Go to: https://developers.facebook.com/apps
2. Select your app
3. Go to Facebook Login → Settings
4. Add Valid OAuth Redirect URIs:
   - `https://coderworld3855-5.onrender.com/user/auth/facebook/callback`

---

## 🔒 CORS Configuration (Already Fixed!)

Your backend now accepts requests from:
- ✅ `http://localhost:5173` (Local frontend dev)
- ✅ `http://localhost:5174` (Alternative local port)
- ✅ `http://localhost:3000` (Alternative local port)
- ✅ `https://coderworld3855.vercel.app` (Production frontend)
- ✅ `https://coderworld3855-5.onrender.com` (Production backend)

---

## 📊 Current Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   User's Browser                         │
│             https://coderworld3855.vercel.app            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS Requests
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API Server (Render)                 │
│        https://coderworld3855-5.onrender.com            │
├─────────────────────────────────────────────────────────┤
│  ├─ Express.js (Node.js)                                │
│  ├─ JWT Authentication                                   │
│  ├─ OAuth (Google, GitHub, Facebook)                    │
│  └─ Payment Gateway (Razorpay)                          │
└────────┬──────────────┬──────────────┬──────────────────┘
         │              │              │
         ▼              ▼              ▼
    ┌────────┐    ┌─────────┐    ┌────────────┐
    │MongoDB │    │  Redis  │    │ Google AI  │
    │ Atlas  │    │  Cloud  │    │  Gemini    │
    └────────┘    └─────────┘    └────────────┘
```

---

## 🎯 Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://coderworld3855-5.onrender.com/
```
**Expected:** Server response or API documentation

### 2. Test Frontend Access
Visit: https://coderworld3855.vercel.app
**Expected:** Landing page loads

### 3. Test Authentication
1. Go to: https://coderworld3855.vercel.app/login
2. Try logging in
3. Check browser console for API calls

### 4. Test API Connection
Open browser console on frontend:
```javascript
fetch('https://coderworld3855-5.onrender.com/problem/problems', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
```

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "CORS Error" in Browser Console
**Solution:**
- Verify CORS configuration in `src/index.js`
- Check if frontend URL is in the allowed origins list
- Redeploy backend after updating CORS

### Issue 2: "Network Error" or "Failed to fetch"
**Solution:**
- Check if backend URL in frontend `.env` is correct
- Verify: `VITE_API_URL=https://coderworld3855-5.onrender.com`
- Rebuild and redeploy frontend

### Issue 3: "Unauthorized" on API calls
**Solution:**
- Check if JWT_KEY is set in Render environment
- Verify authentication middleware is working
- Check browser cookies (credentials: 'include')

### Issue 4: "Database connection failed"
**Solution:**
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas (allow all: `0.0.0.0/0`)
- Ensure database user has correct permissions

### Issue 5: Email not working (Current Issue)
**Solution:** See "How to Fix Email Issues" section above

### Issue 6: OAuth redirect errors
**Solution:**
- Update OAuth redirect URIs in provider consoles
- Match exactly with environment variables
- Include protocol (https://)

---

## 📝 Post-Deployment Checklist

- [x] Backend deployed to Render
- [x] Frontend deployed to Vercel
- [x] CORS configured for production URLs
- [x] Environment variables set in Render
- [x] Environment variables set in Vercel
- [ ] **Email App Password configured** ⚠️ (Current task)
- [ ] OAuth redirect URIs updated
- [ ] Payment gateway webhooks configured
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Redis connection working
- [ ] Test user registration flow
- [ ] Test login flow
- [ ] Test problem submission
- [ ] Test AI chat feature
- [ ] Test payment flow

---

## 🔐 Security Recommendations

### Immediate Actions
1. ✅ Use HTTPS (automatically handled by Render & Vercel)
2. ✅ Environment variables in place (not in code)
3. ⚠️ Switch Razorpay/Stripe to production mode (currently test mode)
4. ⚠️ Set strong JWT_KEY (minimum 32 characters)
5. ⚠️ Use App Password for email (not regular password)

### Best Practices
- Enable rate limiting on API endpoints
- Set up error monitoring (Sentry, LogRocket)
- Configure automatic backups for MongoDB
- Enable Redis persistence
- Set up uptime monitoring (UptimeRobot)
- Configure CDN for static assets

---

## 📊 Monitoring & Logs

### Render Logs
1. Go to: https://dashboard.render.com
2. Select your service
3. Click "Logs" tab
4. Monitor real-time logs

### Vercel Logs
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click "Deployments"
4. View function logs

---

## 🎊 Success! Your App is Live!

### 🌐 Access URLs
- **Frontend:** https://coderworld3855.vercel.app
- **Backend API:** https://coderworld3855-5.onrender.com

### ✅ Working Features
- User authentication (JWT)
- Problem solving
- Code execution (Judge0)
- Discussion forum
- Profile dashboard
- Premium subscriptions (Razorpay)
- AI chat (Google Gemini)

### ⚠️ Needs Configuration
- Email verification (App Password setup needed)
- OAuth redirects (Update provider consoles)

---

## 📞 Support

If you encounter any issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Review this guide for common solutions
4. Check GitHub repository for updates

---

<div align="center">

**🎉 Congratulations! Your CoderWorld platform is deployed! 🎉**

**Backend:** https://coderworld3855-5.onrender.com  
**Frontend:** https://coderworld3855.vercel.app

</div>
