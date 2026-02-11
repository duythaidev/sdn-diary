# Environment Configuration for Password Reset

## Required Environment Variables

Add the following variables to your `.env` file in the backend directory:

```env
# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL (for reset link)
FRONTEND_URL=http://localhost:5173
```

## Email Service Options

### Option 1: Gmail (Recommended for Development)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password
4. Use these settings:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### Option 2: SendGrid

1. Sign up at https://sendgrid.com
2. Create an API key
3. Use these settings:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   ```

### Option 3: Mailgun

1. Sign up at https://mailgun.com
2. Get your SMTP credentials
3. Use these settings:
   ```env
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=your-mailgun-username
   EMAIL_PASS=your-mailgun-password
   ```

## Testing

After configuration, restart your backend server to load the new environment variables.
