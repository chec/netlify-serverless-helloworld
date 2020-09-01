require('dotenv').config()
const crypto = require('crypto');
const axios = require('axios');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const helloWorldController = require('../controllers/helloWorldController');

router.post('/hello', [
  // Perform any validation here, for example:
  // body('payload.shipping.street', 'Shipping street is required').exists(),
], async (req, res, next) => {
  const errors = validationResult(req);

  // Ensure the environment is configured
  const signingKey = process.env.WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    res.status(500).json({
      message: 'Environment variable WEBHOOK_SIGNING_KEY is not defined.',
    });
  }

  // Extract the incoming webhook signature
  const { signature } = req.body;
  delete req.body.signature;

  // Verify the webhook signature
  const expectedSignature = crypto.createHmac('sha256', signingKey)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature !== signature) {
    res.status(400).json({
      message: 'Error: Signature mismatch. Please check your Chec webhook signing key.',
    });
  }

  // Validate the request
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Error: There was an error with the data provided.',
      body: errors.array()
    });
  }

  // Call your controller logic
  try {
    const response = await helloWorldController.hello_world(req, res);
    // Return a successful response if you'd like to
    res.json({
      message: 'OK',
      body: response,
    });
  } catch (err) {
    res.json({
      message: 'Whoops! Something went wrong.',
      body: err.message
    });
  }
});

app.use(bodyParser.json());
app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);
