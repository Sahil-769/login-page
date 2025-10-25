// Quick test to verify Brevo API configuration
require('dotenv').config()
const brevo = require('@getbrevo/brevo')

console.log('Testing Brevo API Configuration...\n')

// Check if API key is set
if (!process.env.BREVO_API_KEY) {
  console.error('❌ ERROR: BREVO_API_KEY is not set in .env file')
  process.exit(1)
}

console.log('✓ API Key found:', process.env.BREVO_API_KEY.substring(0, 20) + '...')
console.log('✓ From Email:', process.env.FROM_EMAIL)
console.log('✓ Admin Email:', process.env.ADMIN_EMAIL)

// Test API connection
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

async function testConnection() {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()
    
    sendSmtpEmail.sender = { 
      name: process.env.FROM_NAME || 'Vidyasaar Institute',
      email: process.env.FROM_EMAIL || 'sahilalvi769@gmail.com'
    }
    sendSmtpEmail.to = [{ email: process.env.ADMIN_EMAIL || 'sahilalvi769@gmail.com' }]
    sendSmtpEmail.subject = 'Test Email - Brevo API Connection'
    sendSmtpEmail.htmlContent = `
      <h1>✅ Brevo API Test Successful!</h1>
      <p>Your Brevo API is configured correctly.</p>
      <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
    `
    sendSmtpEmail.textContent = 'Brevo API Test Successful! Your configuration is working.'

    console.log('\nSending test email...')
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    
    console.log('\n✅ SUCCESS! Email sent successfully!')
    console.log('Message ID:', data.messageId)
    console.log('\nCheck your email:', process.env.ADMIN_EMAIL)
    console.log('\n🎉 Your Brevo API is working perfectly!')
    
  } catch (error) {
    console.error('\n❌ ERROR sending email:')
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Response:', error.response.body)
    }
    process.exit(1)
  }
}

testConnection()
