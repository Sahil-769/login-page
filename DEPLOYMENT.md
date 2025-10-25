# 🚀 Production Deployment Guide

## Render Deployment Steps

### 1. Environment Variables Setup

Go to your Render dashboard and add these environment variables:

```env
USE_SENDGRID=false
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=9a07ac001@smtp-brevo.com
SMTP_PASS=your-brevo-smtp-key-from-dashboard
FROM_EMAIL=sahilalvi769@gmail.com
FROM_NAME=Vidyasaar Institute
ADMIN_EMAIL=sahilalvi769@gmail.com
APP_URL=https://login-page-inwt.onrender.com
NODE_ENV=production
PORT=3000
```

**Note**: Replace `your-brevo-smtp-key-from-dashboard` with your actual Brevo SMTP key from your Brevo account settings.

### 2. Verify Brevo Sender Email

⚠️ **CRITICAL STEP** - Without this, emails will NOT work:

1. Go to [Brevo Dashboard](https://app.brevo.com)
2. Navigate to **Settings** → **Senders, Domain & Dedicated IP**
3. Click **Add a New Sender**
4. Add email: `sahilalvi769@gmail.com`
5. Check your Gmail for verification email from Brevo
6. Click the verification link

### 3. Deploy

1. Push code to GitHub (already done ✓)
2. Render will auto-deploy from your repository
3. Check deployment logs for any errors

### 4. Test Production

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
