import 'dotenv/config';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import express from 'express';
const app = express();
app.use(express.json());

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const sendEmail = async (req, res) => {
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
  // Validate if request body exists and has required fields
  if (!req.body || !req.body.to || !req.body.subject || !req.body.htmlBody) {
    return res.status(400).json({ 
      error: 'Missing required fields. Please provide to, subject, and htmlBody' 
    });
  }

  console.log('Request body:', req.body);
  const { to, subject, htmlBody } = req.body;

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
    console.log('Sending email with params:', JSON.stringify(params, null, 2));
    console.log('Using AWS credentials:', {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 5) + '...' : 'undefined',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? 'present (hidden)' : 'undefined'
    });
    
    const command = new SendEmailCommand(params);
    await ses.send(command);
    console.log('Email sent successfully');
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      code: error.code,
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      name: error.name 
    });
  }
};

// Define routes
app.get('/', (req, res) => {
  res.json({ message: 'Email service is running' });
});

app.post('/send-email', sendEmail);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
