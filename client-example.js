import fetch from 'node-fetch';

/**
 * Example client for the email microservice with authentication
 * 
 * This demonstrates how to send emails through the microservice
 * using API key authentication from different applications.
 */

// Configuration
const EMAIL_SERVICE_URL = 'http://localhost:4000/send-email';

// Example API keys for different applications
const API_KEYS = {
  CRM: 'app1_key_12345',
  ERP: 'app2_key_67890',
  Website: 'app3_key_abcde',
  Mobile: 'app4_key_fghij',
  Analytics: 'app5_key_klmno'
};

/**
 * Send an email through the microservice
 * 
 * @param {string} apiKey - The API key for authentication
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - Email HTML content
 * @returns {Promise<Object>} - Response from the email service
 */
async function sendEmail(apiKey, to, subject, htmlBody) {
  try {
    const response = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        to,
        subject,
        htmlBody
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Email service error: ${data.error || response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
}

/**
 * Example usage for CRM application
 */
async function sendCrmEmail() {
  try {
    const result = await sendEmail(
      API_KEYS.CRM,
      'customer@example.com',
      'Your CRM Account Update',
      '<h1>Account Updated</h1><p>Your CRM account has been successfully updated.</p>'
    );
    
    console.log('CRM email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send CRM email:', error.message);
  }
}

/**
 * Example usage for Website application
 */
async function sendWebsiteEmail() {
  try {
    const result = await sendEmail(
      API_KEYS.Website,
      'user@example.com',
      'Welcome to Our Website',
      '<h1>Welcome!</h1><p>Thank you for registering on our website.</p>'
    );
    
    console.log('Website email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send Website email:', error.message);
  }
}

// Run the examples
(async () => {
  console.log('Sending example emails...');
  
  await sendCrmEmail();
  await sendWebsiteEmail();
  
  console.log('Done!');
})();