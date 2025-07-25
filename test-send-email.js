import 'dotenv/config';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Function to send a test email
async function sendTestEmail() {
  console.log('Sending test email...');
  console.log('Environment variables:');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 5)}...` : 'undefined');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'present (hidden)' : 'undefined');
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

  // Replace with your test recipient email
  // Note: If your AWS account is in sandbox mode, this email must be verified
  const TEST_RECIPIENT = process.env.TEST_RECIPIENT || process.env.FROM_EMAIL;

  try {
    // Create SES client
    const ses = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    // Email parameters
    const params = {
      Destination: { 
        ToAddresses: [TEST_RECIPIENT] 
      },
      Message: {
        Body: {
          Html: { 
            Charset: "UTF-8", 
            Data: "<h1>Test Email</h1><p>This is a test email from the email microservice.</p>" 
          }
        },
        Subject: { 
          Charset: "UTF-8", 
          Data: "Test Email from Email Microservice" 
        }
      },
      Source: process.env.FROM_EMAIL
    };

    console.log('Sending email with params:', JSON.stringify(params, null, 2));
    
    // Send the email
    const command = new SendEmailCommand(params);
    await ses.send(command);
    
    console.log('Test email sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending test email:');
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Run the test
sendTestEmail().then(success => {
  console.log('\nTest completed:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
});