import 'dotenv/config';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const handler = async (event) => {
  const { to, subject, htmlBody } = JSON.parse(event.body);

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

  try {
    const command = new SendEmailCommand(params);
    await ses.send(command);
    return { 
      statusCode: 200, 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: "Email sent successfully" }) 
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      statusCode: 500, 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
