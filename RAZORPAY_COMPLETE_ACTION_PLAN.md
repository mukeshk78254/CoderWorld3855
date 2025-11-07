# 🎯 RAZORPAY INTEGRATION - COMPLETE ACTION PLAN

**Last Updated:** November 7, 2025  
**Frontend:** https://coder-world3855.vercel.app/  
**Backend:** https://coderworld3855-5.onrender.com

---

## ✅ COMPLETED CHANGES

### 1. ✅ Created Configuration File
**File:** `frontend1/src/config/app.config.js`
- Automatically detects development vs production
- Centralizes all URLs and Razorpay settings
- No manual URL changes needed in future

### 2. ✅ Created Webhook Handler
**File:** `src/routes/webhookRoutes.js`
- Handles real-time payment notifications
- Verifies webhook signatures for security
- Auto-updates user premium status
- Includes test endpoint: `/webhook/test`

### 3. ✅ Updated PremiumPage Component
**File:** `frontend1/src/pages/PremiumPage.jsx`
- Now uses `RAZORPAY_CONFIG` and `APP_CONFIG`
- Dynamic URLs based on environment
- Proper logo path for Razorpay modal

### 4. ✅ Created Implementation Guide
**File:** `RAZORPAY_UPDATE_GUIDE.md`
- Complete step-by-step instructions
- Environment variable setup
- Testing checklist
- Troubleshooting guide

---

## 📋 REQUIRED MANUAL ACTIONS

### 🔴 CRITICAL - Must Do Before Testing

#### **ACTION 1: Update Render Environment Variables**
**Where:** https://dashboard.render.com > Your Service > Environment

**Add/Update These Variables:**
```env
# Razorpay Credentials (CRITICAL - GET FROM RAZORPAY DASHBOARD)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key_here

# Webhook Secret (GET AFTER CREATING WEBHOOK IN RAZORPAY)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# URLs
FRONTEND_URL=https://coder-world3855.vercel.app
CORS_ORIGIN=https://coder-world3855.vercel.app
BACKEND_URL=https://coderworld3855-5.onrender.com
```

**Steps:**
1. Go to Render Dashboard
2. Select `coderworld3855-5` service
3. Click "Environment" in left sidebar
4. Click "Add Environment Variable"
5. Add each variable above
6. Click "Save Changes"
7. Service will automatically redeploy

---

#### **ACTION 2: Update Vercel Environment Variables**
**Where:** https://vercel.com/dashboard > Your Project > Settings > Environment Variables

**Add These Variables:**
```env
# Razorpay Public Key (Same as RAZORPAY_KEY_ID in Render)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# Backend URL
VITE_API_BASE_URL=https://coderworld3855-5.onrender.com

# Frontend URL
VITE_APP_URL=https://coder-world3855.vercel.app
```

**Steps:**
1. Go to Vercel Dashboard
2. Select your project (coder-world3855)
3. Go to Settings > Environment Variables
4. Add each variable for "Production" environment
5. Click "Save"
6. Redeploy from Deployments tab

---

#### **ACTION 3: Register Webhook in Backend**
**File to Update:** `src/index.js` or `server.js`

**Add This Code BEFORE Body-Parser Middleware:**
```javascript
// ⚠️ IMPORTANT: Add webhook route BEFORE body-parser
const webhookRoutes = require('./routes/webhookRoutes');
app.use('/webhook', webhookRoutes);

// Then add body-parser middleware AFTER webhook route
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Why:** Webhooks need raw request body, but body-parser consumes it.

**Steps:**
1. Open `src/index.js` or `server.js`
2. Find where you require route files
3. Add: `const webhookRoutes = require('./routes/webhookRoutes');`
4. Find where you have `app.use(express.json())`
5. BEFORE that line, add: `app.use('/webhook', webhookRoutes);`
6. Save file
7. Push to Git
8. Render will auto-deploy

---

#### **ACTION 4: Configure Razorpay Webhook**
**Where:** https://dashboard.razorpay.com/app/webhooks

**Steps:**
1. Login to Razorpay Dashboard
2. Go to Settings > Webhooks
3. Click "Create New Webhook"
4. **Webhook URL:** `https://coderworld3855-5.onrender.com/webhook/razorpay`
5. **Active Events:** Select these:
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid
   - ✅ subscription.charged
6. **Active:** Yes
7. Click "Create Webhook"
8. **COPY THE WEBHOOK SECRET** (shows only once!)
9. Add secret to Render environment variables as `RAZORPAY_WEBHOOK_SECRET`

---

#### **ACTION 5: Update CORS Configuration (If Needed)**
**File:** `src/index.js` or `server.js`

**Verify CORS Allows Vercel Domain:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://coder-world3855.vercel.app',
    'http://localhost:5173' // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🧪 TESTING CHECKLIST

### **After Completing All Actions Above:**

#### **1. Test Configuration Loading**
```javascript
// In browser console on https://coder-world3855.vercel.app
console.log('RAZORPAY_CONFIG:', window.__RAZORPAY_CONFIG__);
// Should show your config with live key
```

#### **2. Test Webhook Endpoint**
```bash
# Visit this URL in browser:
https://coderworld3855-5.onrender.com/webhook/test

# Should return JSON:
{
  "success": true,
  "message": "Webhook endpoint is working",
  "configured": true
}
```

