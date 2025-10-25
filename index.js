require('dotenv').config()
const express = require('express')
const path = require('path')

const mailer = require('./mailer-brevo-api')

const { sendOTPEmail, sendAdminApprovalEmail } = mailer
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessions = new Map()
const pendingApprovals = new Map()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sahilalvi769@gmail.com'

app.use(express.static(path.join(__dirname, 'src')))
app.use(express.static(path.join(__dirname, 'Loginpage')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/login.html'))
})

app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' })
    }
    
    const sessionKey = `otp_${email}`
    const existingSession = sessions.get(sessionKey)
    
    if (existingSession && existingSession.sentAt) {
      const timeSinceLastSend = Date.now() - existingSession.sentAt
      if (timeSinceLastSend < 30000) {
        return res.status(429).json({ ok: false, error: 'Wait before requesting another OTP' })
      }
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    sessions.set(sessionKey, {
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      sentAt: Date.now()
    })
    
    const result = await sendOTPEmail(email, otp)
    
    if (!result.success) {
      return res.status(500).json({ ok: false, error: 'Failed to send email' })
    }
    
    res.json({ ok: true, message: 'OTP sent' })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({ ok: false, error: 'Failed to send email' })
  }
})

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    
    if (!email || !otp) {
      return res.status(400).json({ ok: false, error: 'Email and OTP are required' })
    }
    
    const sessionKey = `otp_${email}`
    const session = sessions.get(sessionKey)
    
    if (!session) {
      return res.status(400).json({ ok: false, error: 'No OTP requested' })
    }
    
    if (session.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ ok: false, error: 'Email mismatch' })
    }
    
    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionKey)
      return res.status(400).json({ ok: false, error: 'OTP expired' })
    }
    
    if (session.attempts >= 5) {
      sessions.delete(sessionKey)
      return res.status(429).json({ ok: false, error: 'Too many attempts' })
    }
    
    if (session.otp === otp.trim()) {
      sessions.delete(sessionKey)
      
      const approvalToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
      
      pendingApprovals.set(approvalToken, {
        email: email,
        timestamp: Date.now(),
        status: 'pending'
      })
      
      const approvalResult = await sendAdminApprovalEmail(email, approvalToken)
      
      if (!approvalResult.success) {
        console.error('Failed to send admin approval email')
      }
      
      return res.json({ 
        ok: true, 
        message: 'OTP verified',
        approvalToken: approvalToken,
        awaitingApproval: true
      })
    } else {
      session.attempts++
      sessions.set(sessionKey, session)
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid OTP',
        attempts: session.attempts 
      })
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
})

app.get('/api/check-approval/:token', (req, res) => {
  const { token } = req.params
  const approval = pendingApprovals.get(token)
  
  if (!approval) {
    return res.status(404).json({ ok: false, error: 'Invalid approval token' })
  }
  
  res.json({ 
    ok: true, 
    status: approval.status,
    email: approval.email 
  })
})

app.get('/api/approve/:token', async (req, res) => {
  const { token } = req.params
  const approval = pendingApprovals.get(token)
  
  if (!approval) {
    return res.status(404).send('<h1>Invalid or expired approval link</h1>')
  }
  
  if (approval.status !== 'pending') {
    return res.send(`<h1>This request has already been ${approval.status}</h1>`)
  }
  
  approval.status = 'approved'
  pendingApprovals.set(token, approval)
  
  await sendWelcomeEmail(approval.email, 'New Institute')
  
  res.send(`
    <html>
      <head>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
          .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #4CAF50; }
          .email { color: #666; font-size: 18px; margin: 20px 0; }
        </style>
        <script>
          setTimeout(function() {
            window.location.href = '${process.env.APP_URL || 'http://localhost:3000'}';
          }, 3000);
        </script>
      </head>
      <body>
        <div class="container">
          <h1>✅ User Approved!</h1>
          <p class="email">${approval.email}</p>
          <p>The user has been notified and can now access the system.</p>
          <p style="color: #666; margin-top: 20px;">Redirecting to login page in 3 seconds...</p>
        </div>
      </body>
    </html>
  `)
})

app.get('/api/reject/:token', (req, res) => {
  const { token } = req.params
  const approval = pendingApprovals.get(token)
  
  if (!approval) {
    return res.status(404).send('<h1>Invalid or expired approval link</h1>')
  }
  
  if (approval.status !== 'pending') {
    return res.send(`<h1>This request has already been ${approval.status}</h1>`)
  }
  
  approval.status = 'rejected'
  pendingApprovals.set(token, approval)
  
  res.send(`
    <html>
      <head>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
          .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #f44336; }
          .email { color: #666; font-size: 18px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>❌ User Rejected</h1>
          <p class="email">${approval.email}</p>
          <p>The registration request has been denied.</p>
        </div>
      </body>
    </html>
  `)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
