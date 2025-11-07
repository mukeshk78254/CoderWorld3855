# 🚀 RAZORPAY INTEGRATION - QUICK START CHECKLIST

## ✅ WHAT'S DONE (Automatically)

- ✅ **app.config.js** created - Handles environment detection
- ✅ **webhookRoutes.js** created - Webhook handler
- ✅ **PremiumPage.jsx** updated - Uses new config
- ✅ **Documentation** created - Complete guides

---

## 🔴 YOUR 5-STEP TODO LIST

### **STEP 1: Get Razorpay Keys** (5 minutes)
📍 **Go to:** https://dashboard.razorpay.com/app/keys

1. Login to Razorpay Dashboard
2. Click "Settings" → "API Keys"
3. **For Testing:** Use "Test Mode" keys
4. **For Live:** Generate "Live Mode" keys
5. **Copy:**
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret (click "Generate Secret" if needed)

---

### **STEP 2: Add Keys to Render** (3 minutes)
📍 **Go to:** https://dashboard.render.com

1. Select service: **coderworld3855-5**
2. Click **"Environment"** in sidebar
3. Click **"Add Environment Variable"**
4. Add these 5 variables:

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
FRONTEND_URL=https://coder-world3855.vercel.app
CORS_ORIGIN=https://coder-world3855.vercel.app
BACKEND_URL=https://coderworld3855-5.onrender.com
```

5. Click **"Save Changes"**
6. Wait for auto-redeploy (2-3 mins)

---

### **STEP 3: Add Keys to Vercel** (3 minutes)
📍 **Go to:** https://vercel.com/dashboard

1. Select project: **coder-world3855**
2. Click **Settings** → **Environment Variables**
3. Add these 3 variables (Environment: **Production**):

```env
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
VITE_API_BASE_URL=https://coderworld3855-5.onrender.com
VITE_APP_URL=https://coder-world3855.vercel.app
```

4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"Redeploy"** on latest deployment

---

### **STEP 4: Add Webhook Route to Backend** (2 minutes)
📍 **File:** `LEETCODE/src/index.js` (or `server.js`)

**Find this line:**
```javascript
app.use(express.json());
```

**Add BEFORE it:**
```javascript
// ⚠️ IMPORTANT: Webhook route MUST be before express.json()
const webhookRoutes = require('./routes/webhookRoutes');
app.use('/webhook', webhookRoutes);

// Now add body-parser
app.use(express.json());
```

**Then:**
1. Save file
2. Git commit: `git add . && git commit -m "feat: Add Razorpay webhook handler"`
3. Git push: `git push origin main`
4. Render will auto-deploy

---

### **STEP 5: Create Webhook in Razorpay** (3 minutes)
📍 **Go to:** https://dashboard.razorpay.com/app/webhooks

1. Click **"Create New Webhook"**
2. **Webhook URL:** `https://coderworld3855-5.onrender.com/webhook/razorpay`
3. **Select Events:**
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid
4. **Active:** ✅ Yes
5. Click **"Create Webhook"**
6. **COPY THE SECRET** (shows only once!)
7. Go back to Render dashboard
8. Add new env var: `RAZORPAY_WEBHOOK_SECRET=[paste secret here]`
9. Save and wait for redeploy

---

## 🧪 TESTING (10 minutes)

### **Test 1: Check Configuration**
```
Visit: https://coderworld3855-5.onrender.com/webhook/test

Expected Response:
{
  "success": true,
  "message": "Webhook endpoint is working",
  "configured": true
}
```

### **Test 2: Try Payment (Test Mode)**
1. Go to: https://coder-world3855.vercel.app/premium
2. Login if needed
3. Click "Subscribe Now" on Monthly plan
4. Use test card: **4111 1111 1111 1111**
5. Expiry: Any future date
6. CVV: Any 3 digits
7. Complete payment
8. Should see: "Payment verified successfully! Welcome to CoderWorld Premium! 🎉"
9. Check profile - should show "Premium ✨"

### **Test 3: Check Webhook Logs**
1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Click on your webhook
3. Check "Recent Deliveries" tab
4. Should see 200 OK responses

---

## ✅ SUCCESS CHECKLIST

- [ ] Razorpay keys added to Render
- [ ] Razorpay keys added to Vercel
- [ ] Webhook route added to backend
- [ ] Backend redeployed successfully
- [ ] Frontend redeployed successfully
- [ ] Webhook created in Razorpay Dashboard
- [ ] Webhook secret added to Render
- [ ] Test endpoint returns success
- [ ] Test payment succeeds
- [ ] User upgraded to premium
- [ ] Webhook shows 200 OK

---

## 🐛 Quick Troubleshooting

**Problem:** "Razorpay SDK failed to load"  
**Solution:** Check if `VITE_RAZORPAY_KEY_ID` is set in Vercel. Redeploy if just added.

**Problem:** CORS error  
**Solution:** Verify `CORS_ORIGIN` in Render matches `https://coder-world3855.vercel.app` exactly.

**Problem:** Webhook not receiving events  
**Solution:** Test webhook endpoint first. Check Render logs for errors.

**Problem:** Payment succeeds but user not upgraded  
**Solution:** Check Render logs. Look for "Payment verified" message. Check database connection.

---

## 📞 HELP NEEDED?

**Check These Files:**
- `RAZORPAY_COMPLETE_ACTION_PLAN.md` - Detailed steps
- `RAZORPAY_UPDATE_GUIDE.md` - Full documentation
- Render Logs - Check for errors
- Razorpay Dashboard - Webhook delivery logs

**Test URLs:**
- Frontend: https://coder-world3855.vercel.app
- Backend: https://coderworld3855-5.onrender.com
- Webhook: https://coderworld3855-5.onrender.com/webhook/razorpay
- Test: https://coderworld3855-5.onrender.com/webhook/test

---

## ⏱️ TIME ESTIMATE

- **Total Time:** ~20 minutes
- **Step 1:** 5 min (Get keys)
- **Step 2:** 3 min (Render config)
- **Step 3:** 3 min (Vercel config)
- **Step 4:** 2 min (Add webhook route)
- **Step 5:** 3 min (Create webhook)
- **Testing:** 10 min (Verify everything works)

---

## 🎯 START HERE

1. **RIGHT NOW:** Get Razorpay keys (Step 1)
2. **THEN:** Add to Render (Step 2)
3. **THEN:** Add to Vercel (Step 3)
4. **THEN:** Update backend code (Step 4)
5. **FINALLY:** Create webhook (Step 5)
6. **TEST:** Run all tests

**Status:** 🟢 Ready to implement  
**Next:** Start with Step 1 above ☝️
