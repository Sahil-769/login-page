const sgMail = require('@sendgrid/mail')

const USE_SENDGRID = process.env.USE_SENDGRID === 'true'

if (USE_SENDGRID) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const EMAIL_CONFIG = {
  FROM_EMAIL: process.env.FROM_EMAIL || 'sahilalvi769@gmail.com',
  FROM_NAME: process.env.FROM_NAME || 'Vidyasaar Institute'
}

async function sendOTPEmail(email, otp) {
  try {
    const msg = {
      to: email,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
      subject: 'Your OTP for Vidyasaar Registration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vidyasaar Institute</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>Your One-Time Password (OTP) for registration is:</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              <p><strong>This OTP is valid for 5 minutes.</strong></p>
              <div class="warning">
                ⚠️ <strong>Security Notice:</strong> Never share this OTP with anyone. Vidyasaar staff will never ask for your OTP.
              </div>
              <p>If you didn't request this OTP, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vidyasaar Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your OTP for Vidyasaar registration is: ${otp}. This OTP is valid for 5 minutes.`
    }

    await sgMail.send(msg)
    console.log(`OTP email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return { success: false, error: error.message }
  }
}

async function sendWelcomeEmail(email, instituteName) {
  try {
    const msg = {
      to: email,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
      subject: 'Welcome to Vidyasaar Institute',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Vidyasaar!</h1>
            </div>
            <div class="content">
              <h2>Hello ${instituteName},</h2>
              <p>Congratulations! Your institute has been successfully registered on Vidyasaar.</p>
              <div style="text-align: center;">
                <a href="https://admin-site-08sb.onrender.com/" class="button">Get Started</a>
              </div>
              <p>Best regards,<br><strong>Vidyasaar Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Vidyasaar Institute. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await sgMail.send(msg)
    console.log(`Welcome email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error.message }
  }
}

async function sendAdminApprovalEmail(userEmail, approvalToken) {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const approveLink = `${baseUrl}/api/approve/${approvalToken}`
    const rejectLink = `${baseUrl}/api/reject/${approvalToken}`
    const adminEmail = process.env.ADMIN_EMAIL || 'sahilalvi769@gmail.com'
    
    const msg = {
      to: adminEmail,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
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
            .approve { background: #66f86bff; color: #fff;}
            .reject { background: #f37168ff; color: #fff;}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏳ Approval Required</h1>
            </div>
            <div class="content">
              <h2>New Institute Registration</h2>
              <div class="user-info">
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Status:</strong> Pending Approval</p>
              </div>
              <p>A new institute has completed registration and is awaiting your approval.</p>
              <div class="buttons">
                <a href="${approveLink}" class="button approve">✅ Approve</a>
                <a href="${rejectLink}" class="button reject">❌ Reject</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await sgMail.send(msg)
    console.log(`Admin approval email sent for ${userEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending admin approval email:', error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendAdminApprovalEmail,
  EMAIL_CONFIG
}
