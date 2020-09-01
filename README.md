# Commerce.js "hello world" serverless function on Netlify

This template provides a simple template to use for Netlify serverless functions with Express.js as a framework.
You can connect your Commerce.js store to functions like this in order to extend the options for functionality on
a Jamstack environment.

Some examples of things you could do:

* Print "Hello world!" to the console
* Automatically generate a discount code when a cart reaches a certain value threshold, and apply it to the cart
* Send your customers SMS messages when their orders are fulfilled

## Requirements

* Node.js
* Yarn or npm

## Getting started

You may clone this repository and deploy it straight to Netlify, although it may be better if you already have a
project on Netlify to include it as part of your existing project. For this example we'll assume you're doing some
local development to start with.

### Environment variables

* `WEBHOOK_SIGNING_KEY`: The Chec webhook signing key, which is available from
  [the "Webhooks" section of the Chec Dashboard](https://dashboard.chec.io/settings/webhooks)

### Local development

Clone the repository, install dependencies, then start your Express.js server:

```
git clone git@github.com:chec/netlify-serverless-helloworld.git
cd netlify-serverless-helloworld
yarn
yarn start

...
Lambda server is listening on 9000
```

Once your server is running it will be accessible at `http://localhost:9000/.netlify/functions/api`. This represents
your base function name "api", and actions such as `POST /hello` will be accessible as sub-routes of this.

For example, at this point you can ping your server with cURL and you should receive an error for missing
environment variables:

```
curl -X POST http://localhost:9000/.netlify/functions/api/hello
{"message":"Environment variable WEBHOOK_SIGNING_KEY is not defined."}
```

## Configuring a Chec webhook

Serverless functions such as this example can be triggered in a number of ways, but the most common ways will be
(A) by a webhook in the Chec Platform, or (B) manually as part of your frontend checkout flow.

To test this out you may wish to use webhooks. You can set these up easily from the
[Chec Dashboard](https://dashboard.chec.io/settings/webhooks) under Developer > Webhooks. Select a common event such
as `products.update`, enter a _publicly accessible URL for your local server_ (hint: use [ngrok](https://ngrok.com) for
a local development proxy), and copy your webhook signing key into your `.env` file here. You'll need to restart your
local server to pick up the new environment variable.

Go and send a test request for your webhook, or change a product name a few times. If all goes well, you should see
the following in your server log:

```
Request from 174.6.112.215: POST /.netlify/functions/api/hello
Hello world
Response with status 200 in 57 ms.
```

## Deploying to Netlify

todo

## License

This project is licensed under BSD-3-Clause. See [the license](LICENSE.md) for information.
