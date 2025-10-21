# Email Configuration Setup

## For Production (Real Email Sending)

1. **Create a Gmail App Password:**
   - Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password for "Mail"
   - Copy the 16-character password

2. **Update the .env file:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

3. **Restart the server** after updating the .env file

## For Development (Fallback Mode)

If email credentials are not configured, the system will:
- Log the OTP to the console
- Return the OTP in the API response
- Display the OTP on the frontend for easy testing

## Testing the Flow

1. **Signup Flow:**
   - Go to `/signup`
   - Fill in the form and click "Start Your Journey"
   - You'll be redirected to the OTP verification page

2. **OTP Verification:**
   - In development mode: OTP will be auto-filled and displayed
   - In production mode: Check your email for the OTP
   - Enter the OTP to complete registration

## Troubleshooting

- **OTP not received:** Check console logs for the OTP in development mode
- **Email sending fails:** Verify your Gmail App Password is correct
- **Transparent page:** Fixed with improved styling and background colors


