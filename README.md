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
   ```

## Usage

The microservice expects a JSON payload with the following structure:

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
3. If your account is in the SES sandbox, you'll also need to verify recipient email addresses
