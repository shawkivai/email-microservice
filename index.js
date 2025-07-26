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

// Lambda handler function
export const handler = async (event) => {
  try {
    // Parse the incoming event body
    const body = JSON.parse(event.body);

    // Validate required fields
    if (!body || !body.to || !body.subject || !body.htmlBody) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields. Please provide to, subject, and htmlBody'
        })
      };
    }

    const { to, subject, htmlBody } = body;

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

    console.log('Sending email with params:', JSON.stringify(params, null, 2));

    console.log('Using AWS credentials:', {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 5) + '...' : 'undefined',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? 'present (hidden)' : 'undefined'
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

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        code: error.code,
        name: error.name
      })
    };
  }
};