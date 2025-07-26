import fetch from 'node-fetch';
import 'dotenv/config';

// Get API keys from environment variables
const apiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
const appNames = process.env.APP_NAMES ? process.env.APP_NAMES.split(',') : [];
const port = process.env.PORT || 4000;
const baseUrl = `http://localhost:${port}`;

// Test function to send email with authentication
async function testEmailWithAuth(apiKey, appName) {
  console.log(`\n--- Testing authentication for app: ${appName} ---`);
  
  try {
    // Test data
    const emailData = {
      to: process.env.TEST_RECIPIENT,
      subject: `Test Email from ${appName}`,
      htmlBody: `<h1>Test Email</h1><p>This is a test email from the ${appName} application.</p>`
    };

    // Send request with API key
    console.log(`Sending request with API key: ${apiKey.substring(0, 3)}...`);
    const response = await fetch(`${baseUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success! Status: ${response.status}`);
      console.log('Response:', data);
    } else {
      console.log(`❌ Failed! Status: ${response.status}`);
      console.log('Error:', data);
    }
    
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error('Error during test:', error.message);
    return { success: false, error: error.message };
  }
}

// Test function without API key
async function testWithoutApiKey() {
  console.log('\n--- Testing without API key ---');
  
  try {
    const emailData = {
      to: process.env.TEST_RECIPIENT,
      subject: 'Test Email without API Key',
      htmlBody: '<h1>Test Email</h1><p>This is a test email without API key.</p>'
    };

    console.log('Sending request without API key...');
    const response = await fetch(`${baseUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();
    
    console.log(`❌ Expected failure! Status: ${response.status}`);
    console.log('Response:', data);
    
    return { success: !response.ok, status: response.status, data };
  } catch (error) {
    console.error('Error during test:', error.message);
    return { success: false, error: error.message };
  }
}

// Test function with invalid API key
async function testWithInvalidApiKey() {
  console.log('\n--- Testing with invalid API key ---');
  
  try {
    const emailData = {
      to: process.env.TEST_RECIPIENT,
      subject: 'Test Email with Invalid API Key',
      htmlBody: '<h1>Test Email</h1><p>This is a test email with invalid API key.</p>'
    };

    console.log('Sending request with invalid API key...');
    const response = await fetch(`${baseUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'invalid_key_12345'
      },
      body: JSON.stringify(emailData)
    });

    const data = await response.json();
    
    console.log(`❌ Expected failure! Status: ${response.status}`);
    console.log('Response:', data);
    
    return { success: !response.ok, status: response.status, data };
  } catch (error) {
    console.error('Error during test:', error.message);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runTests() {
  console.log('Starting authentication tests...');
  console.log(`Server URL: ${baseUrl}`);
  console.log(`Number of API keys: ${apiKeys.length}`);
  console.log(`Number of app names: ${appNames.length}`);
  
  // Test with valid API keys
  const authResults = [];
  for (let i = 0; i < apiKeys.length && i < appNames.length; i++) {
    authResults.push(await testEmailWithAuth(apiKeys[i], appNames[i]));
  }
  
  // Test without API key
  const noKeyResult = await testWithoutApiKey();
  
  // Test with invalid API key
  const invalidKeyResult = await testWithInvalidApiKey();
  
  // Print summary
  console.log('\n--- Test Summary ---');
  console.log(`Valid API key tests: ${authResults.filter(r => r.success).length}/${authResults.length} passed`);
  console.log(`No API key test: ${noKeyResult.success ? 'Passed' : 'Failed'}`);
  console.log(`Invalid API key test: ${invalidKeyResult.success ? 'Passed' : 'Failed'}`);
  
  console.log('\nTests completed!');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});