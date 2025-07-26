# Email Microservice

A microservice for sending emails through AWS Simple Email Service (SES).

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env` file:
   ```
   # AWS SES Configuration
   SES_REGION=your_aws_region
   SES_ACCESS_KEY_ID=your_access_key_here
   SES_SECRET_ACCESS_KEY=your_secret_key_here
   FROM_EMAIL=your_verified_sender_email
   PORT=4000
   
   # API Authentication
   # Comma-separated list of API keys for each application
   API_KEYS=app1_key_12345,app2_key_67890,app3_key_abcde,app4_key_fghij,app5_key_klmno
   # Comma-separated list of application names (in the same order as API_KEYS)
   APP_NAMES=CRM,ERP,Website,Mobile,Analytics
   ```

## Running the Service

```bash
# Start the service (requires Node.js v16+)
npm start

# Start the service with Node.js v15 compatibility
npm run start:v15

# Start in development mode with auto-restart (requires Node.js v16+)
npm run dev

# Start in development mode with Node.js v15 compatibility
npm run dev:v15

# Test AWS SES connectivity
npm run test-aws

# Send a test email
npm run test-email

# Test authentication mechanism
npm run test-auth

# Run client example
npm run client-example

# Check environment variables
npm run check-env
```

### Node.js Version Compatibility

This service requires Node.js v16 or later by default. If you're using Node.js v15, use the v15-compatible scripts:

- `npm run start:v15` instead of `npm start`
- `npm run dev:v15` instead of `npm run dev`

The v15-compatible version (`index-v15.js`) is a modified version of the main code that avoids using features not supported in Node.js v15.

## Authentication

This microservice uses API key authentication to ensure only authorized applications can send emails. Each application must include its unique API key in the request headers.

### Setting Up API Keys

Add the following to your `.env` file:

```
# Comma-separated list of API keys for each application
API_KEYS=app1_key_12345,app2_key_67890,app3_key_abcde,app4_key_fghij,app5_key_klmno

# Comma-separated list of application names (in the same order as API_KEYS)
APP_NAMES=CRM,ERP,Website,Mobile,Analytics
```

### Using API Keys

When making requests to the email service, include the API key in the `X-API-Key` header:

```
X-API-Key: app1_key_12345
```

## Usage

Send an email by making a POST request to the `/send-email` endpoint with your API key in the header:

```json
POST /send-email
Content-Type: application/json
X-API-Key: your_api_key_here

