# 🚀 CoderWorld Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Railway/Render)](#backend-deployment)
3. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
4. [Database Setup (MongoDB Atlas)](#database-setup)
5. [Environment Variables Configuration](#environment-variables)
6. [Post-Deployment Steps](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ GitHub Account (already done)
- ✅ MongoDB Atlas Account (already have database)
- 🔲 Railway/Render Account (Backend hosting)
- 🔲 Vercel/Netlify Account (Frontend hosting)
- ✅ Razorpay Account (already configured)
- ✅ Google Cloud Console (for Gemini AI)
- ✅ Cloudinary Account (image hosting)

### Local Testing Before Deployment
```bash
# Test backend
cd C:\Users\MANISHA\Desktop\tutorial\LEETCODE
npm install
npm start

# Test frontend (in new terminal)
cd frontend1
npm install
npm run dev
```

---

## 🖥️ Backend Deployment

### Option 1: Deploy on Railway (Recommended)

#### Step 1: Sign Up & Connect GitHub
1. Go to [Railway.app](https://railway.app/)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select repository: `mukeshk78254/CoderWorld3855`

#### Step 2: Configure Backend Service
1. **Select Root Directory**: Set to `/` (root)
2. **Build Command**: 
   ```bash
   npm install
   ```
3. **Start Command**:
   ```bash
   npm start
   ```
4. **Port**: Railway auto-detects from `process.env.PORT`

#### Step 3: Add Environment Variables
Go to Railway Project → Variables → Add all from your `.env`:

```env
PORT=5000
DB_CONNECT_STRING=mongodb+srv://mukeshk78254:Muku%40123@coderarmy.bvau0wx.mongodb.net/Leetcode
JWT_KEY=28716d6924563d54291494565ae3dc128ac0bbad1a28e07988f0dd334377fd1c
REDIS_PASS=your_redis_password_here
GEMINI_KEY=your_google_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_specific_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.railway.app/user/auth/google/callback
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://your-backend-url.railway.app/user/auth/facebook/callback
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_REDIRECT_URI=https://your-backend-url.railway.app/user/auth/github/callback
STRIPE_SECRET=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE=pk_test_your_stripe_publishable_key
STRIPE_PRICE_CHAT_AI=price_your_stripe_price_id
CLIENT_URL=https://your-frontend-url.vercel.app
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-5 minutes for build
3. Copy your backend URL: `https://coderworld3855-production.up.railway.app`

---

### Option 2: Deploy on Render

#### Step 1: Sign Up & Create Web Service
1. Go to [Render.com](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `mukeshk78254/CoderWorld3855`

#### Step 2: Configure Service
- **Name**: `coderworld-backend`
- **Region**: Singapore/US (closest to you)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free

#### Step 3: Add Environment Variables
Click "Environment" → "Add Environment Variable" → Add all variables from above

#### Step 4: Deploy
Click "Create Web Service" → Wait 5-10 minutes

---

## 🌐 Frontend Deployment

### Option 1: Deploy on Vercel (Recommended)

#### Step 1: Sign Up & Import Project
1. Go to [Vercel.com](https://vercel.com/)
2. Click "Add New" → "Project"
3. Import `mukeshk78254/CoderWorld3855`

#### Step 2: Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `frontend1`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Step 3: Add Environment Variables
Click "Environment Variables" and add:

```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aHVtb3JvdXMtc3BhcnJvdy00MC5jbGVyay5hY2NvdW50cy5kZXYk
VITE_RAZORPAY_KEY_ID=rzp_test_RVMB2tOa62zCpr
```

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at: `https://coder-world-3855.vercel.app`

#### Step 5: Update Backend CLIENT_URL
1. Go back to Railway/Render
2. Update `CLIENT_URL` environment variable to your Vercel URL
3. Redeploy backend

---

### Option 2: Deploy on Netlify

#### Step 1: Sign Up & Create Site
1. Go to [Netlify.com](https://netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub → Select `CoderWorld3855`

#### Step 2: Configure Build
- **Base directory**: `frontend1`
- **Build command**: `npm run build`
- **Publish directory**: `frontend1/dist`

#### Step 3: Add Environment Variables
Site settings → Environment variables → Add:
```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aHVtb3JvdXMtc3BhcnJvdy00MC5jbGVyay5hY2NvdW50cy5kZXYk
VITE_RAZORPAY_KEY_ID=rzp_test_RVMB2tOa62zCpr
```

#### Step 4: Deploy
Click "Deploy site" → Wait 3-5 minutes

---

## 🗄️ Database Setup (MongoDB Atlas)

### Your Current Database (Already Configured)
```
mongodb+srv://mukeshk78254:Muku%40123@coderarmy.bvau0wx.mongodb.net/Leetcode
```

### Allow Network Access for Deployment
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

⚠️ **Security Note**: For production, restrict to specific IPs from Railway/Render

---

## 🔐 OAuth Redirect URIs Update

### Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client
4. Add Authorized Redirect URIs:
   ```
   https://your-backend-url.railway.app/user/auth/google/callback
   https://your-frontend-url.vercel.app
   ```
5. Save

### Update Facebook Developers
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Settings → Basic → Add Platform → Website
4. Add your frontend URL
5. Update Valid OAuth Redirect URIs:
   ```
   https://your-backend-url.railway.app/user/auth/facebook/callback
   ```

### Update GitHub OAuth Apps
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Update Authorization callback URL:
   ```
   https://your-backend-url.railway.app/user/auth/github/callback
   ```

---

## 📝 Post-Deployment Steps

### 1. Update Frontend API Endpoint

Edit `frontend1/src/utils/axiosClient.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app';
```

### 2. Test All Features
- ✅ User Registration/Login
- ✅ OAuth Login (Google, Facebook, GitHub)
- ✅ Problem Solving & Code Execution
- ✅ AI Chat Assistant
- ✅ Premium Subscription (Razorpay)
- ✅ Leaderboard
- ✅ Discussion Forum
- ✅ Admin Panel

### 3. Update Razorpay Webhook (Optional for Production)
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Settings → Webhooks
3. Add Webhook URL:
   ```
   https://your-backend-url.railway.app/api/payment/verify
   ```

### 4. Monitor Logs
- **Railway**: Project → Deployments → View Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Project → Deployments → View Function Logs

---

## 🛠️ Troubleshooting

### Backend Issues

#### "Application Error" or "503 Service Unavailable"
```bash
# Check Railway/Render logs for errors
# Common issues:
1. Missing environment variables
2. MongoDB connection timeout (check Network Access)
3. Port binding issues (ensure PORT is from env)
```

#### CORS Errors
Update `src/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Frontend Issues

#### "Network Error" or API calls failing
1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure backend is running
3. Check browser console for CORS errors

#### Build Failing on Vercel
```bash
# Common fixes:
1. Clear Vercel cache: Settings → Data Cache → Purge
2. Check Node version: Add .nvmrc file with "18" or "20"
3. Fix import paths (case-sensitive in production)
```

### Database Issues

#### "MongoNetworkError"
1. Check MongoDB Atlas Network Access
2. Verify connection string in Railway/Render env vars
3. Ensure database user has correct permissions

---

## 🚀 Quick Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Railway/Render account
- [ ] Deploy backend with all environment variables
- [ ] Copy backend URL
- [ ] Update OAuth redirect URIs
- [ ] Create Vercel/Netlify account
- [ ] Deploy frontend with VITE_API_URL
- [ ] Update backend CLIENT_URL with frontend URL
- [ ] Allow MongoDB network access (0.0.0.0/0)
- [ ] Test login, code execution, payments
- [ ] Monitor logs for errors

---

## 📊 Cost Estimation

### Free Tier (Good for Testing)
- **Railway**: $5 free credits/month → ~500 hours
- **Render**: 750 hours/month free
- **Vercel**: Unlimited deployments (free)
- **MongoDB Atlas**: 512MB free forever
- **Total**: $0/month

### Production (Paid)
- **Railway**: $5-20/month (depends on usage)
- **Render**: $7/month (starter instance)
- **Vercel**: Free (or $20/month Pro)
- **MongoDB Atlas**: $9/month (M10 shared cluster)
- **Total**: ~$15-30/month

---

## 🔗 Helpful Links

- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Razorpay Integration Guide](https://razorpay.com/docs/)

---

## 💡 Pro Tips

1. **Use Railway for Backend** - Faster deployments, better logs
2. **Use Vercel for Frontend** - Instant deployments, excellent DX
3. **Enable Auto-Deploy** - Push to GitHub → Auto-deploy
4. **Set up Custom Domains** - Professional look
5. **Monitor Performance** - Use Railway/Vercel analytics
6. **Regular Backups** - Export MongoDB data weekly

---

## 🆘 Need Help?

If you encounter issues:
1. Check deployment logs (Railway/Render/Vercel)
2. Verify all environment variables are set correctly
3. Test API endpoints with Postman
4. Check MongoDB Atlas connection
5. Review browser console for frontend errors

**Your deployment should be successful! Good luck! 🎉**
