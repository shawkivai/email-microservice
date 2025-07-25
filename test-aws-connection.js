import 'dotenv/config';
import { SESClient } from "@aws-sdk/client-ses";

// Function to test AWS SES connectivity
async function testAwsConnection() {
  console.log('Testing AWS SES connectivity...');
  console.log('Environment variables:');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 5)}...` : 'undefined');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'present (hidden)' : 'undefined');
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

  try {
    // Create SES client
    const ses = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    // Test connection by making a simple API call
    console.log('Attempting to connect to AWS SES...');
    const response = await ses.config.credentials();
    console.log('Successfully connected to AWS SES!');
    console.log('Credentials retrieved:', response ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.error('Error connecting to AWS SES:');
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Run the test
testAwsConnection().then(success => {
  console.log('\nTest completed:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
});