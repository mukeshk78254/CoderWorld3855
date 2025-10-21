# 📧 Email Setup Guide for OTP System

## 🔧 Step 1: Create .env file

Create a file called `.env` in your `LEETCODE` directory with this content:

```env
# Database Configuration
DB_CONNECT_STRING=mongodb://localhost:27017/coderworld

# JWT Configuration
JWT_KEY=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=production

# Email Configuration (REQUIRED for OTP)
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Redis Configuration (optional)
REDIS_PASS=your_redis_password_here

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/user/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:5000/user/auth/facebook/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:5000/user/auth/github/callback

# Client URL
CLIENT_URL=http://localhost:5173
```

## 📧 Step 2: Set up Gmail App Password

### 1. Enable 2-Factor Authentication
- Go to [myaccount.google.com](https://myaccount.google.com)
- Click **Security** in the left sidebar
- Under "Signing in to Google", click **2-Step Verification**
- Follow the steps to enable 2FA

### 2. Generate App Password
- Go back to **Security** → **2-Step Verification**
- Scroll down to **App passwords**
- Click **App passwords**
- Select **Mail** from the dropdown
- Select **Other (custom name)** and type "CoderWorld"
- Click **Generate**
- **Copy the 16-character password** (format: `abcd efgh ijkl mnop`)

### 3. Update .env file
Replace these lines in your `.env` file:
```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 🚀 Step 3: Test the Setup

1. **Start your backend:**
   ```bash
   cd LEETCODE
   npm run dev
   ```

2. **Check console output:**
   You should see:
   ```
   ✅ Email transporter is ready to send emails
   📧 Sender email: your-email@gmail.com
   ```

3. **Test signup:**
   - Go to signup page
   - Fill the form with a valid email
   - Check your email for the OTP

## 🔍 Troubleshooting

### If you see "Email transporter verification failed":
1. **Check email address** - Make sure it's correct
2. **Check App Password** - Use 16-character App Password, not regular password
3. **Enable 2FA** - 2-Factor Authentication must be enabled
4. **Check .env file** - Make sure there are no extra spaces or quotes

### Common Error Messages:
- `EAUTH` - Wrong email or password
- `ECONNECTION` - Network/connection issue
- `550` - Invalid email address

### Example Working .env:
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## ✅ Success Indicators

When working correctly, you'll see:
```
✅ Email transporter is ready to send emails
📧 Sender email: your-email@gmail.com
📧 Attempting to send OTP email to: user@example.com
✅ OTP email sent successfully to user@example.com
📧 Message ID: <message-id>
```

## 🎯 Final Result

- OTP emails will be sent to actual email addresses
- Beautiful HTML email template with CoderWorld branding
- 6-digit OTP code clearly displayed
- 10-minute expiration timer
- Professional email design

















