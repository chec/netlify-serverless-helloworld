require('dotenv').config()
const crypto = require('crypto');
const axios = require('axios');

export async function handler(event, context) {
  let body = {};
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    // JSON parse failed, continue...
  }

  // Ensure the environment is configured
  const signingKey = process.env.WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Environment variable WEBHOOK_SIGNING_KEY is not defined.' }),
    };
  }

  // Extract the incoming webhook signature
  const { signature } = body;
  delete body.signature;

  // Verify the webhook signature
  const expectedSignature = crypto.createHmac('sha256', signingKey)
    .update(JSON.stringify(body))
    .digest('hex');

  if (expectedSignature !== signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error: Signature mismatch. Please check your Chec webhook signing key.' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello world!' }),
  };
}