{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "htmlBody": "<h1>Hello</h1><p>This is a test email.</p>"
}
```

### API Key Authentication

This service uses API key authentication to secure the email sending endpoint. Each application that needs to send emails must use its own API key.

#### Setting Up API Keys

1. Configure API keys in the `.env` file:
   ```
   # Comma-separated list of API keys for each application
   API_KEYS=app1_key_12345,app2_key_67890,app3_key_abcde,app4_key_fghij,app5_key_klmno
   # Comma-separated list of application names (in the same order as API_KEYS)
   APP_NAMES=CRM,ERP,Website,Mobile,Analytics
   ```

   **Important**: Ensure that the order of application names in `APP_NAMES` matches the order of keys in `API_KEYS`.

#### Using API Keys

1. Include the API key in the `X-API-Key` header when making requests to the service:
   ```
   X-API-Key: your_api_key_here
   ```

2. The service will:
   - Reject requests without an API key (401 Unauthorized)
   - Reject requests with invalid API keys (403 Forbidden)
   - Log which application is making the request based on the API key

#### Example Implementation

See `client-example.js` for a complete example of how to use the service with authentication:

```javascript
// Example of sending an email with API key authentication
async function sendEmail(apiKey, to, subject, htmlBody) {
  const response = await fetch('http://localhost:4000/send-email', {
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
  
  return await response.json();
}
```

#### Testing Authentication

Use the provided test script to verify that authentication is working correctly:

```bash
npm run test-auth
```

This will test:
- Sending emails with valid API keys
- Attempting to send without an API key (should fail)
- Attempting to send with an invalid API key (should fail)

## AWS SES Configuration

1. Ensure your AWS account has SES enabled
2. Verify the sender email address in the AWS SES console
3. **Important:** New AWS accounts are placed in the SES sandbox by default

## Troubleshooting

### No Logs Showing in Console

If you're not seeing any logs in the console, check the following:

1. **Node.js Version**: Ensure you're using Node.js v16+ or use the v15-compatible scripts if you have Node.js v15.

2. **Environment Variables**: Make sure your `.env` file is properly configured with all required variables:
   ```
   # AWS SES Configuration
   SES_REGION=your_aws_region
   SES_ACCESS_KEY_ID=your_access_key_here
   SES_SECRET_ACCESS_KEY=your_secret_key_here
   FROM_EMAIL=your_verified_sender_email
   PORT=4000
   
   # API Authentication
   API_KEYS=your_api_key_here
   APP_NAMES=Your App Name
   ```

3. **Syntax Errors**: If the server crashes immediately, check for syntax errors in the console output.

4. **Server Not Starting**: If you see an error like `SyntaxError: Unexpected token '{'`, it's likely a Node.js version compatibility issue. Use the v15-compatible scripts.

### Authentication Issues

If authentication is failing:

1. Check that your API key in the request header matches exactly what's in the `.env` file.
2. Ensure there are no extra spaces or quotes in the API_KEYS value in your `.env` file.
3. Run the environment check script to verify all environment variables:
   ```
   npm run check-env
   ```
   This will display all configured environment variables and identify any issues.

### About AWS SES Sandbox Mode

When your AWS account is in the SES sandbox:

1. You can only send emails to verified email addresses or domains
2. You must verify both sender and recipient email addresses
3. There are strict sending limits (typically 200 emails per 24 hours)
4. You cannot send emails to real recipients unless they are verified

### How to Verify Email Addresses in AWS SES

1. Go to the AWS SES Console
2. Navigate to "Verified Identities"
3. Click "Create identity"
4. Select "Email address" and enter the email address
5. Click "Create identity"
6. Check the inbox of the email address and click the verification link

### Moving Out of the Sandbox

To move out of the sandbox and send emails to any recipient:

1. Go to AWS SES Console
2. Click on "Account dashboard"
3. Under "Production access", click "Request production access"
4. Fill out the form with your use case details
5. Submit the request and wait for AWS approval (typically 1-2 business days)

## Troubleshooting AWS Connectivity Issues

### Common Issues

1. **Signature Mismatch Error**
   - This specific error indicates an authentication problem with your AWS credentials
   - Common causes:
     - Incorrect AWS access key or secret key
     - Extra quotes or spaces in your .env file values (e.g., `AWS_SECRET_ACCESS_KEY="your-key"` instead of `AWS_SECRET_ACCESS_KEY=your-key`)
     - Special characters in your secret key that need proper handling
     - Expired or revoked AWS credentials
     - Clock synchronization issues between your local machine and AWS servers
   - Solutions:
     - Double-check your AWS credentials in the AWS IAM console
     - Remove any quotes or extra spaces in your .env file
     - Create new access keys if necessary
     - Ensure your AWS user has the `ses:SendEmail` and `ses:SendRawEmail` permissions

2. **Local Development Challenges**
   - AWS IAM credentials must have SES permissions
   - Your AWS account may be in SES sandbox mode (limited functionality)
   - Network restrictions might prevent local connections to AWS

### Testing AWS Connectivity

Run the AWS connectivity test to diagnose issues:

```bash
npm run test-aws
```

This will check if your credentials are properly loaded and if the service can connect to AWS SES.

### Debugging Tips

- Check the console logs for detailed error information
- Verify that your AWS credentials are active and have the correct permissions
- Ensure your sender email is verified in the AWS SES console
- If in sandbox mode, verify that recipient emails are also verified
