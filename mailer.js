const nodemailer = require('nodemailer')

const EMAIL_CONFIG = {
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || 'sahilalvi769@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'qvce jjnl pmdi lzze',
  FROM_EMAIL: process.env.FROM_EMAIL || 'sahilalvi769@gmail.com',
  FROM_NAME: process.env.FROM_NAME || 'Vidyasaar Institute'
}

const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.SMTP_HOST,
  port: EMAIL_CONFIG.SMTP_PORT,
  secure: EMAIL_CONFIG.SMTP_PORT == 465,
  auth: {
    user: EMAIL_CONFIG.SMTP_USER,
    pass: EMAIL_CONFIG.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
})

transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error.message)
  } else {
    console.log('Email service ready')
  }
})

async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: `"${EMAIL_CONFIG.FROM_NAME}" <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: email,
      subject: 'Your Verification Code (OTP)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Email Verification</h1>
              <p>Vidyasaar Institute</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested a verification code to complete your registration. Please use the OTP below:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #666;">This code expires in 5 minutes</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Our team will never ask for your OTP.
              </div>
              
              <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
              
              <p>Best regards,<br><strong>Vidyasaar Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Vidyasaar Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Email Verification - Vidyasaar Institute
        
        Hello,
        
        You requested a verification code to complete your registration.
        
        Your OTP code is: ${otp}
        
        This code expires in 5 minutes.
        
        Security Notice: Never share this code with anyone. Our team will never ask for your OTP.
        
        If you didn't request this code, please ignore this email.
        
        Best regards,
        Vidyasaar Team
      `
    }

    const info = await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'OTP email sent successfully'
    }
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

async function sendWelcomeEmail(email, instituteName) {
  try {
    const mailOptions = {
      from: `"${EMAIL_CONFIG.FROM_NAME}" <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: email,
      subject: `Welcome to Vidyasaar - ${instituteName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Vidyasaar!</h1>
            </div>
            <div class="content">
              <p>Hello ${instituteName},</p>
              <p>Congratulations! Your institute has been successfully registered on Vidyasaar - The Intelligent Institute Ecosystem.</p>
              
              <h3>What's Next?</h3>
              <ul>
                <li>Complete your institute profile</li>
                <li>Add teachers and students</li>
                <li>Set up your courses and schedules</li>
                <li>Explore our AI-powered features</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="https://admin-site-08sb.onrender.com/" class="button">Get Started</a>
              </div>
              
              <p>If you have any questions, our support team is here to help!</p>
              
              <p>Best regards,<br><strong>Vidyasaar Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vidyasaar Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Vidyasaar!
        
        Hello ${instituteName},
        
        Congratulations! Your institute has been successfully registered on Vidyasaar - The Intelligent Institute Ecosystem.
        
        What's Next?
        - Complete your institute profile
        - Add teachers and students
        - Set up your courses and schedules
        - Explore our AI-powered features
        
        Visit http://localhost:3000/ to get started.
        
        If you have any questions, our support team is here to help!
        
        Best regards,
        Vidyasaar Team
      `
    }

    const info = await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Welcome email sent successfully'
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: `"${EMAIL_CONFIG.FROM_NAME}" <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Password Reset</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request a password reset, please ignore this email.
              </div>
              
              <p>Best regards,<br><strong>Vidyasaar Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vidyasaar Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset - Vidyasaar Institute
        
        Hello,
        
        We received a request to reset your password.
        
        Click this link to reset your password: ${resetLink}
        
        This link expires in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        
        Best regards,
        Vidyasaar Team
      `
    }

    const info = await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Password reset email sent successfully'
    }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

async function sendAdminApprovalEmail(userEmail, approvalToken) {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const approveLink = `${baseUrl}/api/approve/${approvalToken}`
    const rejectLink = `${baseUrl}/api/reject/${approvalToken}`
    
  const adminEmail = process.env.ADMIN_EMAIL || 'sahilalvi769@gmail.com'
    
    const mailOptions = {
      from: `"${EMAIL_CONFIG.FROM_NAME}" <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: adminEmail,
      subject: 'New User Registration Approval Required',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .user-info { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
            .buttons { text-align: center; margin: 30px 0; }
            .button { display: inline-block; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 10px; font-weight: bold; font-size: 16px; }
            .approve { background: #66f86bff; color:  #fff;}
            .reject { background: #f37168ff; color: #fff;}
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Registration Request</h1>
              <p>Vidyasaar Institute</p>
            </div>
            <div class="content">
              <p>Hello Admin,</p>
              <p>A new user has completed email verification and is requesting access to the system.</p>
              
              <div class="user-info">
                <strong>Email:</strong> ${userEmail}<br>
                <strong>Registration Time:</strong> ${new Date().toLocaleString()}<br>
                <strong>Status:</strong> Pending Approval
              </div>
              
              <p>Please review and approve or reject this registration request:</p>
              
              <div class="buttons">
                <a href="${approveLink}" class="button approve">✅ Approve User</a>
                <a href="${rejectLink}" class="button reject">❌ Reject User</a>
              </div>
              
              <p style="font-size: 12px; color: #666;">This action will determine whether the user can access the Vidyasaar system.</p>
              
              <p>Best regards,<br><strong>Vidyasaar System</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated notification.</p>
              <p>&copy; ${new Date().getFullYear()} Vidyasaar Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Registration Request - Vidyasaar Institute
        
        Hello Admin,
        
        A new user has completed email verification and is requesting access.
        
        Email: ${userEmail}
        Registration Time: ${new Date().toLocaleString()}
        Status: Pending Approval
        
        Approve: ${approveLink}
        Reject: ${rejectLink}
        
        Best regards,
        Vidyasaar System
      `
    }

    const info = await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Admin approval email sent'
    }
  } catch (error) {
    console.error('Error sending admin approval email:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAdminApprovalEmail,
  transporter,
  EMAIL_CONFIG
}
