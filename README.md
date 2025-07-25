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
   AWS_REGION=your_aws_region
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   FROM_EMAIL=your_verified_sender_email
   PORT=4000
   ```

## Running the Service

```bash
# Start the service
npm start

# Start with auto-reload during development
npm run dev

# Test AWS SES connectivity
npm run test-aws

# Send a test email
npm run test-email
```

## Usage

The microservice exposes an API endpoint for sending emails:

```
POST /send-email
```

Request body:

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "htmlBody": "<p>Your HTML email content</p>"
}
```

## AWS SES Configuration

1. Ensure your AWS account has SES enabled
2. Verify the sender email address in the AWS SES console
3. **Important:** New AWS accounts are placed in the SES sandbox by default

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
