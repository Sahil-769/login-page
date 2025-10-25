# Vidyasaar Login System - Render Deployment Guide

## 📋 Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Gmail App Password for email functionality

## 🚀 Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin sahil
```

### 2. Create New Web Service on Render
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `vidyasar/vidyasar-web`
4. Configure the service:
   - **Name**: vidyasaar-login (or your preferred name)
   - **Branch**: sahil
   - **Root Directory**: Leave empty (or specify if in subdirectory)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 3. Set Environment Variables
In Render dashboard, go to "Environment" tab and add:

```
PORT=3000
APP_URL=https://your-app-name.onrender.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sahilalvi769@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=sahilalvi769@gmail.com
FROM_NAME=Vidyasaar Institute
ADMIN_EMAIL=sahilalvi769@gmail.com
```

**Important**: Replace `your-app-name` with your actual Render app name and `your-gmail-app-password` with your Gmail App Password.

### 4. Generate Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with `sahilalvi769@gmail.com`
3. Create new app password for "Mail"
4. Copy the 16-character password
5. Paste it in Render environment variable `SMTP_PASS`

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment (3-5 minutes)
- Your app will be live at: `https://your-app-name.onrender.com`

## 🔧 Post-Deployment
- Update `APP_URL` in Render environment variables with your actual URL
- Test all login flows:
  - Student: `student@123` / `123456`
  - Teacher: `teacher@123` / `123456`
  - Institute: Register → OTP → Admin Approval

## 📝 Notes
- Free tier on Render may spin down after inactivity
- First request after inactivity may take 30-60 seconds
- Check Render logs for any errors

## 🔗 External Sites
- Student Site: https://student-site-mpgh.onrender.com/
- Teacher Site: https://teacher-site.onrender.com/
- Admin Site: https://admin-site-08sb.onrender.com/
