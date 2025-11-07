# 🚀 Razorpay Integration Update Guide for Live Domains

**Frontend Domain:** https://coder-world3855.vercel.app/  
**Backend Domain:** https://coderworld3855-5.onrender.com

---

## 📋 **STEP-BY-STEP IMPLEMENTATION CHECKLIST**

### ✅ **STEP 1: Create Environment Configuration File (Frontend)**
**Location:** `LEETCODE/frontend1/src/config/app.config.js`

**Status:** ⏳ TO BE CREATED

This file will automatically detect if you're in development or production and use the correct URLs.

---

### ✅ **STEP 2: Update Backend Environment Variables**
**Location:** Render Dashboard > Environment Variables

**Status:** ⏳ TO BE UPDATED

**Action Required:**
1. Go to: https://dashboard.render.com
2. Select your `coderworld3855-5` service
3. Go to "Environment" tab
4. Add/Update these variables:

```env
# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key_here

# Webhook Secret (Get from Razorpay Dashboard)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Frontend URL
FRONTEND_URL=https://coder-world3855.vercel.app

# CORS Origin
CORS_ORIGIN=https://coder-world3855.vercel.app
```

---

### ✅ **STEP 3: Update Frontend Environment Variables**
**Location:** Vercel Dashboard > Environment Variables

**Status:** ⏳ TO BE UPDATED

**Action Required:**
1. Go to: https://vercel.com/dashboard
2. Select your `coder-world3855` project
3. Go to Settings > Environment Variables
4. Add these variables:

```env
# Razorpay Public Key (Live)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# Backend API URL
VITE_API_BASE_URL=https://coderworld3855-5.onrender.com

# Frontend URL
VITE_APP_URL=https://coder-world3855.vercel.app
```

---

### ✅ **STEP 4: Create Webhook Handler (Backend)**
**Location:** `LEETCODE/src/routes/webhookRoutes.js`

**Status:** ⏳ TO BE CREATED

This will receive real-time payment updates from Razorpay.

---

### ✅ **STEP 5: Register Webhook in Backend**
**Location:** `LEETCODE/src/index.js` or `server.js`

**Status:** ⏳ TO BE UPDATED

Add webhook route BEFORE body-parser middleware.

---

### ✅ **STEP 6: Configure Razorpay Dashboard**
**Location:** https://dashboard.razorpay.com

**Status:** ⏳ TO BE CONFIGURED

**Action Required:**
1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Click "Add New Webhook"
3. Enter URL: `https://coderworld3855-5.onrender.com/webhook/razorpay`
4. Select Events:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `order.paid`
   - ✅ `subscription.charged`
5. Set Active: **Yes**
6. Copy the **Webhook Secret** and add to Render environment variables

---

### ✅ **STEP 7: Update PremiumPage Component**
**Location:** `LEETCODE/frontend1/src/pages/PremiumPage.jsx`

**Status:** ⏳ TO BE UPDATED

Update Razorpay options to use dynamic configuration.

---

### ✅ **STEP 8: Update Payment Controller**
**Location:** `LEETCODE/src/controllers/paymentcontroller.js`

**Status:** ✅ ALREADY GOOD (No changes needed)

Your existing payment controller is already well-structured.

---

### ✅ **STEP 9: Update CORS Configuration**
**Location:** `LEETCODE/src/index.js` or `server.js`

**Status:** ⏳ TO BE VERIFIED

Ensure CORS allows requests from Vercel domain.

---

### ✅ **STEP 10: Test Payment Flow**
**Status:** ⏳ TO BE TESTED AFTER DEPLOYMENT

**Test Checklist:**
- [ ] Payment initiation from `/premium` page
- [ ] Razorpay modal opens correctly
- [ ] Test payment succeeds (use test card)
- [ ] User premium status updates
- [ ] Webhook receives payment confirmation
- [ ] Email notification sent (if configured)
- [ ] Transaction appears in `/transactions` page

---

## 🎯 **SUMMARY OF CHANGES**

### **Files to CREATE:**
1. ✅ `frontend1/src/config/app.config.js` - Environment configuration
2. ✅ `src/routes/webhookRoutes.js` - Webhook handler
3. ✅ `RAZORPAY_UPDATE_GUIDE.md` - This guide (CREATED)

### **Files to UPDATE:**
1. ⏳ `frontend1/src/pages/PremiumPage.jsx` - Use dynamic config
2. ⏳ `src/index.js` - Add webhook route
3. ⏳ Backend `.env` (Render) - Add environment variables
4. ⏳ Frontend `.env` (Vercel) - Add environment variables

### **External Configurations:**
1. ⏳ Razorpay Dashboard - Register webhook
2. ⏳ Vercel Dashboard - Add environment variables
3. ⏳ Render Dashboard - Add environment variables

---

## ⚠️ **IMPORTANT NOTES**

1. **DO NOT** use test keys in production
2. **DO** test with Razorpay test mode first
3. **DO** verify webhook signature for security
4. **DO** log webhook events for debugging
5. **DO NOT** commit `.env` files to Git

---

## 🔍 **VERIFICATION STEPS**

After deployment, verify:

1. **Environment Variables:**
   ```bash
   # In Render dashboard, check logs
   # You should see:
   ✅ Razorpay credentials: Present
   ✅ Webhook secret: Present
   ✅ CORS origin: https://coder-world3855.vercel.app
   ```

2. **API Connectivity:**
   ```bash
   # Test from browser console on Vercel site:
   fetch('https://coderworld3855-5.onrender.com/payment/subscription-status', {
     headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
   }).then(r => r.json()).then(console.log)
   ```

3. **Webhook Delivery:**
   - Check Razorpay Dashboard > Webhooks > Logs
   - Should see successful 200 responses

---

## 🆘 **TROUBLESHOOTING**

### **Issue: Payment button not working**
**Solution:** Check browser console for errors. Verify VITE_RAZORPAY_KEY_ID is set in Vercel.

### **Issue: "CORS error"**
**Solution:** Verify CORS_ORIGIN in Render matches Vercel domain exactly.

### **Issue: Webhook not receiving events**
**Solution:** Check webhook URL is correct and service is running. Check Render logs.

### **Issue: Payment succeeds but user not upgraded**
**Solution:** Check backend logs for verification errors. Verify database connection.

---

## 📞 **NEXT STEPS**

1. Create the files marked as "TO BE CREATED" above
2. Update environment variables in Render and Vercel
3. Deploy changes
4. Test with Razorpay test mode
5. Switch to live mode and test with real payment
6. Monitor webhook logs for 24 hours

---

**Last Updated:** November 7, 2025  
**Status:** Configuration Guide Created ✅  
**Next Action:** Create configuration files
