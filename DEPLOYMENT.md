# 🚀 Production Deployment Guide

## Render Deployment Steps

### 1. Get Brevo API Key

⚠️ **IMPORTANT**: We're using Brevo API (not SMTP) because Render blocks SMTP ports.

1. Go to [Brevo Dashboard](https://app.brevo.com)
2. Click **Settings** → **SMTP & API**
3. Click **API Keys** tab
4. Click **Generate a new API key**
5. Name it: `Production API`
6. Copy the API key (starts with `xkeysib-`)

### 2. Environment Variables Setup

Go to your Render dashboard and add these environment variables:

```env
BREVO_API_KEY=your-brevo-api-key-here
FROM_EMAIL=sahilalvi769@gmail.com
FROM_NAME=Vidyasaar Institute
ADMIN_EMAIL=sahilalvi769@gmail.com
APP_URL=https://login-page-inwt.onrender.com
NODE_ENV=production
PORT=3000
```

**Note**: Replace `your-brevo-api-key-here` with your actual Brevo API key from step 1.

### 3. Verify Brevo Sender Email

⚠️ **CRITICAL STEP** - Without this, emails will NOT work:

1. Go to [Brevo Dashboard](https://app.brevo.com)
2. Navigate to **Settings** → **Senders, Domain & Dedicated IP**
3. Click **Add a New Sender**
4. Add email: `sahilalvi769@gmail.com`
5. Check your Gmail for verification email from Brevo
6. Click the verification link

### 4. Deploy

1. Push code to GitHub (already done ✓)
2. Render will auto-deploy from your repository
3. Check deployment logs for any errors

### 5. Test Production

After deployment, test the complete flow:

1. **OTP Generation**: Register with an email
2. **Email Delivery**: Check if OTP email arrives
3. **OTP Verification**: Enter the OTP code
4. **Admin Approval Email**: Check admin email (sahilalvi769@gmail.com)
5. **Approval Flow**: Click approve/reject button
6. **Login Success**: Verify redirect to dashboard

## Production Features

✅ **Email OTP System** with Brevo SMTP (300 emails/day)  
✅ **Two-Step Verification**: OTP → Admin Approval → Login  
✅ **Rate Limiting**: 30-second cooldown between OTP requests  
✅ **Session Management**: 5-minute OTP expiry  
✅ **Admin Approval**: Email with approve/reject buttons  
✅ **Mobile Responsive**: Works on all screen sizes  
✅ **Docker Ready**: Optimized production build  

## API Endpoints

- `POST /api/send-otp` - Generate and send OTP
- `POST /api/verify-otp` - Verify OTP and trigger admin approval
- `GET /api/check-approval/:token` - Check approval status
- `GET /api/approve/:token` - Approve user registration
- `GET /api/reject/:token` - Reject user registration

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with your settings
cp .env.example .env

# Run development server
npm run dev
```

## Security Notes

🔒 `.env` file is gitignored (contains actual SMTP key)  
🔒 `.env.example` uses placeholders only  
🔒 Secrets stored in Render environment variables  
🔒 GitHub secret scanning enabled  

## Support

For issues, check:
- Render deployment logs
- Brevo email dashboard
- Browser console for frontend errors

---

**Status**: ✅ Production Ready  
**Last Updated**: October 25, 2025  
**Deployed**: https://login-page-inwt.onrender.com