#### **3. Test Payment Flow (Use Test Mode First)**
1. Go to `/premium` page
2. Click "Subscribe Now"
3. Razorpay modal should open
4. Use test card: `4111 1111 1111 1111`
5. Any future date, any CVV
6. Payment should succeed
7. Check user profile - should show "Premium ✨"
8. Check Razorpay dashboard - webhook should show 200 response

#### **4. Verify Database Update**
- Check MongoDB - user document should have:
  ```javascript
  {
    isPremium: true,
    subscriptionType: "monthly" or "yearly",
    paymentId: "pay_xxxxx",
    orderId: "order_xxxxx",
    subscriptionStartDate: Date,
    subscriptionEndDate: Date
  }
  ```

---

## 🐛 TROUBLESHOOTING

### **Issue: "Razorpay SDK failed to load"**
**Cause:** Network issue or ad blocker  
**Solution:** 
- Disable ad blocker
- Check browser console for errors
- Verify `https://checkout.razorpay.com` is accessible

### **Issue: "CORS error"**
**Cause:** CORS not configured for Vercel domain  
**Solution:**
- Update CORS config in `server.js`
- Ensure `CORS_ORIGIN` in Render matches Vercel domain exactly
- Redeploy backend

### **Issue: Webhook not receiving events**
**Cause:** Webhook URL incorrect or service not responding  
**Solution:**
- Test webhook endpoint: `/webhook/test`
- Check Render logs for errors
- Verify webhook URL in Razorpay dashboard
- Ensure webhook secret is set in Render env

### **Issue: Payment succeeds but user not upgraded**
**Cause:** Database update failed or verification error  
**Solution:**
- Check Render logs for errors
- Verify MongoDB connection
- Check webhook logs in Razorpay dashboard
- Manually verify payment in dashboard

### **Issue: Environment variables not working**
**Cause:** Not deployed after setting variables  
**Solution:**
- After adding env vars in Vercel, trigger redeploy
- After adding env vars in Render, service auto-redeploys
- Clear browser cache and hard refresh

---

## 📊 MONITORING

### **What to Monitor After Deployment:**

1. **Render Logs:**
   ```
   ✅ Razorpay credentials: Present
   ✅ Webhook received
   ✅ Payment verified
   ✅ User upgraded to premium
   ```

2. **Razorpay Dashboard:**
   - Go to "Webhooks" tab
   - Check delivery status (should be 200 OK)
   - Click webhook to see event history

3. **Vercel Analytics:**
   - Check if `/premium` page loads
   - Monitor for client-side errors

4. **Database:**
   - Monitor `users` collection
   - Check `isPremium` field updates
   - Verify `paymentId` and `orderId` are stored

---

## 🎉 SUCCESS CRITERIA

You're done when:
- [x] All environment variables set in Render
- [x] All environment variables set in Vercel
- [x] Webhook registered in Razorpay
- [x] Webhook route added to backend
- [x] Test payment succeeds
- [x] User upgraded to premium
- [x] Webhook shows 200 OK in Razorpay
- [x] No CORS errors in browser console

---

## 📝 QUICK REFERENCE

### **Important URLs:**
```
Frontend:    https://coder-world3855.vercel.app
Backend:     https://coderworld3855-5.onrender.com
Webhook:     https://coderworld3855-5.onrender.com/webhook/razorpay
Webhook Test: https://coderworld3855-5.onrender.com/webhook/test
Premium Page: https://coder-world3855.vercel.app/premium
```

### **Razorpay Test Cards:**
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
Name: Any name
```

### **Environment Variable Names:**
```
Backend (Render):
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET
- FRONTEND_URL
- CORS_ORIGIN

Frontend (Vercel):
- VITE_RAZORPAY_KEY_ID
- VITE_API_BASE_URL
- VITE_APP_URL
```

---

## ⚡ NEXT IMMEDIATE STEPS

1. **RIGHT NOW:**
   - Copy this file for reference
   - Get Razorpay live keys from dashboard
   - Add environment variables to Render
   - Add environment variables to Vercel

2. **AFTER DEPLOYMENT:**
   - Test webhook endpoint
   - Create webhook in Razorpay
   - Test payment with test card
   - Verify user upgrade

3. **GO LIVE:**
   - Switch to live Razorpay keys
   - Test with real payment (₹1)
   - Monitor for 24 hours
   - Announce premium features

---

**Need Help?**
- Check `RAZORPAY_UPDATE_GUIDE.md` for detailed steps
- Review Razorpay documentation: https://razorpay.com/docs/
- Check Render logs for errors
- Monitor Vercel deployment logs

**Files Modified:**
1. ✅ `frontend1/src/config/app.config.js` (CREATED)
2. ✅ `src/routes/webhookRoutes.js` (CREATED)
3. ✅ `frontend1/src/pages/PremiumPage.jsx` (UPDATED)
4. ⏳ `src/index.js` or `server.js` (NEEDS UPDATE - Add webhook route)

**External Configs Needed:**
1. ⏳ Render - Environment variables
2. ⏳ Vercel - Environment variables
3. ⏳ Razorpay - Webhook registration

---

**Status:** 🟡 Configuration Ready - Manual Actions Required  
**Next:** Complete the 5 manual actions listed above
