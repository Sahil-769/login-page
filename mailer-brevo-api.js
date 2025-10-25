const brevo = require('@getbrevo/brevo')

const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

const EMAIL_CONFIG = {
  FROM_EMAIL: process.env.FROM_EMAIL || 'sahilalvi769@gmail.com',
  FROM_NAME: process.env.FROM_NAME || 'Vidyasaar Institute',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'sahilalvi769@gmail.com'
}

async function sendOTPEmail(email, otp) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    
    sendSmtpEmail.sender = { 
      name: EMAIL_CONFIG.FROM_NAME, 
      email: EMAIL_CONFIG.FROM_EMAIL 
    }
    sendSmtpEmail.to = [{ email: email }]
    sendSmtpEmail.subject = 'Your Verification Code (OTP)'
    sendSmtpEmail.htmlContent = `
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
    `
    sendSmtpEmail.textContent = `
      Email Verification - Vidyasaar Institute
      
      Hello,
      
      You requested a verification code to complete your registration.
      
      Your OTP code is: ${otp}
      
      This code expires in 5 minutes.
      
      Security Notice: Never share this code with anyone.
      
      Best regards,
      Vidyasaar Team
    `

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    
    return {
      success: true,
      messageId: data.messageId,
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

async function sendAdminApprovalEmail(userEmail, approvalToken) {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const approveLink = `${baseUrl}/api/approve/${approvalToken}`
    const rejectLink = `${baseUrl}/api/reject/${approvalToken}`
    
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    
    sendSmtpEmail.sender = { 
      name: EMAIL_CONFIG.FROM_NAME, 
      email: EMAIL_CONFIG.FROM_EMAIL 
    }
    sendSmtpEmail.to = [{ email: EMAIL_CONFIG.ADMIN_EMAIL }]
    sendSmtpEmail.subject = 'New User Registration Approval Required'
    sendSmtpEmail.htmlContent = `
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
          .approve { background: #66f86bff; color: #fff; }
          .reject { background: #f37168ff; color: #fff; }
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
    `
    sendSmtpEmail.textContent = `
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

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    
    return {
      success: true,
      messageId: data.messageId,
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
  sendAdminApprovalEmail,
  EMAIL_CONFIG
}
