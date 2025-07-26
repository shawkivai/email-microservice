import 'dotenv/config';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const ses = new SESClient({
  region: process.env.SES_REGION,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
  }
});

// Authentication helper
const authenticateApiKey = (apiKey) => {
  // Add more detailed logging to debug the apiKey value

  if (!apiKey || apiKey === 'undefined') {
    console.error('API key is missing or undefined');
    throw new Error('API key is required');
  }

  // Get the list of valid API keys from environment variables
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  console.log('Valid API keys loaded');
  
  if (!validApiKeys.includes(apiKey)) {
    console.warn(`Authentication failed: Invalid API key provided: ${apiKey.substring(0, 3)}...`);
    throw new Error('Invalid API key');
  }

  // Get the authenticated app name for logging
  const appNames = process.env.APP_NAMES ? process.env.APP_NAMES.split(',') : [];
  const appIndex = validApiKeys.indexOf(apiKey);
  return appIndex >= 0 && appIndex < appNames.length ? appNames[appIndex] : 'unknown';
};

export const handler = async (event) => {
  try {
    // Parse the incoming SNS message
    const snsMessage = JSON.parse(event.Records[0].Sns.Message);
    
    // Log the raw message for debugging
    console.log('Raw SNS message:', JSON.stringify(snsMessage));
    
    const { to, subject, htmlBody, apiKey } = snsMessage;
    
    // Validate apiKey before authentication
    if (!apiKey) {
      console.error('API key not found in SNS message');
      throw new Error('API key is required');
    }

    try {
      const appName = authenticateApiKey(apiKey);
      console.log(`Request authenticated for app: ${appName}`);
    } catch (authError) {
      console.error('Authentication error:', authError.message);
      throw authError; // Let the error be caught by the main try-catch
    }

    // Validate required fields
    if (!to || !subject || !htmlBody) {
      throw new Error('Missing required fields. Please provide to, subject, and htmlBody');
    }

    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: {
          Html: { Charset: "UTF-8", Data: htmlBody }
        },
        Subject: { Charset: "UTF-8", Data: subject }
      },
      Source: process.env.FROM_EMAIL
    };

    console.log(`Sending email with params:`, JSON.stringify(params, null, 2));

    console.log('Using AWS credentials:', {
      region: process.env.SES_REGION,
      accessKeyId: process.env.SES_ACCESS_KEY_ID ? process.env.SES_ACCESS_KEY_ID.substring(0, 5) + '...' : 'undefined',
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY ? 'present (hidden)' : 'undefined'
    });
    
    const command = new SendEmailCommand(params);
    await ses.send(command);
    console.log('Email sent successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      code: error.code,
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Since this is triggered by SNS, we should let the error propagate
    // to trigger the SNS retry policy instead of returning an HTTP response
    throw error;
  }
};
